const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { timingSafeEqual } = require('node:crypto');

const reply = (statusCode, data) => ({ statusCode, headers: { 'content-type': 'application/json; charset=utf-8' }, body: JSON.stringify(data) });

function hasValidToken(event, expectedToken) {
    if (typeof expectedToken !== 'string' || expectedToken.length < 32) return false;
    const headers = event.headers || {};
    const authorization = headers.authorization ?? headers.Authorization ?? '';
    const suppliedToken = authorization.startsWith('Bearer ') ? authorization.slice(7) : '';
    const supplied = Buffer.from(suppliedToken);
    const expected = Buffer.from(expectedToken);
    return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

function createHandler({ s3, notify, bucket = 'patchnote', publishToken }) {
    return async event => {
        if (event.requestContext?.http?.method !== 'POST' || event.rawPath !== '/patchnotes') {
            return reply(404, { message: '올바르지 않은 경로입니다.' });
        }
        if (!hasValidToken(event, publishToken)) return reply(401, { message: '게시 인증에 실패했습니다.' });
        let input;
        try {
            const body = event.isBase64Encoded ? Buffer.from(event.body, 'base64').toString('utf8') : event.body;
            input = JSON.parse(body);
        } catch { return reply(400, { message: 'JSON 본문이 필요합니다.' }); }
        if (!input || typeof input !== 'object' || Array.isArray(input)) return reply(400, { message: '잘못된 입력입니다.' });
        const { version, markdown, date, dryRun = false, replace = false } = input;
        if (typeof version !== 'string' || !/^[A-Za-z0-9][A-Za-z0-9._\[\]-]{0,79}$/.test(version)
            || typeof markdown !== 'string' || !markdown.trim() || Buffer.byteLength(markdown) > 262144
            || typeof date !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(date)
            || !Number.isFinite(Date.parse(date)) || new Date(date).toISOString().slice(0, 10) !== date
            || typeof dryRun !== 'boolean' || typeof replace !== 'boolean') {
            return reply(400, { message: '버전, 본문(최대 256KB), 날짜 또는 옵션이 올바르지 않습니다.' });
        }
        let entries = [], etag, bodySaved = false;
        try {
            try {
                const obj = await s3.send(new GetObjectCommand({ Bucket: bucket, Key: 'patchnotes/index.json' }));
                etag = obj.ETag;
                if (!etag) throw new Error('Missing ETag');
                entries = JSON.parse(await obj.Body.transformToString());
            } catch (error) { if (error.name !== 'NoSuchKey') throw error; }
            if (!Array.isArray(entries) || entries.some(e => !e || typeof e.version !== 'string' || typeof e.date !== 'string')) throw new Error('Invalid index');
            if (!replace && entries.some(e => e.version === version)) return reply(409, { message: '이미 등록된 버전입니다. 교체하려면 replace를 지정하세요.' });
            const index = [{ version, date }, ...entries.filter(e => e.version !== version)];
            if (dryRun) return reply(200, { dryRun: true, index });
            await s3.send(new PutObjectCommand({ Bucket: bucket, Key: `patchnotes/${version}.md`, Body: markdown,
                ContentType: 'text/markdown; charset=utf-8', CacheControl: 'no-cache', ...(replace ? {} : { IfNoneMatch: '*' }) }));
            bodySaved = true;
            await s3.send(new PutObjectCommand({ Bucket: bucket, Key: 'patchnotes/index.json', Body: JSON.stringify(index, null, 2) + '\n',
                ContentType: 'application/json; charset=utf-8', CacheControl: 'no-cache', ...(etag ? { IfMatch: etag } : { IfNoneMatch: '*' }) }));
        } catch (error) {
            console.error('Publish failed', error.name);
            return reply(['PreconditionFailed', 'ConditionalRequestConflict'].includes(error.name) ? 409 : 500,
                { published: false, bodySaved, message: bodySaved ? '본문 저장 후 목록 갱신에 실패했습니다. 현재 목록을 확인하고 replace로 재시도하세요.' : '저장 실패. 권한 및 기존 목록을 확인하세요.' });
        }
        let notification = 'accepted';
        try { await notify(); }
        catch (error) { notification = 'failed'; console.error('Notification failed', error.name); }
        return reply(200, { published: true, notification, version });
    };
}

let runtimeHandler;
exports.handler = async event => {
    if (!runtimeHandler) {
        const { LambdaClient, InvokeCommand } = require('@aws-sdk/client-lambda');
        const lambda = new LambdaClient({});
        runtimeHandler = createHandler({
            s3: new S3Client({}), bucket: process.env.PATCH_BUCKET,
            publishToken: process.env.PUBLISH_TOKEN,
            notify: async () => {
                const response = await lambda.send(new InvokeCommand({ FunctionName: process.env.NOTIFY_FUNCTION,
                    InvocationType: 'RequestResponse', Payload: Buffer.from(JSON.stringify({ requestContext: { routeKey: 'POST /webhook' } })) }));
                const result = JSON.parse(Buffer.from(response.Payload || []).toString('utf8'));
                if (response.FunctionError || result.statusCode !== 200) throw new Error('NotificationRejected');
            },
        });
    }
    return runtimeHandler(event);
};
exports.createHandler = createHandler;
