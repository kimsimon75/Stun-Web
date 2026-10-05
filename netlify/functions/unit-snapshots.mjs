import { getStore } from '@netlify/blobs';
import { timingSafeEqual } from 'node:crypto';
import core from '../../unit-bridge/core.cjs';

export function createHandler({ token, store, now = () => new Date() }) {
    return async request => {
        const json = (value, status = 200) => Response.json(value, {
            status,
            headers: { 'cache-control': 'no-store, max-age=0' },
        });
        if (!token || !/^[a-f0-9]{64}$/.test(token)) return json({ message: 'Server token not configured' }, 503);

        const credential = request.method === 'GET' ? core.readToken(token) : token;
        const supplied = Buffer.from(request.headers.get('authorization') || '');
        const expected = Buffer.from(`Bearer ${credential}`);
        if (supplied.length !== expected.length || !timingSafeEqual(supplied, expected)) return json({ message: 'Unauthorized' }, 401);

        if (request.method === 'GET') {
            return json(await store().get('latest', { type: 'json' }) || { kind: 'live-observer', units: [], players: [], total: 0 });
        }
        if (request.method !== 'POST') return json({ message: 'Method not allowed' }, 405);

        let data;
        try {
            const text = await request.text();
            if (Buffer.byteLength(text) > 1_048_576) return json({ message: 'Too large' }, 413);
            data = core.normalizeSnapshot(JSON.parse(text));
        } catch {
            return json({ message: 'Invalid snapshot' }, 400);
        }
        const saved = { ...data, receivedAt: now().toISOString() };
        await store().setJSON('latest', saved);
        return json({ accepted: true, total: saved.total });
    };
}

export default async request => {
    try {
        const store = () => getStore({ name: 'stun-unit-snapshots', consistency: 'strong' });
        return await createHandler({ token: process.env.UNIT_BRIDGE_TOKEN, store })(request);
    } catch (error) {
        console.error('unit-snapshots:', error);
        return Response.json({ message: 'Storage failure' }, { status: 500 });
    }
};
