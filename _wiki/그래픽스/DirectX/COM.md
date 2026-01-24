---
title: COM
summary: Component Object Model
tags:
date: 2026-01-22 19:04:53 +0900
updated: 2026-01-23 17:55:38 +0900
---

## COM이란 무엇인가

COM은 **Component Object Model**의 약자다.  
Microsoft가 만든 **이진 수준의 객체 컴포넌트 규약**이다.

C++ 문법이나 특정 언어 기능이 아니라,  
**객체를 어떻게 만들고, 넘기고, 수명 관리할 것인가**에 대한 약속이다.

---

## COM이 필요한 이유

운영체제 레벨에서 다음 요구가 있었다.

- 언어가 달라도 객체를 공유하고 싶다
- DLL 경계를 넘어 객체를 호출하고 싶다
- 컴파일러가 달라도 ABI가 깨지지 않아야 한다
- 객체 수명을 명확하게 관리해야 한다

이를 위해 Microsoft는 **규칙만 정의한 모델**을 만들었다.  
그게 COM이다.

---

## COM의 핵심 규칙

COM 객체는 반드시 이 규칙을 따른다.

- 인터페이스 기반
- 구현 은닉
- 참조 카운트 기반 수명 관리
- 이진 호환성 유지

이 규칙 덕분에  
Direct3D, DirectX, Windows Shell, WIC 등  
Windows 핵심 API들이 모두 같은 패턴을 쓴다.

---

## COM 객체는 인터페이스 포인터다

COM에서 객체를 다룬다는 말은  
**구현을 만지는 게 아니라 인터페이스 포인터를 들고 있는 것**을 의미한다.

```cpp
ID3D11Device* device = nullptr;
```

이 포인터는

- 실제 클래스 주소를 가리키지 않는다
- vtable을 통해 함수 호출만 가능하다
- 내부 구현은 완전히 숨겨져 있다

---

## 왜 new / delete를 쓰지 않나

COM 객체는 `new`로 만들지 않는다.

대신 이런 패턴을 쓴다.

```cpp
HRESULT hr = D3D11CreateDevice(..., &device);
```

이유는 단순하다.

- 생성 실패를 예외 없이 표현해야 한다
- C 언어에서도 동일하게 써야 한다
- ABI 안정성을 유지해야 한다

그래서 COM은

- 반환값 → HRESULT
- 결과 객체 → out parameter

라는 구조를 사용한다.

---

## HRESULT란 무엇인가

COM 함수는 성공/실패를 반환값으로 알려준다.

```cpp
HRESULT hr = device->CreateBuffer(...);
if (FAILED(hr))
{
    // 실패 처리
}
```

- `S_OK` → 성공
- 실패 코드 → 원인 명시

예외를 쓰지 않는 것이 COM의 철학이다.

---

## 참조 카운트 기반 수명 관리

COM 객체는 내부적으로 **참조 카운트**를 가진다.

핵심 함수는 세 개다.

```cpp
ULONG AddRef();
ULONG Release();
HRESULT QueryInterface(...);
```

의미는 다음과 같다.

- AddRef  
   참조 하나 추가
- Release  
   참조 하나 제거  
   0이 되면 객체 파괴
- QueryInterface  
   같은 객체의 다른 인터페이스 요청

---

## 왜 nullptr로 시작하나

COM 객체 포인터는 항상 이렇게 시작한다.

```cpp
ID3D11Buffer* buffer = nullptr;
```

이유는 명확하다.

- 아직 참조를 얻지 않았다는 표시
- 생성 실패 시 안전
- Release 호출 여부를 명확히 판단 가능

COM에서는  
“유효한 포인터를 들고 있으면 참조가 하나 있다”는 의미다.

---

## Direct3D가 COM을 쓰는 이유

Direct3D는

- 드라이버
- GPU 제조사
- 운영체제

경계를 넘나든다.

COM의 장점은 여기서 바로 드러난다.

- 바이너리 호환성
- 구현 완전 은닉
- 안정적인 수명 관리
- 언어 중립 API

그래서 Direct3D의 모든 객체는 COM이다.

---

## C++스럽지 않은 이유

COM은 C++ 스타일이 아니다.

- 스마트 포인터 없음
- RAII 기본 제공 없음
- 예외 없음

하지만 그 대신

- 명확한 규칙
- 예측 가능한 동작
- ABI 안정성

을 얻는다.

C++에서 COM을 쓸 때 `ComPtr` 같은 래퍼를 쓰는 이유도  
이 간극을 메우기 위해서다.

---

## 정리

COM을 한 문장으로 요약하면 이렇다.

- **COM은 객체를 안전하게 만들고 공유하기 위한 운영체제 레벨의 약속이다**

Direct3D에서 보이는

```cpp
ID3D11Something*
CreateSomething(...)
Release()
```

이 패턴은 전부 COM의 결과다.

COM을 이해하면  
왜 Direct3D 코드가 항상 그 형태인지  
자연스럽게 납득된다.
