---
title: Input Assembler stage
summary: 입력을 어셈블해주는 IA
tag:
---

https://learn.microsoft.com/en-us/windows/win32/direct3d11/d3d10-graphics-programming-guide-input-assembler-stage

D3D 10 이상 API는 기능 영역을 단계로 구분한다.
파이프라인의 첫단계인 Input Assembler(IA) 단계다.

## IA가 하는 일

1. 어떤 정점 버퍼를 읽을지
2. 정점 버퍼의 메모리 배치를 VS input과 어떻게 매칭할지
3. 정점을 어떤 방식으로 묶어 primitive를 만들지 (Topology + Index Buffer)

## 주요 Direct3D 11 함수

- [ID3D11Device::CreateInputLayout](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11device-createinputlayout) : 입력 버퍼 데이터를 설명하는 입력 레이아웃 생성함
```cpp
HRESULT CreateInputLayout(
  [in]            const D3D11_INPUT_ELEMENT_DESC *pInputElementDescs,
  [in]            UINT                           NumElements,
  [in]            const void                     *pShaderBytecodeWithInputSignature,
  [in]            SIZE_T                         BytecodeLength,
  [out, optional] ID3D11InputLayout              **ppInputLayout
);
```

- [ID3D11DeviceContext::IASetInputLayout](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-iasetinputlayout) : 입력 레이아웃 개체를 입력 어셈블러 단계에 바인딩함
```cpp
void IASetInputLayout(
  [in, optional] ID3D11InputLayout *pInputLayout
);
```

- [ID3D11DeviceContext::IASetPrimitiveTopology](https://learn.microsoft.com/ko-kr/windows/win32/api/d3d11/nf-d3d11-id3d11devicecontext-iasetprimitivetopology) : 기본 형식 및 입력 어셈블러 단계의 입력 데이터를 설명하는 데이터 순서에 대한 정보를 바인딩함
```cpp
void IASetPrimitiveTopology(
  [in] D3D11_PRIMITIVE_TOPOLOGY Topology
);
```


## 1) 셰이더 입력(VS)부터 정하기

IA는 버퍼의 바이트 배열을 읽고 Input Layout 규칙으로 VS input을 만들어준다.

```hlsl
// Vertex Shader input
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

VSOut VSMain(VSIn vin)
{
    VSOut o;
    o.pos = float4(vin.pos, 1.0);
    o.color = vin.color;
    return o;
}
```

IA 입장에선 `POSITION`에 들어갈 `3 floats`, `COLOR`에 들어갈 `4 floats`를 버퍼에서 어떻게 가져올지(오프셋/포맷)가 필요하다.

## 2) CPU 쪽 정점 구조체와 버퍼 만들기

VSIn과 동일한 의미의 구조체를 만든다고 보면 된다.
이 때 메모리 배치를 신경써줘야 한다.

```cpp
struct Vertex
{
    float x, y, z;      // POSITION
    float r, g, b, a;   // COLOR
};
```

삼각형 정점/인덱스 데이터 예시

```cpp
Vertex vertices[] =
{
    { 0.0f,  0.5f, 0.0f, 1,0,0,1 },  // top (red)
    { 0.5f, -0.5f, 0.0f, 0,1,0,1 },  // right (green)
    {-0.5f, -0.5f, 0.0f, 0,0,1,1 },  // left (blue)
};

uint16_t indices[] = { 0, 1, 2 };
```

D3D11 스타일 버퍼 생성

```cpp
ID3D11Buffer* vb = nullptr;
{
    D3D11_BUFFER_DESC bd = {};
    bd.Usage = D3D11_USAGE_DEFAULT;
    bd.ByteWidth = sizeof(vertices);
    bd.BindFlags = D3D11_BIND_VERTEX_BUFFER;

    D3D11_SUBRESOURCE_DATA init = {};
    init.pSysMem = vertices;

    device->CreateBuffer(&bd, &init, &vb);
}

ID3D11Buffer* ib = nullptr;
{
    D3D11_BUFFER_DESC bd = {};
    bd.Usage = D3D11_USAGE_DEFAULT;
    bd.ByteWidth = sizeof(indices);
    bd.BindFlags = D3D11_BIND_INDEX_BUFFER;

    D3D11_SUBRESOURCE_DATA init = {};
    init.pSysMem = indices;

    device->CreateBuffer(&bd, &init, &ib);
}
```

## 3) Input Layout: "버퍼 바이트 → VSIn" 변환 규칙

이 규칙을 보고 IA가 버퍼에서 `POSITION` / `COLOR`를 추출해서 VS로 넘겨준다.

```cpp
ID3D11InputLayout* inputLayout = nullptr;

// VS 바이트코드가 필요함(컴파일 결과). 여기서는 이미 있다고 가정.
extern ID3DBlob* vsBytecode;

D3D11_INPUT_ELEMENT_DESC layoutDesc[] =
{
    // SemanticName, SemanticIndex, Format, InputSlot, AlignedByteOffset, InputSlotClass, InstanceDataStepRate
    { "POSITION", 0, DXGI_FORMAT_R32G32B32_FLOAT,    0, 0,  D3D11_INPUT_PER_VERTEX_DATA, 0 },
    { "COLOR",    0, DXGI_FORMAT_R32G32B32A32_FLOAT, 0, 12, D3D11_INPUT_PER_VERTEX_DATA, 0 },
};

device->CreateInputLayout(
    layoutDesc,
    _countof(layoutDesc),
    vsBytecode->GetBufferPointer(),
    vsBytecode->GetBufferSize(),
    &inputLayout
);
```

오프셋이 왜 0과 12인 이유는 `POSITION`은 float3은 12바이트라서 `COLOR`는 그 다음 12바이트 지점에서 시작하기 때문이다.

## 4) 드로우 직전에 IA 단계 설정 (IASet…)

여기서 IA가 무엇을 읽고, 어떻게 묶고, 어떤 형태로 VS에 줄지 정해지게 된다.

```cpp
// 1) 어떤 레이아웃으로 읽을지
context->IASetInputLayout(inputLayout);

// 2) 어떤 버텍스 버퍼를 읽을지 (스트라이드/오프셋 중요)
UINT stride = sizeof(Vertex);
UINT offset = 0;
context->IASetVertexBuffers(0, 1, &vb, &stride, &offset);

// 3) 인덱스 버퍼(선택). 쓰면 정점을 재사용해 primitive 구성 가능
context->IASetIndexBuffer(ib, DXGI_FORMAT_R16_UINT, 0);

// 4) 정점을 어떻게 묶을지(토폴로지)
context->IASetPrimitiveTopology(D3D11_PRIMITIVE_TOPOLOGY_TRIANGLELIST);
```

즉,

1. vertex buffer에서 0번째 정점 읽기
```
bytes[0..11] → POSITION(float3)
bytes[12..27] → COLOR(float4)
```
2. index buffer의 0,1,2를 보고 정점 3개를 모아서 triangle 1개로 조립
3. 조립된 정점 스트림을 VSMain(VSIn vin)으로 흘려보낸다.

## 5) Draw 호출에서 IA가 실제로 사용됨

```cpp
context->VSSetShader(vs, nullptr, 0);
context->PSSetShader(ps, nullptr, 0);

// 인덱스를 쓰는 경우
context->DrawIndexed(3, 0, 0);

// 인덱스 없이 그냥 순서대로 쓰면
// context->Draw(3, 0);
```