---
title: Pixel Shader stage
summary: 픽셀에 아름다움을 추가하기
tags:
  - DirectX
date: 2026-01-22 09:28:07 +0900
updated: 2026-01-23 17:55:38 +0900
---

https://learn.microsoft.com/en-us/windows/win32/direct3d11/pixel-shader-stage

## 주요 Direct3D 11 함수

- [ID3D11Device::CreatePixelShader](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11device-createpixelshader) : 픽셀 셰이더 객체를 생성한다
  컴파일된 HLSL 바이트코드를 GPU에서 사용할 수 있는 상태 객체로 만든다.

```cpp
HRESULT CreatePixelShader(
  [in]            const void         *pShaderBytecode,
  [in]            SIZE_T             BytecodeLength,
  [in, optional]  ID3D11ClassLinkage *pClassLinkage,
  [out, optional] ID3D11PixelShader  **ppPixelShader
);

// ex
ID3D11PixelShader* pixelShader = nullptr;

HRESULT hr = device->CreatePixelShader(
    psBlob->GetBufferPointer(),
    psBlob->GetBufferSize(),
    nullptr,
    &pixelShader
);
```

- [ID3D11DeviceContext::PSSetShader](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-pssetshader) : 픽셀 셰이더를 파이프라인에 바인딩한다.
  이 호출 이후부터 필셀 처리에 해당 셰이더가 사용됨

```cpp
void PSSetShader(
  [in, optional] ID3D11PixelShader   *pPixelShader,
  [in, optional] ID3D11ClassInstance * const *ppClassInstances,
                 UINT                NumClassInstances
);

// ex
context->PSSetShader(pixelShader, nullptr, 0);
```

- [ID3D11DeviceContext::PSSetConstantBuffers](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-pssetconstantbuffers) : 픽셀 셰이더에서 사용하는 [[Constant Buffer]]를 바인딩한다.
  조명 파라미터, 색상 계수, 시간 값 등이 여기에 들어간다.

```cpp
  void PSSetConstantBuffers(
  [in]           UINT         StartSlot,
  [in]           UINT         NumBuffers,
  [in, optional] ID3D11Buffer * const *ppConstantBuffers
);

// hlsl

cbuffer LightCB : register(b0)
{
    float3 lightDir;
    float  intensity;
};


// ex
ID3D11Buffer* lightCB = ...;

context->PSSetConstantBuffers(
    0,      // b0
    1,
    &lightCB
);

```

- [ID3D11DeviceContext::PSSetShaderResources](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-pssetshaderresources) : 픽셀 셰이더에서 읽을 Shader Resource View(SRV, [[D3D 11 View 참고]]) 를 바인딩한다.  
  주로 텍스처를 연결할 때 사용한다.

```cpp
void PSSetShaderResources(
  [in]           UINT                     StartSlot,
  [in]           UINT                     NumViews,
  [in, optional] ID3D11ShaderResourceView * const *ppShaderResourceViews
);

// hlsl
Texture2D albedoMap : register(t0);

// ex
ID3D11ShaderResourceView* albedoSRV = ...;

context->PSSetShaderResources(
    0,      // t0
    1,
    &albedoSRV
);
```

- [ID3D11DeviceContext::PSSetSamplers](https://learn.microsoft.com/en-us/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-pssetsamplers) : 텍스처를 **어떻게 샘플링할지** 정의하는 Sampler State([[Sampler State|Sampler State 참고]])를 바인딩한다.  
  필터링 방식과 주소 모드가 여기서 결정된다.

```cpp
void PSSetSamplers(
  [in]           UINT               StartSlot,
  [in]           UINT               NumSamplers,
  [in, optional] ID3D11SamplerState * const *ppSamplers
);

// hlsl
SamplerState linearSampler : register(s0);

// ex
ID3D11SamplerState* sampler = ...;

context->PSSetSamplers(
    0,      // s0
    1,
    &sampler
);
```

---

Pixel Shader stage는 Rasterizer가 만든 픽셀 단위 입력을 받아서 각 픽셀의 최종 색을 계산해 렌더 타깃에 출력하는 단계다.

Pixel Shader는 primitive 내부의 각 픽셀마다 한 번씩 실행되며, 입력으로 들어오는 값들은 Rasterizer에서 보간된 값들이다.

```cpp
struct PSIn
{
    float4 pos   : SV_POSITION;
    float4 color : COLOR;
    float2 uv    : TEXCOORD0;
};

float4 PSMain(PSIn pin) : SV_Target
{
    return pin.color;
}
```

위 예제에서 Pixel Shader는 각 픽셀에 대해 `pin.color`를 그대로 반환하고, 그 값이 해당 픽셀의 최종 출력 색이 된다. `SV_Target`은 이 반환값이 렌더 타깃(보통 백버퍼)의 색으로 기록된다는 의미다.

```cpp
Texture2D    gTex : register(t0);
SamplerState gSamp : register(s0);

struct PSIn
{
    float4 pos : SV_POSITION;
    float2 uv  : TEXCOORD0;
};

float4 PSMain(PSIn pin) : SV_Target
{
    float4 texColor = gTex.Sample(gSamp, pin.uv);
    return texColor;
}
```

이 예제에서 Pixel Shader는 보간된 `uv`를 사용해 텍스처를 샘플링하고, 샘플링된 색을 최종 픽셀 색으로 출력한다.

```cpp
context->PSSetShader(ps, nullptr, 0);
context->PSSetShaderResources(0, 1, &textureSRV);
context->PSSetSamplers(0, 1, &samplerState);
```

이 코드는 Pixel Shader를 파이프라인에 바인딩하고, 셰이더에서 사용할 텍스처(SRV)와 샘플러를 설정한다.  
Pixel Shader stage의 결과는 [[Output Merger stage|Output Merger stage]] 단계에서 렌더 타깃에 합성되어 화면에 표시된다.
