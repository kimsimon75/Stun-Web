const { exec } = require('child_process');
const iconv = require('iconv-lite');

exec(
  'git add . && git commit -m "Auto commit from Node.js" && git push origin main',
  { encoding: 'buffer', shell: true },
  (err, stdout, stderr) => {
    if (err) {
      // 한글 오류 메시지 디코딩
      console.error(`❌ 에러 발생:\n${iconv.decode(stderr, 'cp949')}`);
      return;
    }

    // 성공 출력
    console.log(`✅ 완료\n${stdout}`);

    // Git이 경고를 stderr로 내보내는 경우
    if (stderr) console.error(`⚠️ stderr: ${iconv.decode(stderr, 'cp949')}`);
  }
);
