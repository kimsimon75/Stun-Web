const { exec } = require('child_process');

exec(
  // ① 변경 사항이 있을 때만 commit
  'git add -A && (git diff --cached --quiet || git commit -m "Auto commit from Node.js") && git push origin main',
  { encoding: 'utf8', shell: true },
  (err, stdout, stderr) => {
    if (err) {
      console.error(`❌ 에러 발생:\n${stderr}\n${err.message}`);
      return;
    }
    if (stderr.length) console.error(stderr);
    console.log(stdout || '✅ 아무 변경도 없어 푸시만 완료');
  }
);
