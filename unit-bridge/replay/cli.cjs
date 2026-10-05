const fs=require('node:fs/promises');
const path=require('node:path');
const {analyze}=require('./reader.cjs');
const args=process.argv.slice(2),watch=args[0]==='--watch';
const file=args[watch?1:0];
const output=path.resolve('dist/replay-analysis/live-observed-history.json');
async function main(){
 if(!file) throw new Error('node unit-bridge/replay/cli.cjs [--watch] "리플레이.w3g"');
 let previous='',lastCount=-1;
 do{
  try{
   const before=await fs.stat(file),signature=before.size+':'+before.mtimeMs;
   if(before.size>32*1024*1024)throw new Error('Replay exceeds the 32 MB analysis limit');
   if(signature!==previous){
    const buffer=await fs.readFile(file),after=await fs.stat(file);
    if(before.size!==after.size||before.mtimeMs!==after.mtimeMs){await new Promise(resolve=>setTimeout(resolve,500));continue;}
    const result=await analyze(buffer);
    if(!result.waiting){
     const report={...result,meaning:'관측 이력과 명령 시도입니다. 현재 보유 패나 조합 성공 목록이 아닙니다.'};
     await fs.mkdir(path.dirname(output),{recursive:true});
     await fs.writeFile(output+'.tmp',JSON.stringify(report,null,2));
     await fs.rename(output+'.tmp',output);
     if(result.observations.length!==lastCount){
      console.log(JSON.stringify({replayTimeMs:result.timeMs,blocks:result.blocks,selectionEvents:result.observations.length,types:new Set(result.observations.map(o=>o.typeId)).size,combinationAttempts:result.commands.filter(c=>c.isCombination).length,output}));
      lastCount=result.observations.length;
     }
    }
    previous=signature;
   }
  }catch(error){if(!watch)throw error;console.error(error.message);}
  if(watch)await new Promise(resolve=>setTimeout(resolve,500));
 }while(watch);
}
main().catch(error=>{console.error(error.message);process.exitCode=1;});
