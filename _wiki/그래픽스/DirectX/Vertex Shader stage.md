---
title: Vertex Shader stage
summary: 정점 단위로 실행되는 셰이더
tag:
---

https://learn.microsoft.com/en-us/windows/win32/direct3d11/vertex-shader-stage

D3D 10 이상 API는 그래픽 기능을 여러단계(stage)로 나누어 구성한다.  
IA 다음에 오는 단계가 **Vertex Shader(VS) stage**다.

Vertex Shader는 **정점 단위로 실행되는 셰이더**로,  
[[Input Assembler stage|Input Assembler]]가 조립해 넘겨준 정점 데이터를 받아 **좌표 변환과 데이터 전달을 수행**한다.

결론적으로 **VS**는 다음 역할만 수행한다.

1. IA로부터 전달된 정점 입력을 하나씩 처리하고
2. 정점의 위치를 클립 공간 좌표로 **변환**하며
3. 이후 단계에서 사용할 데이터를 정리해 출력한다

> If no vertex modification or transformation is required, a pass-through vertex shader must be created and set to the pipeline.

## VS가 하는 일

Vertex Shader 단계에서 하는 일은 명확하다.

1. IA가 만들어 준 VS 입력 구조체를 받는다
2. 정점 좌표를 변환한다 (Object → World → View → Projection)
3. 픽셀 셰이더로 넘길 값을 출력 구조체에 담는다

## 1) Vertex Shader 입력 정의

VS 입력은 IA의 Input Layout(VSIn, VSOut)과 Semantic(Position, Color)으로 연결된다.

```hlsl
struct VSIn
{
    float3 pos   : POSITION;
    float4 color : COLOR;
};

struct VSOut
{
    float4 pos   : SV_POSITION;
    float4 color : COLOR;
};
```

> `POSITION`, `COLOR`는 IA가 채워서 넘겨주고 VS는 이 값을 사용한다

## 2) 정점 좌표 변환

Vertex Shader의 가장 중요한 출력은 `SV_POSITION`이다.

```hlsl
cbuffer PerObject : register(b0)
{
    float4x4 gWorldViewProj;
};

VSOut VSMain(VSIn vin)
{
    VSOut o;
    o.pos = mul(float4(vin.pos, 1.0), gWorldViewProj);
    o.color = vin.color;
    return o;
}
```

이 단계에서 정점은

- 오브젝트 공간 좌표에서
- 클립 공간 좌표로 변환된다

`SV_POSITION`으로 출력된 값은 다음 단계인 [[Rasterizer stage|Rasterizer]]가 **화면 픽셀**로 변환하는 기준이 된다.

## 3) 데이터 전달

VS 출력 구조체에 담긴 값들(`COLOR`, `TEXCOORD` 등)은 Vertex Shader에서 정점 단위로 출력되고,  
이 값들은 [[Rasterizer stage|Rasterizer stage]]에서 primitive 내부 픽셀 기준으로 보간된 뒤 [[Pixel Shader stage|Pixel Shader stage]]의 입력으로 전달된다.