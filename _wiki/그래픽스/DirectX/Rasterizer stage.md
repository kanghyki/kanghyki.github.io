---
title: Rasterizer stage
summary: 정점을 픽셀로
tags:
date: 2026-01-22 09:28:07 +0900
updated: 2026-01-23 17:55:38 +0900
---

https://learn.microsoft.com/en-us/windows/win32/direct3d11/d3d10-graphics-programming-guide-rasterizer-stage

## 주요 Direct3D 11 함수

- [ID3D11Device::CreateRasterizerState](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11device-createrasterizerstate) : 래스터라이저 단계에 동작 방법을 알려주는 래스터라이저 상태 개체를 만듦

```cpp
HRESULT CreateRasterizerState(
  [in]            const D3D11_RASTERIZER_DESC *pRasterizerDesc,
  [out, optional] ID3D11RasterizerState       **ppRasterizerState
);

// 1. Rasterizer State 생성
D3D11_RASTERIZER_DESC rsDesc{};
rsDesc.FillMode = D3D11_FILL_SOLID;
rsDesc.CullMode = D3D11_CULL_BACK;
rsDesc.FrontCounterClockwise = FALSE;
rsDesc.DepthClipEnable = TRUE;

ID3D11RasterizerState* rasterizerState = nullptr;
device->CreateRasterizerState(&rsDesc, &rasterizerState);
```

- [ID3D11DeviceContext::RSSetState](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-rssetstate) : 파이프라인의 [[Rasterizer stage]]에 대한 래스터라이저 상태를 설정

```cpp
void RSSetState(
  [in, optional] ID3D11RasterizerState *pRasterizerState
);

// 2. Rasterizer State 바인딩
deviceContext->RSSetState(rasterizerState);
```

- [ID3D11DeviceContext::RSSetViewports](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-rssetviewports) : 뷰포트 배열을 파이프라인의 래스터라이저 단계에 바인딩

```cpp
void RSSetViewports(
  [in]           UINT                 NumViewports,
  [in, optional] const D3D11_VIEWPORT *pViewports
);

// 3. Viewport 설정
D3D11_VIEWPORT viewport{};
viewport.TopLeftX = 0.0f;
viewport.TopLeftY = 0.0f;
viewport.Width    = static_cast<float>(width);
viewport.Height   = static_cast<float>(height);
viewport.MinDepth = 0.0f;
viewport.MaxDepth = 1.0f;

deviceContext->RSSetViewports(1, &viewport);

```

- [ID3D11DeviceContext::RSSetScissorRects](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-rssetscissorrects) : scissor rect 배열을 래스터라이저 단계에 바인딩

```cpp
void RSSetScissorRects(
  [in]           UINT             NumRects,
  [in, optional] const D3D11_RECT *pRects
);

// 4. Scissor Rect 설정
D3D11_RECT scissor{};
scissor.left   = 0;
scissor.top    = 0;
scissor.right  = width;
scissor.bottom = height;

deviceContext->RSSetScissorRects(1, &scissor);
```

> `scissor rect`는 **래스터라이저 단계에서 픽셀 출력이 허용되는 화면 영역**입니다.

**Rasterizer stage**는 Vertex Shader에서 출력된 정점 결과를 받아 삼각형(IA에서 설정된 Primitive)을 **화면 픽셀 단위로 변환**하는 단계다.

이 단계에서 처음으로 `픽셀`이라는 개념이 등장한다.

Rasterizer가 입력으로 받는 것은

- IA에서 정의된 primitive
- VS가 출력한 각 정점의 `SV_POSITION`과 기타 출력 값들이다

Rasterizer는 다음 일을 순서대로 수행한다.

1. 클립 공간 좌표를 기준으로 화면 좌표로 변환하고 뷰포트에 맞게 잘라낸다
2. 삼각형이 화면에서 차지하는 영역을 계산한다
3. 그 영역 안에 포함되는 픽셀들을 나열한다
4. 각 픽셀에 대해 정점 출력 값들을 위치 비율에 따라 보간한다

이때 보간되는 값은

- COLOR
- TEXCOORD
- NORMAL 등

Vertex Shader 출력 중 `SV_POSITION`을 제외한 값들이다.

보간은 삼각형 내부 위치를 기준으로 선형 계산된다.  
한 픽셀의 값은 세 정점 출력 값의 가중 평균으로 만들어진다.

```cpp
P.color = w0 * v0.color + w1 * v1.color + w2 * v2.color
P.uv    = w0 * v0.uv    + w1 * v1.uv    + w2 * v2.uv
```

Rasterizer는

- **이 픽셀은 이 삼각형에 속한다**
- **이 픽셀에서 사용할 입력 값은 이것이다** 를 결정하는 것이다.

```cpp
struct PSIn
{
    float4 pos   : SV_POSITION;
    float4 color : COLOR;
    float2 uv    : TEXCOORD0;
};
```

Rasterizer의 출력은 픽셀 단위 입력 데이터 스트림이며 이 데이터가 [[Pixel Shader stage|Pixel Shader stage]]로 전달된다.

정리하면 Vertex Shader가 정점의 위치와 속성을 정리하고 Rasterizer가 그 결과를 화면 픽셀 기준으로 변환하며 Pixel Shader가 픽셀의 최종 색을 결정한다.
