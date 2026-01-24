---
title: Output Merger stage
summary: 여행의 종착지
tags:
  - DirectX
date: 2026-01-22 09:28:07 +0900
updated: 2026-01-23 17:55:38 +0900
---

https://learn.microsoft.com/en-us/windows/win32/direct3d11/d3d10-graphics-programming-guide-output-merger-stage

## 주요 Direct3D 11 함수

- [ID3D11DeviceContext::ClearDepthStencilView](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-cleardepthstencilview) : Depth/Stencil View(DSV)가 가리키는 깊이/스텐실 버퍼를 초기화한다.

```cpp
void ClearDepthStencilView(
  [in] ID3D11DepthStencilView *pDepthStencilView,
  [in] UINT                   ClearFlags,
  [in] FLOAT                  Depth,
  [in] UINT8                  Stencil
);

// ex
// 프레임 시작 시: 깊이/스텐실 버퍼 초기화
context->ClearDepthStencilView(
    dsv,
    D3D11_CLEAR_DEPTH | D3D11_CLEAR_STENCIL,
    1.0f,
    0
);
```

- [ID3D11DeviceContext::OMSetRenderTargets](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-omsetrendertargets) : OM 단계에 **출력 대상**을 바인딩한다.

```cpp
void OMSetRenderTargets(
  [in]           UINT                   NumViews,
  [in, optional] ID3D11RenderTargetView * const *ppRenderTargetViews,
  [in, optional] ID3D11DepthStencilView *pDepthStencilView
);

// ex
ID3D11RenderTargetView* rtvs[] = { backBufferRTV };

context->OMSetRenderTargets(
    1,
    rtvs,
    dsv
);
```

- [ID3D11DeviceContext::OMSetDepthStencilState](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-omsetdepthstencilstate) : Depth/Stencil 테스트 및 쓰기 규칙을 설정한다.

```cpp
void OMSetDepthStencilState(
  [in, optional] ID3D11DepthStencilState *pDepthStencilState,
  [in]           UINT                    StencilRef
);

//ex
context->OMSetDepthStencilState(depthTestWriteState, 0);
```

---

Output Merger stage는 [[Pixel Shader stage|Pixel Shader]]가 계산한 픽셀 결과를 받아서 **최종적으로 렌더 타깃과 깊이/스텐실 버퍼에 반영하는 단계**다.  
이 단계에서 픽셀이 실제로 **화면 데이터**가 될지 말지가 결정된다.

Pixel Shader까지 끝나면 각 픽셀에 대해 이런 값이 하나 만들어진 상태다.

```cpp
float4 PSMain(PSIn pin) : SV_Target
{
    return float4(1, 0, 0, 1);
}
```

이 반환값은 아직 화면에 쓰이지 않는다.  
Output Merger는 이 값을 받아서 먼저 깊이/스텐실 테스트를 수행한다.  
현재 픽셀이 기존 픽셀보다 앞에 있는지, 스텐실 조건을 만족하는지를 판단하고, 조건을 통과하지 못하면 이 픽셀은 버려진다.

깊이/스텐실 상태는 CPU 쪽에서 이렇게 설정된다.

```cpp
context->OMSetDepthStencilState(depthStencilState, 0);
```

테스트를 통과한 픽셀에 대해서는 블렌딩이 적용될 수 있다.  
블렌딩은 기존 렌더 타깃의 색과 Pixel Shader 출력 색을 어떻게 섞을지를 결정한다.

```cpp
context->OMSetBlendState(blendState, nullptr, 0xffffffff);
```

알파 블렌딩이 켜져 있다면 내부적으로는 다음과 같은 계산이 일어난다.

```
finalColor =
    srcColor * srcAlpha +
    dstColor * (1 - srcAlpha)
```

이 계산 역시 Pixel Shader가 아니라 Output Merger에서 수행된다.

마지막으로 Output Merger는 이 결과를 실제로 어느 렌더 타깃과 깊이 버퍼에 쓸지를 결정한다.

```cpp
context->OMSetRenderTargets(1, &rtv, dsv);
```

이 설정에 따라 Pixel Shader 출력은

- 백버퍼에 쓰일 수도 있고
- 오프스크린 텍스처에 쓰일 수도 있으며
- 깊이 값만 갱신될 수도 있다.

정리하면,

Pixel Shader는 픽셀의 "값"을 계산하고 Output Merger는 그 값을 쓸지 말지, 어디에 쓸지, 기존 값과 어떻게 합칠지를 결정한다.
