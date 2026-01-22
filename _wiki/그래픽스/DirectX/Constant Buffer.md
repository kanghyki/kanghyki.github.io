---
title: 상수 버퍼
summary:  상수 버퍼를 알아보자
tag:
---


## Constant Buffer란 무엇인가
Constant Buffer는 **CPU에서 계산한 값들을 GPU 셰이더로 전달하기 위한 메모리 블록**이다.  
픽셀 셰이더, 버텍스 셰이더 등 모든 셰이더 단계에서 읽을 수 있으며, 프레임마다 혹은 오브젝트마다 바뀌는 값들을 담는다.

대표적인 예는 다음과 같다.

- 변환 행렬(World, View, Projection)
- 조명 방향, 색상, 세기
- 시간 값, 화면 해상도
- 머티리얼 파라미터

핵심은 “상수”라는 이름과 달리 **GPU 입장에서 draw call 동안만 상수**라는 점이다.

---



## 왜 Constant Buffer가 필요한가
GPU는 CPU 메모리를 직접 참조하지 않는다.  
셰이더가 사용할 데이터는 반드시 GPU 메모리로 복사되어야 하며, 그 표준적인 경로가 Constant Buffer다.

Constant Buffer의 목적은 명확하다.

- 셰이더 코드와 CPU 코드 사이의 인터페이스
- 구조화된 방식으로 파라미터 전달
- 빠른 바인딩과 캐시 친화적인 접근

텍스처가 “이미지 데이터”라면, Constant Buffer는 “계산에 필요한 숫자 묶음”이다.

---



## HLSL에서의 Constant Buffer
HLSL에서는 `cbuffer` 키워드로 정의한다.

```hlsl
cbuffer TransformCB : register(b0)
{
    float4x4 world;
    float4x4 view;
    float4x4 proj;
};
```

여기서 중요한 점은 두 가지다.

- register(b0)는 슬롯 번호
- 레이아웃은 16바이트 정렬 규칙을 따른다

GPU는 Constant Buffer를 **16바이트 단위로 읽는다**.  
이 규칙을 어기면 CPU와 GPU 사이에서 데이터가 어긋난다.

---



## C++에서의 Constant Buffer 구조체
HLSL 구조와 **완전히 동일한 메모리 레이아웃**을 유지해야 한다.

```cpp
struct TransformCB
{
    DirectX::XMFLOAT4X4 world;
    DirectX::XMFLOAT4X4 view;
    DirectX::XMFLOAT4X4 proj;
};
```

주의할 점

- bool 사용 금지 (HLSL bool은 4바이트)
- float3는 반드시 padding 고려
- 구조체 크기는 16의 배수

---



## Constant Buffer 생성
```cpp
D3D11_BUFFER_DESC desc = {};
desc.BindFlags = D3D11_BIND_CONSTANT_BUFFER;
desc.ByteWidth = sizeof(TransformCB);
desc.Usage = D3D11_USAGE_DYNAMIC;
desc.CPUAccessFlags = D3D11_CPU_ACCESS_WRITE;

ID3D11Buffer* transformCB = nullptr;
device->CreateBuffer(&desc, nullptr, &transformCB);
```

여기서 선택의 기준은 명확하다.

- 자주 갱신 → DYNAMIC + Map
- 거의 안 바뀜 → DEFAULT + UpdateSubresource

---



## 값 갱신 방식
가장 일반적인 방식은 `Map / Unmap`이다.

```cpp
D3D11_MAPPED_SUBRESOURCE mapped;
context->Map(transformCB, 0, D3D11_MAP_WRITE_DISCARD, 0, &mapped);
memcpy(mapped.pData, &data, sizeof(TransformCB));
context->Unmap(transformCB, 0);
```

WRITE_DISCARD는 “이전 내용은 버리고 새로 쓴다”는 의미다.  
GPU 파이프라인 스톨을 피하기 위한 선택이다.

---



## 셰이더에 바인딩
```cpp
context->VSSetConstantBuffers(0, 1, &transformCB);
context->PSSetConstantBuffers(0, 1, &transformCB);
```

여기서 0은 register(b0)와 대응된다.  
같은 Constant Buffer를 여러 셰이더 단계에서 공유할 수도 있다.

---



## 설계 관점에서의 팁
실무에서 Constant Buffer는 보통 다음처럼 나눈다.

- PerFrameCB  
    시간, 카메라, 조명
- PerObjectCB  
    월드 행렬, 머티리얼
- PerPassCB  
    그림자 패스, 포스트 프로세스용 데이터

*한 버퍼에 다 넣기*보다 **변경 주기 기준으로 분리**하는 것이 중요하다.

---



## 흔한 실수들
- HLSL과 C++ 구조체 불일치
- float3 padding 미고려
- ByteWidth가 16의 배수가 아님
- 동일 리소스를 동시에 읽기/쓰기
- 상수 버퍼를 너무 자주 생성/해제


---



## 정리
Constant Buffer는 단순한 데이터 전달 수단이 아니다.  
셰이더 설계, 렌더링 구조, 업데이트 전략이 모두 만나는 지점이다.

- 셰이더는 Constant Buffer를 통해 외부 세계를 인식하고
- CPU는 Constant Buffer를 통해 GPU 계산을 제어한다

Direct3D 11을 이해한다는 것은 결국  
**Constant Buffer를 어떻게 설계하고 관리하느냐를 이해하는 것**에 가깝다.
