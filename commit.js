const { exec } = require('child_process');
const iconv = require('iconv-lite');

exec(
  // ① 변경 사항이 있을 때만 commit
  'git add -A && (git diff --cached --quiet || git commit -m "Auto commit from Node.js") && git push origin main',
  { encoding: 'buffer', shell: true },
  (err, stdout, stderr) => {
    const dec = b => iconv.decode(b, 'cp949');
    if (err) {
      console.error(`❌ 에러 발생:\n${dec(stderr)}\n${err.message}`);
      return;
    }
    if (stderr.length) console.error(dec(stderr));
    console.log(dec(stdout) || '✅ 아무 변경도 없어 푸시만 완료');
  }
);
