const fs = require('node:fs/promises');
const path = require('node:path');
const os = require('node:os');
const readline = require('node:readline/promises');
const { identify, parse, send, endpoint } = require('./core.cjs');
const base = process.pkg ? path.dirname(process.execPath) : path.resolve(__dirname, '../dist');
const help = 'Stun Unit Bridge (Netlify)\n--demo: 샘플 식별\n--watch "요청 폴더" [--send]: 파일 감시 / Netlify 전송\n종료: Ctrl+C\n맵의 stun-units.txt 작성 코드 연결이 필요합니다.\n';
function demo() { console.log(JSON.stringify(identify({mapVersion:'2.322',units:[{instanceId:'1',typeId:'H08V',playerId:0},{instanceId:'2',typeId:'h076',playerId:1}]}),null,2)); }
async function watch(folder, publish) {
    try { process.loadEnvFile(path.join(base, '.env')); } catch(e) { if(e.code !== 'ENOENT') throw e; }
    const url = endpoint(process.env.UNIT_API_URL || 'https://stun-calculator.netlify.app/.netlify/functions/unit-snapshots');
    const directory = await fs.realpath(folder), file = path.join(directory, 'stun-units.txt');
    let baseline = '', prior = '';
    try { baseline = await fs.readFile(file, 'utf8'); } catch(e) { if(e.code !== 'ENOENT') throw e; }
    console.log('감시 시작: ' + file + (publish ? ' / Netlify 전송' : ' / 로컬 확인'));
    while(true) {
        await new Promise(r => setTimeout(r,1000));
        try {
            const stat = await fs.lstat(file);
            if(!stat.isFile() || stat.isSymbolicLink() || stat.size > 1048576) throw new Error('일반 요청 파일(1MB 이하)이 필요합니다.');
            const text = await fs.readFile(file,'utf8');
            if(text === baseline) continue;
            if(text !== prior) { prior = text; continue; }
            const request = parse(text);
            if(request.url !== url) throw new Error('맵 요청 URL과 exe 설정 URL이 다릅니다.');
            const result = identify(request.data);
            if(publish) await send(request.data,process.env);
            console.log(JSON.stringify(result)); baseline = text;
        } catch(e) { if(e.code !== 'ENOENT') throw e; }
    }
}
async function main() {
    const args = process.argv.slice(2);
    if(args.length) {
        if(args.length===1 && args[0]==='--demo') return demo();
        if(args.length===1 && args[0]==='--help') return console.log(help);
        if(args[0]!=='--watch' || !args[1] || args.length>3 || (args.length===3 && args[2]!=='--send')) throw new Error(help);
        return watch(args[1],args[2]==='--send');
    }
    console.log(help);
    const input=readline.createInterface({input:process.stdin,output:process.stdout});
    try {
        const choice=(await input.question('1 샘플 / 2 로컬 감시 / 3 Netlify 전송 / 0 종료 > ')).trim();
        if(choice==='0') return;
        if(choice==='1') { demo(); await input.question('Enter로 종료'); return; }
        if(!['2','3'].includes(choice)) throw new Error('메뉴 번호를 확인하세요.');
        const suggested=path.join(os.homedir(),'Documents','Warcraft III','CustomMapData','networkio','requests');
        const folder=(await input.question(`요청 폴더 [${suggested}] > `)).trim()||suggested;
        input.close(); await watch(folder,choice==='3');
    } finally { input.close(); }
}
main().catch(async e=>{console.error(e.message);process.exitCode=1;if(process.argv.length===2 && process.stdin.isTTY){const input=readline.createInterface({input:process.stdin,output:process.stdout});await input.question('Enter로 종료');input.close();}});
