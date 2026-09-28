const fs=require('node:fs/promises');
const {createHash}=require('node:crypto');
const {analyze}=require('./reader.cjs');
const {normalizeSnapshot,send}=require('../core.cjs');
function snapshot(result,buffer) {
    const units=new Map();
    for(const o of result.observations) units.set(o.objectTag,{instanceId:o.objectTag,typeId:o.typeId,observerPlayerId:o.commandPlayerId,lastSeenMs:o.timeMs});
    return {kind:'replay-observations',mapVersion:'2.323',replayId:createHash('sha256').update(buffer.subarray(68,80+buffer.readUInt16LE(68))).digest('hex'),replayTimeMs:result.timeMs,combinationAttempts:result.commands.filter(c=>c.isCombination).length,units:[...units.values()]};
}
async function watchReplay(file,publish,config,{once=false}={}) {
    let signature='',pending=null,lastSend=0;
    console.log('리플레이 감시 시작: '+file+(publish?' / Netlify 전송':' / 로컬 확인'));
    do {
        try {
            const before=await fs.stat(file),key=before.size+':'+before.mtimeMs;
            if(before.size>32*1024*1024)throw new Error('리플레이 크기가 32MB를 초과했습니다.');
            if(key!==signature) {
                const buffer=await fs.readFile(file),after=await fs.stat(file);
                if(before.size===after.size&&before.mtimeMs===after.mtimeMs) {
                    const result=await analyze(buffer);
                    if(!result.waiting) {
                        const data=snapshot(result,buffer),summary=normalizeSnapshot(data);
                        console.log(JSON.stringify({replayTimeMs:data.replayTimeMs,observed:summary.total,types:new Set(summary.units.map(u=>u.typeId)).size,combinationAttempts:data.combinationAttempts}));
                        if(publish)pending=data;
                    }
                    signature=key;
                }
            }
        }catch(error){if(once)throw error;console.error(error.message);}
        if(pending&&Date.now()-lastSend>=3000) {
            lastSend=Date.now();
            try{await send(pending,config);pending=null;console.log('Netlify 저장 완료 — 웹의 유닛 연동 패널에서 확인하세요.');}
            catch(error){if(once)throw error;console.error(error.message+' (최신 상태로 재시도)');}
        }
        if(!once)await new Promise(resolve=>setTimeout(resolve,1000));
    }while(!once);
}
module.exports={watchReplay,snapshot};
