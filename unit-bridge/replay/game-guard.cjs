const {execFile}=require('node:child_process');
const {promisify}=require('node:util');
const path=require('node:path');
const run=promisify(execFile);
function containsWarcraft(text) {
    return [...text.matchAll(/^"([^"\r\n]+)"/gm)].some(match=>/^(?:warcraft\s*(?:iii|3)?(?:\s*reforged)?|war3)\.exe$/i.test(match[1]));
}
async function gameRunning() {
    if(process.platform!=='win32')throw new Error('게임 실행 여부 확인은 Windows에서만 지원됩니다.');
    const executable=path.join(process.env.SystemRoot||'C:\\Windows','System32','tasklist.exe');
    let stdout;
    try { ({stdout}=await run(executable,['/FO','CSV','/NH'],{windowsHide:true,timeout:5000,maxBuffer:2*1024*1024})); }
    catch { throw new Error('Windows 프로세스 목록을 확인하지 못했습니다. 리플레이 읽기를 보류합니다.'); }
    // Fail closed if process enumeration did not return the expected CSV format.
    if(!/^"[^"\r\n]+","\d+"/m.test(stdout))throw new Error('게임 실행 여부를 확인하지 못해 리플레이 읽기를 중지했습니다.');
    return containsWarcraft(stdout);
}
module.exports={gameRunning,containsWarcraft};
