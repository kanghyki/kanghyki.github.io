---
title: Git submodule
summary: 
tags: 
date: 26-01-24 20:16:52 +09:00
updated: 26-01-25 01:22:31 +09:00
---

~~위키 페이지를 obsidian이랑 함께 사용할 수 있게 만들면서 `.obsidian` 같은 옵시디언 설정 디렉토리를 어떻게 관리할까 고민하다가 서브 모듈을 사용하게 됐다.~~
지금은 iCloud로 동기화해서 사용중이다.

서브모듈을 사용하면서 까먹을거 같아서 간단하게 정리했다.

- 서브모듈 추가
```sh
git submodule add <repo-url> <path>
```

서브 모듈 추가하면 `.gitmodule` 파일이 추가된다.
그리고 `<path>`가 working directory에 추가되는데,
나는 `.gitignore`에 추가해서 추적하지 않도록 만든다.

- 서브모듈 최신 커밋 가져오기
```sh
git submodule update --remote
```

서브모듈을 사용한 레포를 clone 받으면 서브모듈은 비어있는 상태일텐데 `git clone`에 `--recurse-submodules` 옵션을 추가해서 clone하면 서브모듈까지 같이 clone된다.

옵션 없이 `git clone` 했다면 
```sh
git submodule init
git submodule update
```
하면된다.

자세한 내용은 아래 링크에서 확인할 수 있다.
- [Git submodule](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-%EC%84%9C%EB%B8%8C%EB%AA%A8%EB%93%88)