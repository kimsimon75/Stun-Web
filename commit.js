const { exec } = require('child_process');

exec('git add . && git commit -m "Auto commit from Node.js"', (err, stdout, stderr) => {
  if (err) {
    console.error(`에러 발생: ${err}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});
