---
title: DX11 셰이더 컴파일
summary: DX11에서 셰이더를 컴파일 해보자
tags:
---

## 1. 셰이더 컴파일이란

DX11은 HLSL(.hlsl) 소스를 **GPU가 실행 가능한 바이트코드**로 바꿔서 사용한다.
이 변환 과정을 컴파일이라고 부른다.

- 입력: HLSL 소스 코드
- 출력: 컴파일된 바이트코드(blob)
- 사용처: CreateVertexShader / CreatePixelShader 등에 전달

---

## 2. 전체 흐름 요약

1. HLSL 파일 준비
2. D3DCompileFromFile로 컴파일
3. 컴파일 결과(blob) 얻기
4. Device로 셰이더 객체 생성
5. Context에 셰이더 바인딩

---

## 3. 가장 단순한 HLSL 예제

```cpp
// SimpleVS.hlsl
struct VSInput
{
    float3 pos : POSITION;
};

struct VSOutput
{
    float4 pos : SV_POSITION;
};

VSOutput main(VSInput input)
{
    VSOutput output;
    output.pos = float4(input.pos, 1.0f);
    return output;
}
```

---

## 4. C++에서 셰이더 컴파일

```cpp
#include <d3dcompiler.h>

ID3DBlob* vsBlob = nullptr;
ID3DBlob* errorBlob = nullptr;

HRESULT hr = D3DCompileFromFile(
    L"SimpleVS.hlsl",      // 파일 경로
    nullptr,               // 매크로
    D3D_COMPILE_STANDARD_FILE_INCLUDE,
    "main",                // 엔트리 포인트
    "vs_5_0",              // 셰이더 모델
    0, 0,
    &vsBlob,
    &errorBlob
);

if (FAILED(hr))
{
    if (errorBlob)
    {
        OutputDebugStringA(
            (char*)errorBlob->GetBufferPointer()
        );
        errorBlob->Release();
    }
    return;
}
```

핵심 포인트만 보면 된다.

- `main`
  → HLSL에서 시작 함수 이름
- `vs_5_0`
  → Vertex Shader, Shader Model 5.0
- 결과는 `ID3DBlob`에 저장됨

---

## 5. 셰이더 객체 생성

```cpp
ID3D11VertexShader* vertexShader = nullptr;

device->CreateVertexShader(
    vsBlob->GetBufferPointer(),
    vsBlob->GetBufferSize(),
    nullptr,
    &vertexShader
);
```

- 컴파일된 바이트코드를 GPU용 객체로 변환
- 이후 vsBlob은 InputLayout 생성 등에 재사용 가능

---

## 6. 파이프라인에 바인딩

```cpp
context->VSSetShader(vertexShader, nullptr, 0);
```

이 시점부터 렌더링 시 이 버텍스 셰이더가 사용된다.

---

## 7. 자주 헷갈리는 포인트

- 컴파일은 GPU 작업이 아님
  → CPU에서 수행, 결과만 GPU로 전달
- 런타임 컴파일 vs 오프라인 컴파일
  → 실무에선 fxc/dxc로 미리 컴파일한 .cso를 로드하는 경우가 많음
- 에러 로그는 반드시 출력
  → HLSL 에러는 errorBlob 안에만 있음

---

## 정리

DX11 셰이더 컴파일은 HLSL 소스를 GPU가 실행할 수 있는 바이트코드로 바꾼 뒤, 그 결과로 셰이더 객체를 만드는 과정이다.
