async function publishViaApi(input, { endpoint = process.env.PATCH_API_URL, token = process.env.PATCH_API_TOKEN, fetchImpl = fetch } = {}) {
    let url;
    try { url = new URL(endpoint); } catch { throw new Error('PATCH_API_URL에 배포된 게시 API 주소를 설정하세요.'); }
    if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search
        || !/^[a-z0-9]+\.execute-api\.ap-northeast-2\.amazonaws\.com$/.test(url.hostname)
        || url.pathname !== '/patchnotes' || url.port) throw new Error('서울 리전의 게시 API HTTPS 주소가 필요합니다.');
    if (typeof token !== 'string' || token.length < 32 || /\s/.test(token)) {
        throw new Error('PATCH_API_TOKEN에 32자 이상의 게시 토큰을 설정하세요.');
    }
    const response = await fetchImpl(url.href, {
        method: 'POST',
        headers: { 'content-type': 'application/json', authorization: `Bearer ${token}` },
        body: JSON.stringify(input), signal: AbortSignal.timeout(35000), redirect: 'error',
    });
    let result;
    try { result = await response.json(); } catch { throw new Error(`게시 API 응답을 읽지 못했습니다 (HTTP ${response.status}). 게시 상태를 확인하세요.`); }
    if (!response.ok) throw new Error(result.message || `게시 API 오류 (HTTP ${response.status})`);
    if (input.dryRun ? result.dryRun !== true : result.published !== true) throw new Error('예상하지 못한 게시 API 응답입니다. 게시 상태를 확인하세요.');
    return result;
}
module.exports = { publishViaApi };
