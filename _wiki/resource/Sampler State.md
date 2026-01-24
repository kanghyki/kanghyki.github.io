---
title: Sampler state
summary: Sampler state에 대해 알아보자
tags:
  - DirectX
date: 2026-01-22 19:04:53 +0900
updated: 2026-01-23 17:55:38 +0900
---

Sampler State는 **텍스처를 읽는 방식에 대한 상태 객체**다.  
데이터를 담지 않고, 오직 **샘플링 규칙만** 정의한다.

Direct3D 11에서 Sampler State는 파이프라인의 일부로 취급되며,  
생성 이후에는 값이 변하지 않는 **불변 상태 객체**다.

---

## Sampler State가 필요한 이유

셰이더가 텍스처를 읽을 때는 단순히 좌표만 넘기지 않는다.

- 텍스처 좌표가 픽셀 사이에 걸쳐 있으면 어떻게 할 것인가
- 텍스처 좌표가 0~1 범위를 벗어나면 어떻게 할 것인가
- 어떤 mip level을 사용할 것인가

이 모든 판단 기준을 **Sampler State**가 담당한다.

---

## Sampler State가 정의하는 규칙

Sampler State는 다음과 같은 규칙을 고정한다.

- 필터링 방식  
   point / linear / anisotropic
- 주소 지정 방식  
   wrap / clamp / mirror / border
- LOD 정책  
   mip 선택 범위  
   min LOD / max LOD / bias

이 규칙들은 샘플링 시 GPU 하드웨어에서 직접 사용된다.

---

## Sampler State 생성

Sampler State는 Device를 통해 생성된다.

```cpp
ID3D11SamplerState* sampler = nullptr;

D3D11_SAMPLER_DESC desc{};
desc.Filter   = D3D11_FILTER_MIN_MAG_MIP_LINEAR;
desc.AddressU = D3D11_TEXTURE_ADDRESS_WRAP;
desc.AddressV = D3D11_TEXTURE_ADDRESS_WRAP;
desc.AddressW = D3D11_TEXTURE_ADDRESS_WRAP;
desc.MinLOD   = 0.0f;
desc.MaxLOD   = D3D11_FLOAT32_MAX;

device->CreateSamplerState(&desc, &sampler);
```

이 시점에서 sampler는  
“이 규칙으로 텍스처를 읽겠다”는 **고정된 정책 객체**가 된다.

---

## 파이프라인에서의 사용

Sampler State는 셰이더 단계에 바인딩된다.

```cpp
deviceContext->PSSetSamplers(0, 1, &sampler);
```

이후 해당 셰이더 단계에서 이루어지는 모든 텍스처 샘플링은  
이 Sampler State의 규칙을 따른다.

---

## 셰이더 코드에서의 모습

HLSL에서는 다음처럼 선언된다.

```hlsl
SamplerState sampler : register(s0);
```

샘플링 시 GPU는

- 필터링
- 좌표 처리
- mip 선택

을 모두 Sampler State에 따라 수행한다.

---

## Sampler State는 데이터를 갖지 않는다

Sampler State는

- 텍스처를 저장하지 않는다
- 픽셀 값을 담지 않는다
- 메모리를 소유하지 않는다

오직 **샘플링 규칙만** 담고 있다.

그래서 여러 텍스처에서 하나의 Sampler State를 공유하는 것이 일반적이다.

---

## nullptr로 초기화하는 이유

Sampler State는 [[COM]] 인터페이스다.

```cpp
ID3D11SamplerState* sampler = nullptr;
```

- 생성 전 상태 명확
- 실패 시 안전
- 참조 카운트 관리 가능

다른 Direct3D 객체와 동일한 생성·수명 규칙을 따른다.

---

## 정리

Sampler State의 핵심은 단순하다.

- 텍스처를 **어떻게 읽을지**에 대한 규칙
- 데이터 없음
- 불변 상태 객체
- 셰이더 단계에 바인딩되어 사용

Sampler State를 이해하면  
텍스처 샘플링 동작이 훨씬 명확해진다.
