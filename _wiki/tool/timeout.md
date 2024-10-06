---
layout  : wiki
title   : GNU timeout
summary : run a command with a time limit
date    : 2024-10-06 12:28:50 +0900
updated : 2024-10-06 13:09:13 +0900
tag     :
toc     : true
public  : true
parent  : [[/tool]]
latex   : false
resource: 770318C4-72D1-47BE-8A4C-611A7F3A966B
---
* TOC
{:toc}

# timeout

GNU coreutil에 포함된 timeout 유틸리티는 명령을 실행하고
지정된 시간 간격 이후에도 실행중이면 프로세스를 종료한다.


## 설치

GNU를 포함하는 OS를 사용하고 있으면 설치하지 않아도 된다.
macOS는 포함하지 않아서 [[/tool/homebrew]]{homebrew}로 설치했다.

```sh
$ brew install coreutils
```

설치하기 힘든 상황이라면 간단하게라도 이런 방법이 있다.

```sh
# .sh
bash -c "$BIN_DIR/$testcase 2>&1" > $output 2>&1 &
pid=$!
( sleep 10; kill -TERM $pid ) > /dev/null 2>&1 &
```

## Usage

```sh
$ timeout [option] duration command [arg]…

$ timeout 10s bash -c "( $BIN_DIR/$testcase )" > $output 2>&1 &
```

### duration

| 플래그 | 단위         |
|--------|--------------|
| `s`    | 초 (기본 값) |
| `m`    | 분           |
| `h`    | 시           |
| `d`    | 일           |

### 옵션

[레퍼런스 참고](#reference)

### 종료코드
- 124, 명령이 타임아웃됨 (`--preserve-status`가 지정되지 않은 경우)
- 125, timeout 명령어 자체가 실패
- 126, 명령은 찾았지만 호출할 수 없음
- 127, 명령을 찾을 수 없음
- 137, 명령이나 timeout이 KILL(9) 시그널을 받은 경우

그 외 명령의 종료코드를 따름

## Reference

- [timeout-invocation](https://www.gnu.org/software/coreutils/manual/html_node/timeout-invocation.html#timeout-invocation)
