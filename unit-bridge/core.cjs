const catalog = require('./catalog.json');
const replayCatalog = require('./replay/catalog-2.323.json');
const {rules:traitRules}=require('./replay/trait-transitions.cjs');
const { createHash } = require('node:crypto');
function readToken(token) { return createHash('sha256').update('stun-read-v1:'+token).digest('hex'); }
function normalizeSnapshot(data) {
    if(data?.kind !== 'replay-observations') return identify(data);
    if(data.mapVersion !== '2.323' || !/^[a-f0-9]{64}$/.test(data.replayId || '')
        || !Number.isSafeInteger(data.replayTimeMs) || data.replayTimeMs < 0 || data.replayTimeMs > 86400000
        || !Number.isSafeInteger(data.combinationAttempts) || data.combinationAttempts < 0 || data.combinationAttempts > 100000
        || !Array.isArray(data.units) || data.units.length > 20000) throw new Error('리플레이 관측 형식 오류');
    const traitTransitions=data.traitTransitions??[];
    if(!Array.isArray(traitTransitions)||traitTransitions.length>20000)throw new Error('특강 전환 형식 오류');
    const replaced=new Set(),targets=new Set(),byId=new Map(data.units.map(u=>[u?.instanceId,u]));
    for(const t of traitTransitions){
        const rule=traitRules[t?.abilityId],from=byId.get(t?.fromInstanceId),to=byId.get(t?.toInstanceId);
        if(!rule||!from||!to||from===to||replaced.has(t.fromInstanceId)||targets.has(t.toInstanceId)
            ||t.fromTypeId!==rule[0]||t.toTypeId!==rule[1]||from.typeId!==rule[0]||to.typeId!==rule[1]
            ||from.observerPlayerId!==t.observerPlayerId||to.observerPlayerId!==t.observerPlayerId
            ||!Number.isSafeInteger(t.timeMs)||t.timeMs<0||t.timeMs>data.replayTimeMs
            ||from.lastSeenMs>t.timeMs||to.lastSeenMs<t.timeMs)throw new Error('특강 전환 형식 오류');
        replaced.add(t.fromInstanceId);targets.add(t.toInstanceId);
    }
    const seen=new Set(), groups=new Map();
    for(const u of data.units) {
        if(!u || !/^\d+:\d+$/.test(u.instanceId || '') || u.instanceId.length>32 || seen.has(u.instanceId)
            || !/^[\x20-\x7e]{4}$/.test(u.typeId || '') || !Number.isInteger(u.observerPlayerId) || u.observerPlayerId<1 || u.observerPlayerId>24
            || !Number.isSafeInteger(u.lastSeenMs) || u.lastSeenMs<0 || u.lastSeenMs>data.replayTimeMs) throw new Error('관측 유닛 형식 오류');
        seen.add(u.instanceId);
        if(replaced.has(u.instanceId))continue;
        const key=u.observerPlayerId+':'+u.typeId, definition=replayCatalog[u.typeId];
        if(!groups.has(key)) groups.set(key,{observerPlayerId:u.observerPlayerId,typeId:u.typeId,name:definition?.heroName||definition?.name||`미확인 (${u.typeId})`,known:!!definition,count:0,lastSeenMs:0});
        const group=groups.get(key);group.count++;group.lastSeenMs=Math.max(group.lastSeenMs,u.lastSeenMs);
    }
    return {kind:data.kind,mapVersion:data.mapVersion,replayId:data.replayId,replayTimeMs:data.replayTimeMs,combinationAttempts:data.combinationAttempts,units:[...groups.values()],total:seen.size-replaced.size,traitTransitions};
}
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
module.exports = { identify, parse, send, endpoint, normalizeSnapshot, readToken };
