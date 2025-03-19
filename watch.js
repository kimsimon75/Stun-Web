const { exec } = require("child_process");

console.log("🚀 Git 자동 푸시 시작 (파일 변경 감지 중...)");

const pushChanges = () => {
    exec("git add . && git commit -m '🚀 자동 커밋' && git push origin main", (err, stdout, stderr) => {
        if (err) {
            console.error("❌ Git 자동 푸시 오류:", stderr);
        } else {
            console.log("✅ 변경 사항이 성공적으로 푸시되었습니다!\n", stdout);
        }
    });
};

// `nodemon`이 파일 변경을 감지하면 Git 자동 푸시 실행
pushChanges();