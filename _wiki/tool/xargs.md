---
layout  : wiki
title   : xargs
summary : construct argument list(s) and execute utility
date    : 2024-10-01 23:21:54 +0900
updated : 2024-10-04 15:08:10 +0900
tag     :
toc     : true
public  : true
parent  : [[/tool]]
latex   : false
resource: D089243E-5A19-4ABB-B9AE-2BE7C31B89C2
---
* TOC
{:toc}

# xargs

xargs는 표준 입력으로 받은 데이터를 다른 명령어의 인수로 전달하는 유틸리티다.
주로 파이프와 함께 사용되고, 입력 데이터를 받아서 특정 명령어를 여러 번 실행할 때 유용하다.

## 옵션

##### `-n N`, 그룹화
`--max-args=N`
한번에 최대 N개의 인수를 명령어에 전달한다.

```sh
$ echo "1 2 3 4 5 6 7" | xargs -n 2

1 2
3 4
5 6
7
```

##### `-I {}`, 플레이스 홀더 지정
입력에서 받은 각 항목을 지정된 플레이스홀더(기본 `{}`)으로 대체해서 명령어에 전달한다.
```sh
$ echo "aaa bbb" | xargs -n 1 -I {} echo "{}"
```

##### `-0`, NUL 구분자
NUL(`\0`) 문자로 구분된 입력을 처리한다.
NUL문자를 구분자로 사용하면 공백, 줄바꿈 문자가 포함된 경우에도 올바르게 처리할 수 있다.

```sh
$ find . -name "*.md" -print0 | xargs -0 -I {} echo "{}"
markdown.md
book.md
tool.md
README.md
about.md
```

##### `-P n`, 병렬 처리 모드
`--max-procs=maxprocs`
병렬로 실행할 프로세스의 수를 지정한다.

```sh
$ echo "a b c d" | xargs -n 1 -P 4 -I {} cp {} backup
```
