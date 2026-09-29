const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const readline = require('node:readline/promises');
const { identify, parse, send, endpoint, readToken } = require('./core.cjs');
const { Assembler } = require('./assembler.cjs');
const { watchReplay } = require('./replay/watch.cjs');
const base = process.pkg ? path.dirname(process.execPath) : path.resolve(__dirname, '../dist');
const help = 'Stun Replay Link (ORDR 2.323)\n--replay "파일.w3g" [--send]: 원본 맵 리플레이 감시\n--inspect "파일.w3g": 한 번 분석\n--demo: 샘플 식별\n--watch "요청 폴더" [--send]: 기존 2.322 수정맵 파일 감시\n종료: Ctrl+C\n관측 기록은 현재 보유 패와 다를 수 있습니다.\n';
async function config() {
    try { process.loadEnvFile(path.join(base,'.env')); } catch(e) { if(e.code!=='ENOENT')throw e; }
    const value={UNIT_API_URL:endpoint(process.env.UNIT_API_URL||'https://stun-calculator.netlify.app/.netlify/functions/unit-snapshots'),UNIT_BRIDGE_TOKEN:process.env.UNIT_BRIDGE_TOKEN};
    if(/^[a-f0-9]{64}$/.test(value.UNIT_BRIDGE_TOKEN||'')) {
        await fs.writeFile(path.join(base,'web-read-token.txt'),readToken(value.UNIT_BRIDGE_TOKEN)+'\n');
        console.log('웹 연결 코드는 exe 옆 web-read-token.txt에 있습니다.');
    }
    return value;
}
function demo() { console.log(JSON.stringify(identify({mapVersion:'2.322',units:[{instanceId:'1',typeId:'H08V',playerId:0},{instanceId:'2',typeId:'h076',playerId:1}]}),null,2)); }
async function watch(folder, publish) {
    try { process.loadEnvFile(path.join(base, '.env')); } catch(e) { if(e.code !== 'ENOENT') throw e; }
    const url = endpoint(process.env.UNIT_API_URL || 'https://stun-calculator.netlify.app/.netlify/functions/unit-snapshots');
    if(publish && !/^[a-f0-9]{64}$/.test(process.env.UNIT_BRIDGE_TOKEN || '')) throw new Error('exe 옆 .env의 UNIT_BRIDGE_TOKEN 설정을 확인하세요.');
    await fs.mkdir(folder, {recursive:true});
    const directory = await fs.realpath(folder), baseline = new Map(), prior = new Map(), assembler = new Assembler();
    const names = async () => (await fs.readdir(directory)).filter(n => /^stun-units(?:-(?:[0-9]{1,3}))?\.txt$/.test(n));
    const read = async name => {
        const file = path.join(directory,name), stat = await fs.lstat(file);
        if(!stat.isFile() || stat.isSymbolicLink() || stat.size > 1048576) throw new Error('일반 요청 파일(1MB 이하)이 필요합니다.');
        return fs.readFile(file,'utf8');
    };
    for(const name of await names()) { try { baseline.set(name,await read(name)); } catch(e) { console.error(name+': '+e.message); } }
    let pending = null, nextSend = 0;
    console.log('감시 시작: ' + directory + (publish ? ' / Netlify 전송' : ' / 로컬 확인'));
    while(true) {
        await new Promise(r => setTimeout(r,250));
        for(const name of await names()) try {
            const text = await read(name);
            if(text === baseline.get(name)) continue;
            if(text !== prior.get(name)) { prior.set(name,text); continue; }
            baseline.set(name,text);
            const request = parse(text);
            if(request.url !== url) throw new Error('맵 요청 URL과 exe 설정 URL이 다릅니다.');
            const snapshot = request.data.protocol ? assembler.accept(request.data) : request.data;
            if(!snapshot) continue;
            console.log(JSON.stringify(identify(snapshot)));
            if(publish) pending = snapshot;
        } catch(e) { if(e.code !== 'ENOENT') console.error(name+': '+e.message); }
        if(pending && Date.now() >= nextSend) {
            try { await send(pending,{...process.env,UNIT_API_URL:url}); pending = null; console.log('Netlify 저장 완료'); }
            catch(e) { console.error(e.message+' (5초 뒤 최신 상태로 재시도)'); nextSend = Date.now()+5000; }
        }
    }
}
async function main() {
    const args = process.argv.slice(2);
    if(args.length) {
        if(args.length===1 && args[0]==='--demo') return demo();
        if(args.length===1 && args[0]==='--help') return console.log(help);
        if(['--replay','--inspect'].includes(args[0]) && args[1] && (args.length===2 || (args[0]==='--replay'&&args.length===3&&args[2]==='--send'))) {
            const settings=await config();
            if(args[2]==='--send'&&!/^[a-f0-9]{64}$/.test(settings.UNIT_BRIDGE_TOKEN||''))throw new Error('exe 옆 .env의 UNIT_BRIDGE_TOKEN을 확인하세요.');
            return watchReplay(args[1],args[2]==='--send',settings,{once:args[0]==='--inspect'});
        }
        if(args[0]!=='--watch' || !args[1] || args.length>3 || (args.length===3 && args[2]!=='--send')) throw new Error(help);
        return watch(args[1],args[2]==='--send');
    }
    console.log('충돌 조사용 임시 버전: Warcraft 실행 중에는 리플레이를 읽지 않습니다. 종료 후 분석만 지원합니다.');
    console.log(help);
    const input=readline.createInterface({input:process.stdin,output:process.stdout});
    try {
        const choice=(await input.question('1 샘플 / 2 리플레이 로컬 감시 / 3 리플레이 웹 전송 / 4 기존 수정맵 전송 / 0 종료 > ')).trim();
        if(choice==='0') return;
        if(choice==='1') { demo(); await input.question('Enter로 종료'); return; }
        if(!['2','3','4'].includes(choice)) throw new Error('메뉴 번호를 확인하세요.');
        if(choice!=='4') {
            const settings=await config();
            if(choice==='3'&&!/^[a-f0-9]{64}$/.test(settings.UNIT_BRIDGE_TOKEN||''))throw new Error('exe 옆 .env의 UNIT_BRIDGE_TOKEN을 확인하세요.');
            const suggested=path.join(os.homedir(),'Documents','Warcraft III','BattleNet');
            const file=(await input.question(`리플레이 폴더 또는 파일 경로 [Enter: ${suggested} 폴더 자동 감시] > `)).trim().replace(/^"|"$/g,'')||suggested;
            input.close();return watchReplay(file,choice==='3',settings);
        }
        const suggested=path.join(os.homedir(),'Documents','Warcraft III','CustomMapData','networkio','requests');
        const folder=(await input.question(`요청 폴더 [${suggested}] > `)).trim()||suggested;
        input.close(); await watch(folder,true);
    } finally { input.close(); }
}
main().catch(async e=>{console.error(e.message);process.exitCode=1;if(process.argv.length===2 && process.stdin.isTTY){const input=readline.createInterface({input:process.stdin,output:process.stdout});await input.question('Enter로 종료');input.close();}});
