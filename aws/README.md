# 패치노트 게시 API 배포

`patch-publisher.template.json`은 서울 리전에 배포할 CloudFormation 템플릿입니다. `node aws/build-template.cjs`로 Lambda 소스를 포함해 재생성합니다. 배포할 때 32자 이상의 `PublishToken`을 입력하고 같은 값을 로컬 `.env`의 `PATCH_API_TOKEN`에 저장합니다.

생성 리소스: `PublishPatchNote` Lambda(Node.js 22), `StunPatchPublisher` HTTP API, 토큰 인증 `POST /patchnotes` 경로, 실행 역할, 14일 보관 로그 그룹. 기존 S3 버킷과 PutUpdate 함수는 생성/수정하지 않습니다.

실행 역할의 권한:
- `patchnote/patchnotes/*` 오브젝트 읽기·쓰기
- `patchnote`의 `patchnotes/*` 범위 목록 조회(없는 파일 판별)
- 같은 계정·리전의 `PutUpdate` 함수 호출
- 새 Lambda 로그 스트림 생성·기록

CloudFormation에서 템플릿 파일을 업로드하고 스택 이름 `stun-patch-publisher`로 생성합니다. IAM 리소스 생성 승인이 필요합니다. 이 파일을 만든 것만으로 AWS 리소스가 생성되는 것은 아닙니다.

완료 후 Outputs의 `PublishUrl` 값을 로컬 `.env`의 `PATCH_API_URL`에 입력합니다. AWS CLI 프로필은 필요하지 않습니다. 토큰은 Git에 커밋하거나 다른 사람에게 공개하지 마세요.

`node patch-commit.cjs <버전> <본문.md> --dry-run`은 토큰을 담은 API 요청으로 미리보기를 수행합니다. 미리보기는 파일·목록·알림을 변경하지 않습니다. 실제 게시 확인은 승인된 본문으로 수행해야 합니다.

서버는 버전·날짜·본문 크기를 검증하고, 본문 후 목록을 순서대로 저장하며 목록에는 ETag 조건을 사용합니다. 두 파일 저장은 원자적 트랜잭션이 아니므로 목록 저장 실패 시 `bodySaved`로 부분 성공을 알립니다. 같은 버전 동시 교체는 운영자가 직렬로 수행해야 합니다. 알림 실패는 게시 성공과 별도로 반환합니다. 현재 PutUpdate의 성공 응답은 모든 접속자 전달 성공을 보장하지 않습니다.

로컬 테스트는 AWS 요청을 모의 처리합니다. AWS 배포 및 IAM 인증 실연결 검증은 별도로 필요합니다.

## 배포 확인 (2026-09-27)

서울 리전의 `stun-patch-publisher` 스택이 `CREATE_COMPLETE` 상태로 생성되었습니다. 발급된 URL은 Git에서 제외된 로컬 `.env`에 설정했습니다.

Lambda 콘솔에서 `dryRun: true` 요청이 HTTP 200을 반환하고 기존 S3 목록을 읽는 것을 확인했습니다. 본문 저장 및 업데이트 알림은 실행하지 않았습니다. 현재 PC에는 SDK가 사용할 AWS 자격증명이 없어 로컬 명령의 IAM 인증 실연결 테스트는 아직 완료하지 못했습니다. 게시하려면 `CallerResource`에 대한 `execute-api:Invoke` 권한이 있는 AWS 프로필 설정이 필요합니다.
