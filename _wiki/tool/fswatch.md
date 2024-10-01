---
layout  : wiki
title   : fswatch
summary : 파일시스템 추적 도구
date    : 2024-10-01 17:31:04 +0900
updated : 2024-10-02 00:10:16 +0900
tag     : tool
toc     : true
public  : true
parent  : [[/tool]]
latex   : false
resource: 6DD7BCEA-230C-4E49-8CC3-74327D390BCE
---
* TOC
{:toc}

## fswatch

[fswatch](https://github.com/emcrisostomo/fswatch)는 파일 또는 디렉토리의 이벤트를 감시하고 추적하는 모니터이다.

> 모니터는 지속적으로 변화를 감지하고 특정 작업을 수행하는 도구를 의미한다.

`fswatch`는 여러 시스템에서 사용 가능하고 [여기](https://github.com/emcrisostomo/fswatch?tab=readme-ov-file#readme)에서 확인할 수 있다.

나는 MacOS를 사용하고 있어서 이를 기준으로 설명한다.

### 라이선스

`fswatch`의 라이선스는 [GPL-3.0](https://olis.or.kr/license/Detailselect.do?lId=1072&mapCode=010072)이다.

## 설치

MacOS를 사용하고 있다면 [[/tool/homebrew]]{homebrew}로 쉽게 설치할 수 있다.

```sh
$ brew install fswatch
```

## Usage

많이 사용하는 옵션을 정리했다.

자세한 내용은 man page(`man fswatch`)에서 찾을 수 있다.

### 기본 사용법
아래 스크립트로 `path` 경로의 이벤트를 추적할 수 있다.
```sh
$ fswatch path

/Users/.../new
```

### 간격 조정
`fswatch`는 변화를 일정 시간마다 경로의 이벤트를 추적한다.

간격을 조정하려면 `-l`옵션을 사용한다.
```sh
$ fswatch -l 5 path
```

### 원하는 이벤트만 감시

원하는 이벤트만 감시하려면 `--event` 옵션 뒤에 원하는 이벤트를 적으면 된다.

자세한 내용은 man page의 EVENT TYPES에서 확인할 수 있다.
```sh
$ fswatch --event Updated path
```

### 이벤트 받고 종료

한번만 이벤트를 받고 종료하려면 `-1` 옵션을 사용한다.
```sh
$ fswatch -1 path
```

### 이벤트가 발생했을 때 명령어 실행

#### 각각의 이벤트에 대해 수행
일반적으로 변화를 추적하는 일은 그에 따라 로그를 작성하거나, 테스트를 수행하는 것과 같이 해야할 일이 있기 때문이다.

이런 일은 `fswatch`와 파이프, [[/tool/xargs]]{xargs 명령어}로 할 수 있다.

> `-0` 옵션은 결과 레코드들을 `\0` 문자로 분리해준다.

아래 스크립트에서 echo 대신 원하는 명령어를 넣어 사용한다.
```sh
$ fswatch -0 test | xargs -0 -n 1 -I {} echo "changed > {}"
```

### 간격당 한번만 작업 수행

변화가 생겼을 때 한번만 작업을 수행해야하는 경우가 있다.
이 때는 `-o (--one-event)` 옵션을 사용한다.

```sh
$ fswatch -o test | xargs -n 1 -I {} echo "changed {}"
```
