---
layout  : wiki
title   : Git Hooks
summary : Git Hooks
date    : 2024-09-16 11:37:56 +0900
updated : 2024-09-16 17:23:57 +0900
tag     : git
toc     : true
public  : true
parent  : [[/tools/git]]
latex   : false
resource: 2BF6FF2A-6D18-4DF4-810B-D9D98C14BBE7
---
* TOC
{:toc}

## 분기 처리

환경변수에 따라 분기처리 하도록 로직을 작성한다.
```sh
#!/bin/sh

if [ "$SKIP" = "true" ]; then
    exit 0
fi

./do-something
```

다음과 같이 환경변수 설정 후 실행한다.

`SKIP=true git commit`

## Links

- [8.3 Git맞춤 - Git Hooks](https://git-scm.com/book/ko/v2/Git%EB%A7%9E%EC%B6%A4-Git-Hooks)
