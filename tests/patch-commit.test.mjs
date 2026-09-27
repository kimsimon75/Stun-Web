import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
const { publish, publishAndNotify } = createRequire(import.meta.url)('../patch-commit.cjs');
const { notifyUpdate } = createRequire(import.meta.url)('../notify-update.cjs');
const { getUpdateEndpoint } = createRequire(import.meta.url)('../publish-config.cjs');
const testEnv = { UPDATE_API_URL: 'https://example.com/webhook' };
const options = { version: '2.322-fix1', markdown: '# 수정', date: '2026-09-27' };
function fake(failAt) {
    const calls = [];
    return { calls, async send(command) {
        calls.push(command);
        if (calls.length === failAt) throw Object.assign(new Error('test'), { name: 'AccessDenied' });
        if (calls.length === 1) return { ETag: 'old-etag', Body: { transformToString: async () => '[{"version":"old","date":"2026-09-01","extra":true}]' } };
        return {};
    } };
}
test('uploads body before index and preserves existing entries with conditional write', async () => {
    const client = fake();
    await publish(client, options);
    assert.equal(client.calls[1].input.Key, 'patchnotes/2.322-fix1.md');
    assert.equal(client.calls[1].input.IfNoneMatch, '*');
    assert.equal(client.calls[2].input.IfMatch, 'old-etag');
    const entries = JSON.parse(client.calls[2].input.Body);
    assert.equal(entries[0].version, options.version);
    assert.equal(entries[1].extra, true);
});
test('preview does not write', async () => {
    const client = fake();
    await publish(client, { ...options, dryRun: true });
    assert.equal(client.calls.length, 1);
});
test('read or body failure prevents index writes', async () => {
    for (const failAt of [1, 2]) {
        const client = fake(failAt);
        await assert.rejects(publish(client, options));
        assert.equal(client.calls.length, failAt);
    }
});
test('index failure reports partial upload', async () => {
    await assert.rejects(publish(fake(3), options), /본문은 업로드됐지만/);
});

test('notification follows both writes and is skipped on preview or failure', async () => {
    const client = fake();
    let notified = 0;
    await publishAndNotify(client, options, async () => { assert.equal(client.calls.length, 3); notified++; });
    await publishAndNotify(fake(), { ...options, dryRun: true }, async () => { notified++; });
    await assert.rejects(publishAndNotify(fake(3), options, async () => { notified++; }));
    assert.equal(notified, 1);
});

test('webhook uses POST and rejects unsuccessful responses', async () => {
    await notifyUpdate(async (url, request) => {
        assert.equal(new URL(url).pathname, '/webhook');
        assert.equal(request.method, 'POST');
        return { ok: true, json: async () => ({ message: '✅ 업데이트 알림 전송 완료!' }) };
    }, testEnv);
    await assert.rejects(notifyUpdate(async () => ({ ok: false, status: 403 }), testEnv), /403/);
    await assert.rejects(publishAndNotify(fake(), options, async () => { throw new Error('timeout'); }), /저장은 완료됐지만/);
});

test('missing or invalid endpoint is rejected before any request', async () => {
    let requests = 0;
    await assert.rejects(notifyUpdate(async () => { requests++; }, {}), /UPDATE_API_URL/);
    assert.equal(requests, 0);
    for (const address of ['invalid', 'http://example.com', 'https://user:password@example.com', 'https://example.com/#token']) {
        assert.throws(() => getUpdateEndpoint({ UPDATE_API_URL: address }), /HTTPS/);
    }
    assert.equal(getUpdateEndpoint(testEnv), testEnv.UPDATE_API_URL);
});
