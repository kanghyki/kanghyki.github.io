---
layout  : wiki
title   : fswatch
summary : 파일시스템 모니터링 도구
date    : 2024-10-01 17:31:04 +0900
updated : 2024-10-02 12:22:25 +0900
tag     :
toc     : true
public  : true
parent  : [[/tool]]
latex   : false
resource: 6DD7BCEA-230C-4E49-8CC3-74327D390BCE
---
* TOC
{:toc}

[fswatch](https://github.com/emcrisostomo/fswatch)는 파일 또는 디렉토리의 이벤트를 감시하고 추적하는 모니터이다.

> 모니터는 지속적으로 변화를 감지하고 특정 작업을 수행하는 도구를 의미한다.

`fswatch`는 여러 시스템에서 사용 가능하고 [여기](https://github.com/emcrisostomo/fswatch?tab=readme-ov-file#readme)에서 확인할 수 있다.

나는 MacOS를 사용하고 있어서 이를 기준으로 설명한다.

## 설치

MacOS를 사용하고 있다면 [[/tool/homebrew]]{homebrew}로 쉽게 설치할 수 있다.

```sh
$ brew install fswatch
```

## Usage

내가 자주 사용하는 옵션을 정리했다.

자세한 내용은 `man fswatch`에서 찾을 수 있다.

### 기본
`fswatch`는 `path` 경로의 이벤트를 추적한다.
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

### 이벤트 필터

원하는 이벤트만 필터링 하려면 `--event` 옵션 뒤에 키워드를 적으면 된다.

```sh
$ fswatch --event Created --event Updated --event Removed path
```

### 이벤트 출력

이벤트 플래그를 출력하려면 `-x --event-flags` 옵션을 사용한다.

[[/tool/awk]]{awk}나 [[/tool/sed]]{sed}를 조합해 사용해보자.

```sh
$ fswatch -x path

/Users/.../aaa Created IsFile AttributeModified
/Users/.../abc Created IsFile AttributeModified
```

### 명령어 조합

파일시스템의 변화를 추적하는 건 제각기 다른 목적을 가지고 있겠지만, 보통 이후에 일련의 과정을 수행하기 위함이다.

이 때 `fswatch`와 `| (Pipe)`, [[/tool/xargs]]{xargs 명령어}를 조합해 목적을 달성할 수 있다.

#### 이벤트마다

아래 스크립트에서 echo 대신 원하는 명령어를 넣어 사용한다.

```sh
$ fswatch -0 test | xargs -0 -n 1 -I {} echo "changed > {}"

changed > Users/.../1
changed > Users/.../2
changed > Users/.../3
```

> `-0` 옵션은 결과 레코드들을 `\0` 문자로 분리해준다.

#### 이벤트마다 한 번만

변화가 생겼을 때 한 번만 작업을 수행해야 한다면 `-o (--one-event)` 옵션을 사용한다.

```sh
$ fswatch -o test | xargs -n 1 -I {} echo "changed {}"

changed 3
```
