const fs=require('node:fs/promises');
const {createHash}=require('node:crypto');
const {analyze}=require('./reader.cjs');
const {normalizeSnapshot,send}=require('../core.cjs');
const {resolveReplay}=require('./source.cjs');
const {gameRunning}=require('./game-guard.cjs');
function snapshot(result,buffer) {
    const units=new Map();
    for(const o of result.observations) units.set(o.objectTag,{instanceId:o.objectTag,typeId:o.typeId,observerPlayerId:o.commandPlayerId,lastSeenMs:o.timeMs});
    return {kind:'replay-observations',mapVersion:'2.323',replayId:createHash('sha256').update(buffer.subarray(68,80+buffer.readUInt16LE(68))).digest('hex'),replayTimeMs:result.timeMs,combinationAttempts:result.commands.filter(c=>c.isCombination).length,units:[...units.values()]};
}
async function watchReplay(file,publish,config,{once=false}={}) {
    let signature='',pending=null,lastSend=0,activeFile='',lastProgress=Date.now(),lastNotice=0,lastError='';
    console.log('리플레이 감시 시작: '+file+(publish?' / Netlify 전송':' / 로컬 확인'));
    do {
        try {
            if(await gameRunning()) {
                pending=null;
                if(once)throw new Error('워크래프트 실행 중에는 분석하지 않습니다. 게임 종료 후 다시 실행하세요.');
                if(lastError!=='game-running'){console.log('게임 실행 감지: 충돌 원인 확인 전까지 리플레이 읽기·전송을 중지합니다. 게임 종료 후 재개합니다.');lastError='game-running';}
                await new Promise(resolve=>setTimeout(resolve,5000));
                continue;
            }
            const source=await resolveReplay(file),before=source.stat,key=source.file+':'+before.size+':'+before.mtimeMs;
            if(activeFile!==source.file){activeFile=source.file;signature='';pending=null;console.log('감시 대상: '+activeFile);}
            if(before.size>32*1024*1024)throw new Error('리플레이 크기가 32MB를 초과했습니다.');
            if(key!==signature) {
                const buffer=await fs.readFile(activeFile),after=await fs.stat(activeFile);
                if(before.size===after.size&&before.mtimeMs===after.mtimeMs) {
                    const result=await analyze(buffer);
                    if(!result.waiting) {
                        const data=snapshot(result,buffer),summary=normalizeSnapshot(data);
                        console.log(JSON.stringify({replayTimeMs:data.replayTimeMs,observed:summary.total,types:new Set(summary.units.map(u=>u.typeId)).size,combinationAttempts:data.combinationAttempts}));
                        if(publish)pending=data;
                        lastProgress=Date.now();
                    }
                    signature=key;
                    lastError='';
                }
            }
            if(!once&&Date.now()-lastProgress>15000&&Date.now()-lastNotice>15000){lastNotice=Date.now();console.log('새 기록 대기: '+activeFile+' / 파일 수정 '+before.mtime.toLocaleTimeString()+'. 파일 경로를 지정했다면 다른 리플레이로 자동 전환되지 않습니다. 자동 전환은 Replays 폴더를 지정하세요.');}
        }catch(error){pending=null;if(once)throw error;if(lastError!==error.message){console.error(error.message);lastError=error.message;}}
        if(pending&&Date.now()-lastSend>=3000) {
            lastSend=Date.now();
            try{await send(pending,config);pending=null;console.log('Netlify 저장 완료 — 웹의 유닛 연동 패널에서 확인하세요.');}
            catch(error){if(once)throw error;console.error(error.message+' (최신 상태로 재시도)');}
        }
        if(!once)await new Promise(resolve=>setTimeout(resolve,5000));
    }while(!once);
}
module.exports={watchReplay,snapshot};
