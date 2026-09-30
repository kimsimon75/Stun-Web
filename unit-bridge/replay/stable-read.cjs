const fs=require('node:fs/promises');
// 한 번에 읽고 핸들을 닫은 뒤 메모리 복사본만 분석합니다.
async function readStableReplay(file,{settleMs=1000,maxBytes=32*1024*1024}={}) {
    const before=await fs.stat(file);
    if(!before.isFile())throw new Error('일반 리플레이 파일이 필요합니다.');
    if(before.size<68)return {waiting:true,reason:'게임이 리플레이 헤더를 기록하기를 기다리는 중'};
    if(before.size>maxBytes)throw new Error('리플레이 크기가 32MB를 초과했습니다.');
    if(settleMs>0&&Date.now()-before.mtimeMs<settleMs)return {waiting:true,reason:'리플레이 기록 중 — 다음 주기에 재확인'};
    const handle=await fs.open(file,'r');
    let buffer;
    try {
        buffer=Buffer.alloc(before.size);
        let offset=0;
        while(offset<buffer.length){
            const {bytesRead}=await handle.read(buffer,offset,buffer.length-offset,offset);
            if(!bytesRead)return {waiting:true,reason:'리플레이가 교체되거나 짧아져 재확인 대기'};
            offset+=bytesRead;
        }
    } finally { await handle.close(); }
    const after=await fs.stat(file);
    if(before.size!==after.size||before.mtimeMs!==after.mtimeMs||before.ino!==after.ino)
        return {waiting:true,reason:'읽는 동안 리플레이가 변경되어 재확인 대기'};
    return {buffer,signature:file+':'+after.size+':'+after.mtimeMs};
}
module.exports={readStableReplay};
