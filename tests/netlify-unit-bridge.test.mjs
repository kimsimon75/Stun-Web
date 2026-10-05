import test from 'node:test';
import assert from 'node:assert/strict';
import core from '../unit-bridge/core.cjs';
import { createHandler } from '../netlify/functions/unit-snapshots.mjs';

const token = 'a'.repeat(64);
const snapshot = {
    kind: 'live-observer', mapVersion: '2.323', gameTimeMs: 12000, mapName: 'ORDR 2.323',
    players: [{ playerId: 0, name: 'Player' }],
    units: [{ playerId: 0, typeId: 'h02E', count: 2 }],
};

test('실시간 스냅샷을 검증하고 중복 rawcode를 거부한다', () => {
    assert.equal(core.normalizeSnapshot(snapshot).total, 2);
    assert.equal(core.normalizeSnapshot({ ...snapshot, kind: 'live-replay' }).kind, 'live-replay');
    assert.throws(() => core.normalizeSnapshot({ ...snapshot, units: [...snapshot.units, ...snapshot.units] }));
    assert.throws(() => core.normalizeSnapshot({ ...snapshot, players: [{ playerId: 28, name: 'bad' }] }));
});

test('쓰기 토큰과 파생 조회 토큰을 분리한다', async () => {
    let saved;
    const handler = createHandler({ token, now: () => new Date('2026-10-06T00:00:00Z'), store: () => ({
        setJSON: async (_key, value) => { saved = value; }, get: async () => saved,
    }) });
    const post = new Request('https://example.netlify.app/.netlify/functions/unit-snapshots', {
        method: 'POST', headers: { authorization: `Bearer ${token}` }, body: JSON.stringify(snapshot),
    });
    assert.equal((await handler(post)).status, 200);
    assert.equal(saved.receivedAt, '2026-10-06T00:00:00.000Z');

    const get = new Request('https://example.netlify.app/.netlify/functions/unit-snapshots', {
        headers: { authorization: `Bearer ${core.readToken(token)}` },
    });
    assert.equal((await (await handler(get)).json()).total, 2);
    const wrong = new Request(get.url, { headers: { authorization: `Bearer ${token}` } });
    assert.equal((await handler(wrong)).status, 401);
});
