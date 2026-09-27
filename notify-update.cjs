const { loadPublishEnv, getUpdateEndpoint } = require('./publish-config.cjs');

async function notifyUpdate(fetchImpl = fetch, env = process.env) {
    const response = await fetchImpl(getUpdateEndpoint(env), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({}),
        signal: AbortSignal.timeout(15000),
        redirect: 'error',
    });
    if (!response.ok) throw new Error(`PutUpdate 호출 실패 (HTTP ${response.status})`);
    const result = await response.json();
    if (typeof result.message !== 'string' || !result.message.includes('업데이트 알림 전송 완료')) {
        throw new Error('PutUpdate에서 예상한 성공 응답을 받지 못했습니다.');
    }
    return result;
}

if (require.main === module) {
    if (process.argv.includes('--help')) console.log('사용법: node notify-update.cjs\nPutUpdate를 호출해 접속 중인 사용자에게 갱신 알림을 보냅니다.');
    else Promise.resolve().then(() => { loadPublishEnv(); return notifyUpdate(); }).then(() => console.log('PutUpdate가 갱신 알림 요청을 처리했습니다.'))
        .catch(error => { console.error(error.message); process.exitCode = 1; });
}
module.exports = { notifyUpdate };
