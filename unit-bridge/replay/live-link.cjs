const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const { createHash } = require('node:crypto');
const { analyze } = require('./reader.cjs');

const baseDir = process.pkg ? path.dirname(process.execPath) : path.resolve('dist/live-link');
const defaultEndpoint = 'https://stun-calculator.netlify.app/.netlify/functions/unit-snapshots';

function loadEnv(file) {
    const result = {};
    try {
        for (const raw of require('node:fs').readFileSync(file, 'utf8').split(/\r?\n/)) {
            const line = raw.trim();
            if (!line || line.startsWith('#')) continue;
            const separator = line.indexOf('=');
            if (separator > 0) result[line.slice(0, separator).trim()] = line.slice(separator + 1).trim().replace(/^"|"$/g, '');
        }
    } catch (error) { if (error.code !== 'ENOENT') throw error; }
    return result;
}

async function findTempReplay() {
    const root = path.join(os.homedir(), 'Documents', 'Warcraft III', 'BattleNet');
    let accounts;
    try { accounts = await fs.readdir(root, { withFileTypes: true }); }
    catch { return null; }
    const candidates = [];
    for (const account of accounts) {
        if (!account.isDirectory()) continue;
        const file = path.join(root, account.name, 'Replays', 'TempReplay.w3g');
        try { candidates.push({ file, stat: await fs.stat(file) }); } catch { }
    }
    candidates.sort((left, right) => right.stat.mtimeMs - left.stat.mtimeMs);
    return candidates[0] || null;
}

async function readDetached(file, expectedStat) {
    if (expectedStat.size < 68 || expectedStat.size > 64 * 1024 * 1024) return null;
    const handle = await fs.open(file, 'r');
    let buffer;
    try {
        buffer = Buffer.alloc(expectedStat.size);
        let offset = 0;
        while (offset < buffer.length) {
            const { bytesRead } = await handle.read(buffer, offset, buffer.length - offset, offset);
            if (!bytesRead) return null;
            offset += bytesRead;
        }
    } finally { await handle.close(); }
    const after = await fs.stat(file);
    if (after.size !== expectedStat.size || after.mtimeMs !== expectedStat.mtimeMs) return null;
    return buffer;
}

function makeSnapshot(result) {
    const instances = new Map();
    for (const observation of result.observations) {
        instances.set(`${observation.commandPlayerId}:${observation.objectTag}`, observation);
    }
    const grouped = new Map();
    for (const observation of instances.values()) {
        const playerId = Math.max(0, observation.commandPlayerId - 1);
        const key = `${playerId}:${observation.typeId}`;
        const row = grouped.get(key) || { playerId, typeId: observation.typeId, count: 0 };
        row.count++;
        grouped.set(key, row);
    }
    const playerIds = [...new Set([...grouped.values()].map(row => row.playerId))].sort((a, b) => a - b);
    return {
        kind: 'live-replay', mapVersion: '2.323', gameTimeMs: result.timeMs, mapName: result.map,
        players: playerIds.map(playerId => ({ playerId, name: `플레이어 ${playerId + 1}` })),
        units: [...grouped.values()],
    };
}

async function send(endpoint, token, snapshot) {
    const response = await fetch(endpoint, {
        method: 'POST', redirect: 'error', signal: AbortSignal.timeout(10000),
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify(snapshot),
    });
    if (!response.ok) throw new Error(`웹 전송 HTTP ${response.status}`);
}

async function main() {
    const config = loadEnv(path.join(baseDir, '.env'));
    const endpoint = config.UNIT_API_URL || defaultEndpoint;
    const token = config.UNIT_BRIDGE_TOKEN || '';
    if (!/^https:\/\//.test(endpoint) || !/^[a-f0-9]{64}$/.test(token)) throw new Error('EXE 옆 .env의 UNIT_API_URL과 UNIT_BRIDGE_TOKEN을 확인하세요.');
    const readToken = createHash('sha256').update(`stun-read-v1:${token}`).digest('hex');
    await fs.writeFile(path.join(baseDir, 'web-read-token.txt'), `${readToken}\n`);

    console.log('Stun Replay Live Link · ORDR 2.323 진행 중 리플레이 연동');
    console.log('원본 파일은 잠그거나 수정하지 않고, 완성된 압축 블록만 복사해 읽습니다.');
    console.log('웹 연결 코드는 EXE 옆 web-read-token.txt에 있습니다. 종료: Ctrl+C');
    let lastSignature = '', lastPayload = '', lastStatus = '';
    const status = value => { if (value !== lastStatus) { lastStatus = value; console.log(`[${new Date().toLocaleTimeString('ko-KR', { hour12: false })}] ${value}`); } };

    while (true) {
        try {
            const source = await findTempReplay();
            if (!source) { status('TempReplay.w3g 생성 대기 중'); await new Promise(resolve => setTimeout(resolve, 2000)); continue; }
            const signature = `${source.file}:${source.stat.size}:${source.stat.mtimeMs}`;
            if (signature === lastSignature) { await new Promise(resolve => setTimeout(resolve, 2000)); continue; }
            const buffer = await readDetached(source.file, source.stat);
            if (!buffer) { status('리플레이 기록과 겹쳐 다음 주기에 다시 읽습니다'); await new Promise(resolve => setTimeout(resolve, 1000)); continue; }
            const result = await analyze(buffer);
            if (result.waiting) { status('완성된 리플레이 블록 대기 중'); await new Promise(resolve => setTimeout(resolve, 1000)); continue; }
            const snapshot = makeSnapshot(result);
            const payload = JSON.stringify(snapshot);
            if (payload !== lastPayload) {
                status(`파싱 완료 · 게임 ${Math.floor(result.timeMs / 60000)}:${String(Math.floor(result.timeMs / 1000 % 60)).padStart(2, '0')} · 관측 유닛 ${snapshot.units.reduce((sum, row) => sum + row.count, 0)}개 · 웹 전송 중`);
                await send(endpoint, token, snapshot);
                lastPayload = payload;
                status(`전송 완료 · 게임 ${Math.floor(result.timeMs / 60000)}:${String(Math.floor(result.timeMs / 1000 % 60)).padStart(2, '0')} · 관측 유닛 ${snapshot.units.reduce((sum, row) => sum + row.count, 0)}개`);
            }
            lastSignature = signature;
        } catch (error) { status(`${error.message}${error.cause?.message ? ` (${error.cause.message})` : ''} · 재시도 중`); }
        await new Promise(resolve => setTimeout(resolve, 2000));
    }
}

main().catch(error => { console.error(error.message); process.exitCode = 1; });
