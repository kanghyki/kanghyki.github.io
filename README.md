## 사용 방법 (로컬)

### 0) 의존성

- Ruby (권장: 3.2.x) + Bundler
- Node.js (권장: 18+)
- fswatch (macOS) 또는 파일 감시 도구 - 개발용

### 1) Obsidian 설정

- Vault는 이 레포의 `_notes/` 폴더를 선택
- 첨부 파일 저장 위치: `_notes/assets/`
- 모든 문서는 아래 frontmatter를 포함해야 함

```
---
title: 문서 제목
summary: 문서 요약
tags: tool reference
date: 2025-01-24 13:45:00 +0900
updated: 2026-01-10 09:12:34 +0900
---
```

- tag는 공백으로 구분합니다. (예: `tags: tool reference`)
- date/updated 포맷은 `YY-MM-DD HH:mm:ss Z`

### 2) 로컬 실행

```
bundle install
./jekyll-run.sh
```

로컬 서버: http://127.0.0.1:4000

## 링크/자산 규칙

- 내부 링크: `[[문서]]`, `[[경로/문서]]`, `[[경로/문서|표시명]]`
- 이미지: `![[image.png]]` → `/notes/assets/image.png`로 렌더됨
- 자산 파일은 `_notes/assets/`에 저장

## 명령어 (Makefile)

Makefile을 쓰면 로컬 실행/빌드를 간단히 할 수 있습니다.

```
make setup      # Ruby 의존성 설치
make data       # data/ 생성
make dev        # 로컬 서버 실행
make build      # 프로덕션 빌드
make clean-data # data/ 삭제
```

## 문서 구조

- 루트는 `_notes/`이며, 폴더는 단순 분류 용도
- 상/하위 계층이나 폴더 인덱스 개념은 사용하지 않음
- `doc_type`는 문서 유형 표시용이며 값은 자유지만 다음을 권장
  - `capture` / `reference` / `permanent` / `archive`

## 배포 (GitHub Pages)

- GitHub Actions로 자동 빌드/배포
- Settings → Pages → Source를 **GitHub Actions**로 설정
- `git push` 시 자동 배포

## 게시글 날짜 처리

- `date` = 생성일
- `updated` = 수정일
- 자동 채움은 하지 않으므로 frontmatter에 직접 입력해야 합니다.

## Reference

- [johngrib-jekyll-skeleton](https://github.com/johngrib/johngrib-jekyll-skeleton/)
- [johngrib.github.io](https://github.com/johngrib/johngrib.github.io/)
- [github에 Jekyll 블로그를 만들었다](https://johngrib.github.io/wiki/blog/create-jekyll-blog/)
- [Vimwiki + Jekyll + Github.io로 나만의 위키를 만들자](https://johngrib.github.io/wiki/my-wiki/)
