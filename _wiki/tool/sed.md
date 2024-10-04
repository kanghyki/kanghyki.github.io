---
layout  : wiki
title   : sed
summary : stream editor
date    : 2024-10-02 12:04:23 +0900
updated : 2024-10-04 15:14:15 +0900
tag     :
toc     : true
public  : true
parent  : [[/tool]]
latex   : false
resource: 413751CC-2C36-4332-996B-FDE47BA33308
---
* TOC
{:toc}

# sed
sed는 입력 파일에서 패턴을 찾아 명령어를 수행한다.

## Usage

```sh
$ sed 옵션 명령어 파일
```
`명령어` : 출력, 치환, 삭제등 처리
`파일(optional)` : 지정되지 않으면 표준 입력에서 데이터를 읽음

### 명령어

##### 출력

```sh
sed '1 p' aaa
```
`1`번째 행을 출력(`p`)한다. 보통 `-n` 옵션과 조합해 사용한다.

##### 삭제
```sh
$ sed '1 d' aaa
```
`1`번째 행을 삭제(`d`)한다.

##### 치환
```sh
$ sed 's/A/B' aaa
```
`A`를 `B`로 치환(`s`)한다.

##### 다중 치환
```sh
$ sed 's/A/B/g' aaa
```

모든(`g`) `A`를 `B`로 치환(`s`)한다.

### 옵션

##### -r, 확장된 정규 표현식
```sh
$ sed 's/[0-9]\{3\}-[0-9]\{3,4\}-[0-9]\{3,4\}/XXX-XXXX-XXXX/g' aaa
XXX-XXXX-XXXX

$ sed -r 's/[0-9]{3}-[0-9]{3,4}-[0-9]{3,4}/XXX-XXXX-XXXX/g' aaa
XXX-XXXX-XXXX
```

##### -i, 파일 저장 (in-place)
결과를 파일에 저장한다. 주의해서 사용하자.
```sh
$ sed -i 's/b/d/' aaa
```

###### macOS 주의
macOS를 사용하고 있다면 백업 확장자를 지정해줘야 한다.
`file.백업확장자`라는 백업 파일이 만들어지고 기존 파일은 변경된다.
필요 없다면 `''` 빈 문자열을 지정한다.
```sh
$ sed -i '.backup' 's/b/d/' aaa
or
$ sed -i '' 's/b/d/' aaa
```

##### -e, 여러 명령어 사용
```sh
$ sed -e 's/b/d/' -e '2 d' aaa
```

##### -n, 명시적으로 지정한 출력만 사용
```sh
sed -n '1 p' aaa
```
