---
title: D3D View
summary: D3D 11 View를 알아보자
tags:
date: 2026-01-22 19:04:53 +0900
updated: 2026-01-23 17:55:38 +0900
---

## Direct3D 11에서 "View"라는 개념

Direct3D 11을 공부하다 보면 `Shader Resource View`, `Render Target View`, `Depth Stencil View`가 계속 등장한다.  
이 개념들은 개별로 외우면 헷갈리지만, **View라는 하나의 관점**으로 보면 구조가 단순해진다.

---

## 리소스는 의미 없는 메모리다

GPU 리소스는 본질적으로 **메모리 블록**이다.

```cpp
ID3D11Texture2D* texture = nullptr;

D3D11_TEXTURE2D_DESC texDesc{};
texDesc.Width  = 1024;
texDesc.Height = 1024;
texDesc.Format = DXGI_FORMAT_R8G8B8A8_UNORM;
texDesc.BindFlags =
    D3D11_BIND_SHADER_RESOURCE |
    D3D11_BIND_RENDER_TARGET;

device->CreateTexture2D(&texDesc, nullptr, &texture);
```

이 시점에서 `texture`는:

- 텍스처처럼 보이지만
- 아직 읽히지도, 쓰이지도 않는다

아직 **아무 관점(View)도 붙지 않은 메모리**일 뿐이다.

---

## View는 “이 메모리를 어떻게 볼 것인가”다

같은 `texture`라도 상황에 따라 역할이 달라진다.

- 셰이더에서 읽고 싶다
- 렌더링 결과를 써 넣고 싶다

Direct3D 11은 이 차이를 **View 객체로 분리**한다.

---

## Shader Resource View 관점 (읽기)

셰이더에서 이 텍스처를 입력 데이터로 쓰고 싶다면  
Shader Resource View를 만든다.

```cpp
ID3D11ShaderResourceView* srv = nullptr;

device->CreateShaderResourceView(texture, nullptr, &srv);
```

이제 셰이더에서는 이렇게 보인다.

```hlsl
Texture2D diffuseMap : register(t0);
SamplerState samp    : register(s0);
```

그리고 바인딩한다.

```cpp
deviceContext->PSSetShaderResources(0, 1, &srv);
```

이 순간 GPU에게 전달되는 의미는 이거다.

- 이 메모리를
- 셰이더 관점에서
- 읽기 전용으로 사용한다

---

## Render Target View 관점 (쓰기)

같은 텍스처를 이번엔 출력 대상으로 쓰고 싶다면  
Render Target View를 만든다.

```cpp
ID3D11RenderTargetView* rtv = nullptr;

device->CreateRenderTargetView(texture, nullptr, &rtv);
```

그리고 출력 단계에 바인딩한다.

```cpp
deviceContext->OMSetRenderTargets(1, &rtv, nullptr);
```

의미는 완전히 바뀐다.

- 이 메모리를
- 출력 병합 단계에서
- 픽셀 결과를 쓰는 대상으로 사용한다

리소스는 동일하지만, **관점이 바뀌었다**.

---

## 같은 리소스, 다른 관점

정리하면 이렇다.

```cpp
// 같은 texture
ID3D11Texture2D* texture;

// 읽기 관점
ID3D11ShaderResourceView* srv;

// 쓰기 관점
ID3D11RenderTargetView* rtv;
```

- `texture`  
   데이터 저장소
- `srv`  
   셰이더 입력 관점
- `rtv`  
   렌더링 출력 관점

Direct3D 11은 이 셋을 명확히 분리한다.

---

## 왜 이런 구조인가

이 구조 덕분에 Direct3D는 다음을 보장한다.

- 읽기와 쓰기 충돌을 명시적으로 관리
- 파이프라인 단계별 역할 명확화
- 드라이버 의존적인 암묵적 동작 제거

즉, View는 편의용 래퍼가 아니라  
**GPU 사용 의도를 명확히 선언하는 수단**이다.

---

## View 바인딩은 “의미 선언”이다

View를 바인딩하는 코드는 단순한 setter가 아니다.

```cpp
deviceContext->PSSetShaderResources(0, 1, &srv);
deviceContext->OMSetRenderTargets(1, &rtv, nullptr);
```

이 두 줄은 GPU에게 이렇게 말한다.

- 지금 이 메모리는 입력이다
- 지금 이 메모리는 출력이다

Direct3D 11은 이 선언을 바탕으로  
파이프라인 상태를 구성한다.

---

## 정리

View 관점에서 보면 구조는 명확하다.

- 리소스는 중립적인 메모리
- 의미는 View가 부여
- 사용 목적은 바인딩으로 선언

그래서 Direct3D 11에서 중요한 건  
"무슨 리소스를 쓰는가"보다  
"어떤 View로 바라보는가"다.
