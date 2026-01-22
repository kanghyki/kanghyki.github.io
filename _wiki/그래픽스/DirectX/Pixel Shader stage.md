---
title: Pixel Shader stage
summary: 픽셀에 아름다움을 추가하기
tag:
---

https://learn.microsoft.com/en-us/windows/win32/direct3d11/pixel-shader-stage

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
Pixel Shader stage의 결과는 [[그래픽스/DirectX/Output Merger stage|Output Merger stage]] 단계에서 렌더 타깃에 합성되어 화면에 표시된다.