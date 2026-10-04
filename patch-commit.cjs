const { readFile } = require('node:fs/promises');
const { S3Client, GetObjectCommand, PutObjectCommand } = require('@aws-sdk/client-s3');
const { notifyUpdate } = require('./notify-update.cjs');
const { loadPublishEnv, getUpdateEndpoint } = require('./publish-config.cjs');

async function publishAndNotify(client, options, notify = notifyUpdate) {
    if (!options.dryRun && notify === notifyUpdate) getUpdateEndpoint();
    const result = await publish(client, options);
    if (!result.dryRun) {
        try { await notify(); }
        catch (error) {
            throw new Error(`패치노트 저장은 완료됐지만 알림 요청에 실패했습니다: ${error.message}\n게시 상태를 확인한 뒤 node notify-update.cjs로 알림만 재시도하세요.`);
        }
    }
    return result;
}

function updateIndex(entries, version, date) {
    if (!Array.isArray(entries) || entries.some(e => !e || typeof e.version !== 'string' || typeof e.date !== 'string')) {
        throw new Error('기존 index.json 형식이 잘못됐습니다. 업로드를 중단합니다.');
    }
    return [{ version, date }, ...entries.filter(e => e.version !== version)];
}

async function publish(client, { version, markdown, date, dryRun = false, replace = false }) {
    const Bucket = 'patchnote';
    const Key = 'patchnotes/index.json';
    let entries = [], etag;
    try {
        const current = await client.send(new GetObjectCommand({ Bucket, Key }));
        etag = current.ETag;
        if (!etag) throw new Error('버전 목록의 ETag를 확인할 수 없습니다.');
        entries = JSON.parse(await current.Body.transformToString());
    } catch (error) {
        // 권한/통신 오류를 빈 목록으로 처리하면 기존 이력을 잃을 수 있습니다.
        if (error.name !== 'NoSuchKey') throw error;
    }
    const next = updateIndex(entries, version, date);
    if (entries.some(e => e.version === version) && !replace) {
        throw new Error('이미 등록된 버전입니다. 본문을 교체하려면 --replace를 사용하세요.');
    }
    if (dryRun) return { dryRun, index: next };
    // 본문을 먼저 저장하여 목록에 없는 파일이 등록되는 것을 방지합니다.
    await client.send(new PutObjectCommand({
        Bucket, Key: `patchnotes/${version}.md`, Body: markdown,
        ContentType: 'text/markdown; charset=utf-8', CacheControl: 'no-cache',
        ...(replace ? {} : { IfNoneMatch: '*' }),
    }));
    try {
        await client.send(new PutObjectCommand({
            Bucket, Key, Body: JSON.stringify(next, null, 2) + '\n',
            ContentType: 'application/json; charset=utf-8', CacheControl: 'no-cache',
            ...(etag ? { IfMatch: etag } : { IfNoneMatch: '*' }),
        }));
    } catch (error) {
        throw new Error(`본문은 업로드됐지만 버전 목록 갱신에 실패했습니다 (${error.name}). 목록 확인 후 같은 명령에 --replace를 붙여 재시도하세요.`);
    }
    return { url: `https://patchnote.s3.ap-northeast-2.amazonaws.com/patchnotes/${encodeURIComponent(version)}.md` };
}

async function main(args) {
    if (!args.length || args.includes('--help')) {
        console.log('사용법: node patch-commit.cjs <버전> <본문.md> [--dry-run] [--replace]\n예: node patch-commit.cjs 2.322-fix1 patchnotes/patchnote.md');
        return;
    }
    const [version, file, ...flags] = args;
    if (!/^[A-Za-z0-9][A-Za-z0-9._\[\]-]{0,79}$/.test(version) || !file || flags.some(f => !['--dry-run', '--replace'].includes(f))) {
        throw new Error('버전·본문 파일 경로·옵션을 확인하세요. --help로 사용법을 볼 수 있습니다.');
    }
    loadPublishEnv();
    const markdown = await readFile(file, 'utf8');
    if (!markdown.trim()) throw new Error('패치노트 본문이 비어 있습니다.');
    const date = new Intl.DateTimeFormat('sv-SE', { timeZone: 'Asia/Seoul' }).format(new Date());
    const { publishViaApi } = require('./publish-via-api.cjs');
    const result = await publishViaApi({ version, markdown, date, dryRun: flags.includes('--dry-run'), replace: flags.includes('--replace') });
    console.log(result.dryRun ? `게시 미리보기:\n${JSON.stringify(result.index, null, 2)}` : `패치노트 게시 완료: ${version}`);
    if (result.notification === 'failed') console.warn('저장은 완료됐으나 알림 요청에 실패했습니다. 본문을 다시 게시하지 말고 알림만 재시도하세요.');
}

if (require.main === module) main(process.argv.slice(2)).catch(error => {
    console.error(error.message);
    process.exitCode = 1;
});
module.exports = { publish, updateIndex, publishAndNotify };
