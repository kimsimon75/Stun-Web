const fs=require('node:fs/promises');
const path=require('node:path');
async function resolveReplay(input) {
    const stat=await fs.stat(input);
    if(stat.isFile())return {file:path.resolve(input),stat};
    if(!stat.isDirectory())throw new Error('리플레이 파일 또는 폴더가 필요합니다.');
    let latest=null,visited=0;
    async function scan(directory,depth) {
        if(depth>8)return;
        for(const entry of await fs.readdir(directory,{withFileTypes:true})) {
            if(++visited>10000)throw new Error('검색 범위가 너무 큽니다. Replays 폴더를 지정하세요.');
            if(entry.isSymbolicLink())continue;
            const file=path.join(directory,entry.name);
            if(entry.isDirectory())await scan(file,depth+1);
            else if(entry.isFile()&&/\.w3g$/i.test(entry.name)) {
                let current;try{current=await fs.stat(file);}catch(e){if(e.code==='ENOENT')continue;throw e;}
                if(!latest||current.mtimeMs>latest.stat.mtimeMs||(current.mtimeMs===latest.stat.mtimeMs&&entry.name.toLowerCase()==='lastreplay.w3g'))latest={file,stat:current};
            }
        }
    }
    await scan(path.resolve(input),0);
    if(!latest)throw new Error('폴더에서 .w3g 파일을 기다리는 중입니다.');
    return latest;
}
module.exports={resolveReplay};
