const catalog = require('./catalog.json');
function identify(data) {
    if (data?.mapVersion !== '2.322' || !Array.isArray(data.units) || data.units.length > 20000) throw new Error('2.322 유닛 스냅샷이 필요합니다.');
    const seen = new Set(), groups = new Map();
    for (const u of data.units) {
        if (!u || typeof u.instanceId !== 'string' || !u.instanceId || u.instanceId.length > 128 || seen.has(u.instanceId)
            || !Number.isInteger(u.playerId) || u.playerId < 0 || u.playerId > 27
            || (u.alive !== undefined && typeof u.alive !== 'boolean')) throw new Error('유닛 형식 또는 중복 ID 오류');
        seen.add(u.instanceId);
        let id = u.typeId;
        if (Number.isInteger(id) && id >= -2147483648 && id <= 4294967295) {
            const bytes = Buffer.alloc(4); bytes.writeUInt32BE(id >>> 0); id = bytes.toString('latin1');
        }
        if (typeof id !== 'string' || !/^[\x20-\x7e]{4}$/.test(id)) throw new Error('유닛 rawcode 오류');
        if (u.alive === false) continue;
        const key = `${u.playerId}:${id}`, object = catalog[id];
        if (!groups.has(key)) groups.set(key, { playerId: u.playerId, typeId: id, name: object?.heroName || object?.name || `미확인 (${id})`, known: !!object, count: 0 });
        groups.get(key).count++;
    }
    const units = [...groups.values()];
    return { mapVersion: '2.322', units, total: units.reduce((sum, u) => sum + u.count, 0) };
}
function parse(text) {
    const start = text.indexOf('"'), end = text.lastIndexOf('"');
    if (start < 0 || end <= start) throw new Error('networkio 요청 형식 오류');
    const request = JSON.parse(text.slice(start + 1, end));
    if (request.noResponse !== true || typeof request.body !== 'string' || (request.method && request.method !== 'POST')) throw new Error('POST/noResponse 요청이 필요합니다.');
    return { url: request.url, data: JSON.parse(request.body) };
}
function endpoint(value) {
    const url = new URL(value);
    if (url.protocol !== 'https:' || !/^[a-z0-9-]+\.netlify\.app$/.test(url.hostname)
        || url.username || url.password || url.port || url.search || url.hash
        || url.pathname !== '/.netlify/functions/unit-snapshots') throw new Error('Netlify 유닛 수신 URL이 올바르지 않습니다.');
    return url.href;
}
async function send(data, config, fetchImpl = fetch) {
    const url = endpoint(config.UNIT_API_URL);
    if (!/^[a-f0-9]{64}$/.test(config.UNIT_BRIDGE_TOKEN || '')) throw new Error('UNIT_BRIDGE_TOKEN 설정이 필요합니다.');
    const response = await fetchImpl(url, { method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
        headers: { 'content-type': 'application/json', authorization: `Bearer ${config.UNIT_BRIDGE_TOKEN}` }, body: JSON.stringify(data) });
    if (!response.ok) throw new Error(`Netlify 전송 실패: HTTP ${response.status}`);
    if ((await response.json()).accepted !== true) throw new Error('Netlify 응답 형식 오류');
}
module.exports = { identify, parse, send, endpoint };
