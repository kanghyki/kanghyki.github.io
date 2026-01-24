---
title: Git submodule
summary: 
tags: 
date: 26-01-24 20:16:52 +09:00
updated: 26-01-25 02:02:09 +09:00
---

~~위키 페이지를 obsidian이랑 함께 사용할 수 있게 만들면서 `.obsidian` 같은 옵시디언 설정 디렉토리를 어떻게 관리할까 고민하다가 서브 모듈을 사용하게 됐다.~~

지금은 iCloud로 동기화해서 사용중이다.

서브모듈을 사용하면서 까먹을거 같아서 간단하게 정리했다.

## 추가
```sh
git submodule add <repo-url> <path>
```

서브 모듈 추가하면 `.gitmodules`, `<path gitlink>`가  Working directory에 추가되는데 커밋해주면 된다.

## 클론
서브모듈을 사용한 레포를 clone 받으면 서브모듈은 비어있는 상태일텐데 `git clone`에 `--recurse-submodules` 옵션을 추가해서 clone하면 서브모듈까지 같이 clone된다.

옵션 없이 `git clone` 했다면 
```sh
git submodule init
git submodule update
```
하면된다.

## 최신 커밋 가져오기
```sh
git submodule update --remote
```

## 서브모듈 제거 (디렉토리는 유지)

1. 서브모듈 비활성화

```bash
git submodule deinit -f path/to/submodule
```

2. 인덱스에서만 제거

```bash
git rm --cached path/to/submodule
```

3. `.gitmodules`에서 항목 삭제 후 반영

```bash
git add .gitmodules
```

4. 서브모듈 내부 `.git` 제거

```bash
rm -rf path/to/submodule/.git
```

5. 커밋

```bash
git commit -m "Remove submodule but keep directory"
```

결과적으로 일반 폴더만 남게된다.

## Reference
자세한 내용은 아래 링크에서 확인할 수 있다.
- [Git submodule](https://git-scm.com/book/ko/v2/Git-%EB%8F%84%EA%B5%AC-%EC%84%9C%EB%B8%8C%EB%AA%A8%EB%93%88)