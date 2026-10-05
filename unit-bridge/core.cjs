const { createHash } = require('node:crypto');

function readToken(token) {
    return createHash('sha256').update(`stun-read-v1:${token}`).digest('hex');
}

function normalizeSnapshot(data) {
    if (!['live-observer', 'live-replay'].includes(data?.kind) || data.mapVersion !== '2.323'
        || !Number.isSafeInteger(data.gameTimeMs) || data.gameTimeMs < 0 || data.gameTimeMs > 86_400_000
        || !Array.isArray(data.players) || data.players.length > 28
        || !Array.isArray(data.units) || data.units.length > 27_972) {
        throw new Error('실시간 관측 형식 오류');
    }

    const ids = new Set();
    const players = data.players.map(player => {
        if (!player || !Number.isInteger(player.playerId) || player.playerId < 0 || player.playerId > 27
            || ids.has(player.playerId) || typeof player.name !== 'string' || player.name.length > 100) {
            throw new Error('실시간 플레이어 형식 오류');
        }
        ids.add(player.playerId);
        return { playerId: player.playerId, name: player.name };
    });

    const keys = new Set();
    const units = [];
    for (const unit of data.units) {
        const key = `${unit?.playerId}:${unit?.typeId}`;
        if (!unit || !ids.has(unit.playerId) || !/^[\x20-\x7e]{4}$/.test(unit.typeId || '')
            || keys.has(key) || !Number.isSafeInteger(unit.count) || unit.count < 0 || unit.count > 100_000) {
            throw new Error('실시간 유닛 형식 오류');
        }
        keys.add(key);
        if (unit.count > 0) units.push({ playerId: unit.playerId, typeId: unit.typeId, count: unit.count });
    }

    return {
        kind: data.kind, mapVersion: '2.323', gameTimeMs: data.gameTimeMs,
        mapName: typeof data.mapName === 'string' ? data.mapName.slice(0, 256) : '',
        players, units, total: units.reduce((sum, unit) => sum + unit.count, 0),
    };
}

module.exports = { normalizeSnapshot, readToken };
