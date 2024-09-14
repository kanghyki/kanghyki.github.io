---
layout  : wiki
title   : vimwiki
summary :
date    : 2024-09-14 10:04:33 +0900
updated : 2024-09-14 22:37:56 +0900
tag     : vim
toc     : true
public  : true
parent  : [[/vim]]
latex   : false
resource: B7946ED7-AEBE-4B95-9995-7DE0FC9E3C0A
---
* TOC
{:toc}

## 링크 경로 갱신 문제

1. 링크를 아래와 같이 작성하게 되면 `VimwikiRenameFile` 명령어를 실행해도, 링크가 갱신되지 않는다.

```
parent  : [[/algorithm/algorithm]]
```

`[[/algorithm/dijkstra]]`처럼 디렉토리와 파일명이 다르면 잘 작동한다...

2. lualine 플러그인과 충돌이 일어난다.
