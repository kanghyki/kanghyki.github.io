---
title: 읽기 좋은 코드가 좋은 코드다
summary: 책 "읽기 좋은 코드가 좋은 코드다"에서 유용한 내용 정리
tags:
  - book
date: 2026-01-22 02:55:30 +0900
updated: 2026-01-23 18:00:22 +0900
---

> 핵심은 코드를 작성할 때, **코드를 읽는 사람이 이해하는 데 들이는 시간을 최소화하는 것**이다.

## 기본 원칙

### 이름 짓기

이름을 작성할 땐 읽는 사람이 오해하지 않게 만들어야 한다.
뜻이 명확한 단어를 사용하라.

더 넓은 범위에서 사용되는 코드일수록 더 자세하게 이름을 짓는다.
작은 범위에서 사용되는 코드는 맥락으로 이해되는 경우가 많다.

## 주석

### Named parameter 주석 트릭

Python은 Named parameter를 지원하는 언어다.

```python
def connect(host, port):
    ...
...
connect(host="127.0.0.1", port=4242)
```

C, C++처럼 Named parameter를 지원하지 않는 언어에서도
주석으로 이를 흉내낼 수 있다.

```cpp
connect(/* host = */ "127.0.0.1", /* port = */ 4242);
```

### 결함 주석

변화하고 성장하는 시스템에 결함이 없는 경우는 거의 없다.
결함을 문서화하는 것을 두려워하지 말자.

상황에 따라 다음과 같은 표시를 사용한다.

| 표시   | 의미                            |
| ------ | ------------------------------- |
| TODO:  | 아직 하지 않은 일               |
| FIXME: | 오동작을 일으킨다고 알려진 코드 |
| HACK:  | 아름답지 않은 해결책            |
| XXX:   | 위험한 문제를 포함한 코드       |

```cpp
// XXX: 덧셈을 안 하고 뺄셈을 함
int sum(int lhs, int rhs) {
    return lhs - rhs;
}
```

## 조건문

### 비교 표현

비교 구문을 작성할 때는
유동적인 값을 앞에, 고정적인 값을 뒤에 두는 편이 읽기 쉽다.

```cpp
if (IQ > 100) {
    ...
}
```

아래 표현보다 의도가 명확하다.

```cpp
if (100 < IQ) {
    ...
}
```

## 코드 단순화

### 긍정문 사용하기

부정문보다 긍정문이 읽기 쉽다.

```cpp
if (!useLogging) {
    ...
}
```

대신 다음과 같이 작성한다.

```cpp
if (useLogging) {
    ...
}
```

### 중첩 제거하기

중첩된 코드는 읽는 사람을 피곤하게 만든다.

early return을 사용해 중첩을 제거한다.

```cpp
if (isA) {
    ...
    if (isB) {
        ...
    }
    else return;
}
else return;
```

아래와 같이 바꿀 수 있다.

```cpp
if (!isA) return;
...
if (!isB) return;
...
```

### goto의 제한적 활용 (C)

자원 정리 코드에서는 goto가 오히려 명확할 수 있다.

```c
if (ptr == NULL) goto cleanup;

...

cleanup:
    free(p_ptr);
    free(c_ptr);
    ...

return;
```

### short-circuit evaluation 남용 피하기

short-circuit evaluation은 유용하지만, 과도하면 가독성을 해친다.

```cpp
if (A || B) {
    do_something();
}
```

아래 코드는 의도를 파악하기 어렵다.

```cpp
if (!(pptr = getParentNode(ptr)) || isLeftNode(ptr, pptr)) return;
```

명시적으로 풀어 쓰는 편이 낫다.

```cpp
Node* pptr = getParentNode(ptr);
if (isLeftNode(ptr, pptr)) return;
...
```

### 매크로 트릭 (C++)

```cpp
#define ADDFIELD(field) add_to->set_##field(add_from.field() + add_to->field())
```

매크로는 강력하지만, 읽기 어려워질 수 있음을 항상 인지해야 한다.

## 코드 구조 정리

### 상관없는 하위 문제 분리하기

코드의 목적을 먼저 파악한다.
직접적인 목적이 아닌 하위 문제라면 분리한다.

일반적인 목적의 코드는 프로젝트 특정 코드에서 분리한다.

### Defragmenting

큰 함수 내부의 코드를 재조직해
여러 개의 독립적인 논리 영역처럼 보이게 만든다.

## 설명과 설계

### 쉬운 말로 설명하기

자신의 생각을 지식이 부족한 사람에게 설명할 수 있는 능력은 중요하다.
이 능력은 코드에도 그대로 반영된다.

### 불필요한 기능 제거하기

필요하지 않은 기능을 제거하고
과도한 설계(overengineering)를 피한다.

### 코드베이스를 작게 유지하기

- 라이브러리에 익숙해지기
- 유닉스 도구 적극 활용하기

## 테스트 코드

테스트 코드는 다른 프로그래머가
수정하거나 테스트를 추가하기 쉽게 작성되어야 한다.

### 테스트 이름 규칙

`Test_<함수이름>_<상황>` 형태를 사용한다.

테스트 함수 이름은 설명문 역할을 하므로
일반적인 “이름은 짧게” 원칙을 적용하지 않는다.

> 테스트하기 쉬운 코드는
> 잘 정의된 인터페이스를 가지며
> 과도한 상태나 숨겨진 데이터를 요구하지 않는다.

> 코드를 작성하면서 테스트를 염두에 두는 것만으로도
> 더 나은 코드를 만들 수 있다.

무엇보다도, 테스트의 수정과 추가가 쉬워야 한다.

## 참고문헌

- _The Art of Readable Code by Dustin Boswell and Trevor Foucher. Copyright 2012 Dustin Boswell and Trevor Foucher, 978-0-596-80229-5._
