---
layout  : wiki
title   : grep
summary : file pattern searcher
date    : 2024-10-03 15:56:04 +0900
updated : 2024-10-04 22:18:57 +0900
tag     :
toc     : true
public  : true
parent  : [[/tool]]
latex   : false
resource: C276F943-4684-4901-8967-E81DCC78953E
---
* TOC
{:toc}

# grep

grep은 주어진 입력 파일에서 패턴이 일치하는 라인을 찾아주는 유틸리티다.
패턴 중 하나 이상과 일치하는 라인은 표준 출력으로 기록된다.

파일이 지정되지 않으면 표준 입력에서 데이터를 읽는다.

## 종료 코드

| 코드 | 상황                      |
|------|---------------------------|
| 0    | 1개 이상의 라인이 선택됨  |
| 1    | 아무 라인도 선택되지 않음 |
| 2    | 에러 발생                 |

## 옵션

### 정규 표현식

##### `-e`, Regex

정규 표현식 패턴을 찾는다.
```sh
$ cat bbb
A
AA
AAA
AAAA
AAAAA
$ grep -e "[A]\{3\}" bbb
AAA
AAAA
AAAAA
```

여러 번 사용해도 된다.

```sh
$ grep -e "pattern1" -e "pattern2" file
```

##### `-E`, Extended Regex

확장된 정규 표현식을 사용한다.
확장된 정규 표현식을 사용하면 메타 문자(`+, -, ?, !, ...`)를 escape(`\`)없이 사용할 수 있다.
```sh
$ cat bbb
A
AA
AAA
AAAA
AAAAA
$ grep -E "[A]{3}" bbb
AAA
AAAA
AAAAA
```

### `-R` 하위 디렉토리를 재귀적으로 검색
`-r, --recursive`

```sh
$ grep -r 'aaa' .
./hello:aaaaaaaaaaaa
```

### 특정 파일 제외하기
##### `--exclude`, 파일 제외

```sh
$ grep "pattern" --exclude="*.md" path
```

##### `--exclude-dir`, 디렉터리 제외

`-R` 옵션을 사용할 때 특정 디렉터리를 제외한다.

```sh
$ grep "pattern" --exclude-dir="./tmp" path
```

### etc.

##### ABC
`-A` 옵션은 매칭된 라인 이후의 N개의 줄을 추가로 출력한다.
`-B` 옵션은 매칭된 라인 이전의 N개의 줄을 추가로 출력한다.
`-C` 옵션은 매칭된 라인 이전, 이후의 N개의 줄을 추가로 출력한다.
```sh
$ cat bbb
A
AA
AAA
ccccccccccccccc
ccccccccccccccc
ccccccccccccccc
ccccccccccccccc
ccccccccccccccc
ccccccccccccccc
AAAA
AAAAA
$ grep -A 3 "AAA" bbb
AAA
ccccccccccccccc
ccccccccccccccc
ccccccccccccccc
--
AAAA
AAAAA
```

##### `-n`, 줄 번호 출력

```sh
$ grep -n "AAA" bbb
3:AAA
4:AAAA
5:AAAAA
```

##### `-c`, 카운팅

```sh
$ grep -c "AAA" bbb
3
```
