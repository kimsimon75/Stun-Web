const { SignatureV4 } = require('@smithy/signature-v4');
const { HttpRequest } = require('@smithy/protocol-http');
const { Hash } = require('@smithy/hash-node');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');

async function publishViaApi(input, { endpoint = process.env.PATCH_API_URL, credentials = defaultProvider(), fetchImpl = fetch } = {}) {
    let url;
    try { url = new URL(endpoint); } catch { throw new Error('PATCH_API_URL에 배포된 게시 API 주소를 설정하세요.'); }
    if (url.protocol !== 'https:' || url.username || url.password || url.hash || url.search
        || !/^[a-z0-9]+\.execute-api\.ap-northeast-2\.amazonaws\.com$/.test(url.hostname)
        || url.pathname !== '/patchnotes' || url.port) throw new Error('서울 리전의 게시 API HTTPS 주소가 필요합니다.');
    const signer = new SignatureV4({ credentials, service: 'execute-api', region: 'ap-northeast-2', sha256: Hash.bind(null, 'sha256') });
    const request = await signer.sign(new HttpRequest({ protocol: url.protocol, hostname: url.hostname, method: 'POST', path: url.pathname,
        headers: { host: url.host, 'content-type': 'application/json' }, body: JSON.stringify(input) }));
    const response = await fetchImpl(url.href, { method: 'POST', headers: request.headers, body: request.body, signal: AbortSignal.timeout(35000), redirect: 'error' });
    let result;
    try { result = await response.json(); } catch { throw new Error(`게시 API 응답을 읽지 못했습니다 (HTTP ${response.status}). 게시 상태를 확인하세요.`); }
    if (!response.ok) throw new Error(result.message || `게시 API 오류 (HTTP ${response.status})`);
    if (input.dryRun ? result.dryRun !== true : result.published !== true) throw new Error('예상하지 못한 게시 API 응답입니다. 게시 상태를 확인하세요.');
    return result;
}
module.exports = { publishViaApi };
