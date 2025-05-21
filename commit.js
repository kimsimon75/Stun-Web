const { exec } = require('child_process');

exec('git add . && git commit -m "Auto commit from Node.js" && git push origin main', (err, stdout, stderr) => {
  if (err) {
    console.error(`❌ 에러 발생: ${err.message}`);
    return;
  }
  console.log(`✅ 완료\n${stdout}`);
  if (stderr) console.error(`⚠️ stderr: ${stderr}`);
});