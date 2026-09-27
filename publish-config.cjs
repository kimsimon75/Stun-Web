const { loadEnvFile } = require('node:process');
const { join } = require('node:path');

function loadPublishEnv() {
    try { loadEnvFile(join(__dirname, '.env')); }
    catch (error) { if (error.code !== 'ENOENT') throw error; }
}

function getUpdateEndpoint(env = process.env) {
    const value = env.UPDATE_API_URL?.trim();
    if (!value) throw new Error('.env 또는 환경변수에 UPDATE_API_URL을 설정하세요.');
    let url;
    try { url = new URL(value); }
    catch { throw new Error('UPDATE_API_URL은 유효한 HTTPS 주소여야 합니다.'); }
    if (url.protocol !== 'https:' || url.username || url.password || url.hash) {
        throw new Error('UPDATE_API_URL은 사용자 정보와 #이 없는 HTTPS 주소여야 합니다.');
    }
    return url.href;
}

module.exports = { loadPublishEnv, getUpdateEndpoint };
