import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { createHandler } = require('../aws/publish-patch/index.cjs');
const { publishViaApi } = require('../publish-via-api.cjs');
const input = { version: 'test-1', date: '2026-09-27', markdown: '# Patch' };
const testToken = 'test-token-that-is-at-least-32-characters-long';
const event = (data, token = testToken) => ({ rawPath: '/patchnotes', requestContext: { http: { method: 'POST' } }, headers: { authorization: `Bearer ${token}` }, body: JSON.stringify(data) });
function fixture({ failAt, badIndex = false, notifyFail = false } = {}) {
    const calls = []; let notified = 0;
    const handler = createHandler({ publishToken: testToken, s3: { async send(command) {
        calls.push(command.input);
        if (calls.length === failAt) throw Object.assign(new Error(), { name: 'PreconditionFailed' });
        if (calls.length === 1) return { ETag: 'etag', Body: { transformToString: async () => badIndex ? '{}' : '[{"version":"old","date":"2026-09-01"}]' } };
        return {};
    } }, notify: async () => { notified++; if (notifyFail) throw new Error(); } });
    return { handler, calls, notified: () => notified };
}
test('Lambda publishes in order, preserves index and notifies after saving', async () => {
    const f = fixture(); const r = await f.handler(event(input));
    assert.equal(r.statusCode, 200); assert.equal(JSON.parse(r.body).published, true);
    assert.equal(f.calls[1].Key, 'patchnotes/test-1.md'); assert.equal(f.calls[2].IfMatch, 'etag');
    assert.equal(JSON.parse(f.calls[2].Body)[1].version, 'old'); assert.equal(f.notified(), 1);
});
test('validation and preview cannot write', async () => {
    for (const data of [null, { ...input, version: '../index' }, { ...input, date: '2026-02-30' }, { ...input, replace: 'true' }]) {
        const f = fixture(); assert.equal((await f.handler(event(data))).statusCode, 400); assert.equal(f.calls.length, 0);
    }
    const f = fixture(); assert.equal((await f.handler(event({ ...input, dryRun: true }))).statusCode, 200);
    assert.equal(f.calls.length, 1); assert.equal(f.notified(), 0);
});
test('missing or invalid publishing tokens are rejected before S3 access', async () => {
    const f = fixture();
    assert.equal((await f.handler(event(input, 'wrong-token'))).statusCode, 401);
    assert.equal((await f.handler({ ...event(input), headers: {} })).statusCode, 401);
    assert.equal(f.calls.length, 0);
});
test('corrupt index and write conflicts never notify', async () => {
    for (const options of [{ badIndex: true }, { failAt: 2 }, { failAt: 3 }]) {
        const f = fixture(options); const r = await f.handler(event(input));
        assert(r.statusCode >= 400); assert.equal(f.notified(), 0);
        assert.equal(JSON.parse(r.body).bodySaved, options.failAt === 3);
    }
});
test('notification failure preserves publication success', async () => {
    const f = fixture({ notifyFail: true }); const result = JSON.parse((await f.handler(event(input))).body);
    assert.equal(result.published, true); assert.equal(result.notification, 'failed');
});
test('Node sends the publishing token without AWS credentials', async () => {
    const response = await publishViaApi(input, {
        endpoint: 'https://example.execute-api.ap-northeast-2.amazonaws.com/patchnotes',
        token: testToken,
        fetchImpl: async (url, request) => {
            assert.equal(request.headers.authorization, `Bearer ${testToken}`);
            assert.deepEqual(JSON.parse(request.body), input);
            return { ok: true, json: async () => ({ published: true }) };
        },
    });
    assert.equal(response.published, true);
});
