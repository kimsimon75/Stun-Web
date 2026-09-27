# Node로 패치노트 게시

게시 성공 후 API Gateway의 `POST /webhook`을 통해 기존 `PutUpdate` Lambda를 호출합니다. Lambda는 접속 중인 사용자에게 `Update` 메시지를 보내며, S3 저장 기능은 없으므로 본문·버전 목록 저장은 Node에서 처리합니다. `--dry-run`에서는 알림도 보내지 않습니다.

알림만 보내거나 실패한 알림을 재시도할 때는 `node notify-update.cjs`를 실행합니다. 이 명령은 S3 파일을 변경하지 않습니다. 현재 Lambda는 일부 연결의 전송 실패에도 HTTP 200을 반환하므로 성공 응답은 모든 사용자에게 전달됐다는 보장은 아닙니다.

프로젝트 폴더에서 실행합니다. 기존 `node commit.js`는 Git 커밋·푸시용이며, S3 패치노트는 아래 명령으로 게시합니다.

```powershell
# S3 목록을 읽어 결과만 확인 (쓰기 없음)
node patch-commit.cjs 2.322-fix1 patchnotes/2.322-fix1.md --dry-run

# 본문 업로드 및 버전 목록 갱신
node patch-commit.cjs 2.322-fix1 patchnotes/2.322-fix1.md

# 이미 게시한 버전의 본문 수정
node patch-commit.cjs 2.322-fix1 patchnotes/2.322-fix1.md --replace
```

대상은 현재 웹사이트와 같은 `patchnote` 버킷, 서울 리전, `patchnotes/` 경로입니다. 날짜는 실행 시 한국 날짜를 사용합니다. 새 버전을 목록 맨 앞에 넣고 기존 버전은 유지합니다. 동시 수정 시 ETag 조건으로 다른 사람의 목록 변경을 덮어쓰지 않습니다. 본문과 목록은 별도 요청이므로 목록 갱신 실패 시 본문만 올라갈 수 있습니다. 오류 안내에 따라 목록을 확인하고 `--replace`로 재시도합니다.

AWS SDK가 로컬의 표준 AWS 인증을 사용합니다. AWS CLI 실행은 필요하지 않습니다. 이미 저장된 프로필은 `$env:AWS_PROFILE='프로필명'`으로 선택합니다. 표준 환경변수 `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, 임시 자격증명의 `AWS_SESSION_TOKEN`도 지원합니다. 인증값은 소스·본문에 적지 말고 외부 환경에서 주입하세요. 두 Node 명령은 프로젝트 루트의 `.env`를 자동으로 읽습니다. 이미 설정된 환경변수가 우선합니다. `.env.example`을 `.env`로 복사한 뒤 `UPDATE_API_URL`에 API Gateway 주소를 설정하세요. `.env`는 Git에서 제외되며 실제 주소를 예제 파일에 적지 않습니다. 주소 분리는 인증을 대신하지 않으며 IAM 인증은 별도 구성이 필요합니다.

필요한 권한은 해당 경로의 `s3:GetObject`, `s3:PutObject`입니다. 첫 게시 때 없는 목록을 404로 확인하려면 버킷의 `s3:ListBucket` 권한도 필요할 수 있습니다. 기존 공개 읽기/CORS 설정은 변경하지 않습니다.

새 환경에서는 `npm install`로 의존성을 설치합니다. 이 명령은 패치노트만 게시하며 계산기 소스 배포나 Git 커밋은 수행하지 않습니다.

참고: [AWS SDK Node 인증](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/setting-credentials-node.html), [S3 SDK 예제](https://docs.aws.amazon.com/sdk-for-javascript/v3/developer-guide/javascript_s3_code_examples.html)
