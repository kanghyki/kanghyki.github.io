---
title: D3D Device란 무엇인가
summary: D3D Device에 대해 알아보자
tags:
---

## Device란 무엇인가

**Direct3D 11에서 Device는 GPU 자체를 대표하는 객체**다.

역할은 다음으로 한정됩니다.

- GPU와의 연결 창구
- GPU 리소스 생성
    - 셰이더
    - 버퍼
    - 텍스처
    - 입력 레이아웃 등

중요한 점:

- Device는 **상태를 기억하지 않는다**
- Device는 **렌더링을 수행하지 않는다**
- “무엇을 그릴지”가 아니라 **“그릴 재료를 만드는 공장”**에 가깝다

예시:

```cpp
ID3D11VertexShader* vs;
device->CreateVertexShader(..., &vs);
```

여기서 만들어진 `vs`는 **GPU 리소스**이지, 아직 어디에도 바인딩되지 않았다.

---

## DeviceContext란 무엇인가

**DeviceContext는 GPU에 명령을 기록하고 실행하는 객체**다.

- 파이프라인 상태를 설정
- Draw 호출을 발행
- 실제 렌더링 흐름을 관리

`VSSetShader`는 정확히 이 역할에 해당한다.

```cpp
deviceContext->VSSetShader(vs, nullptr, 0);
```

의미:

> "현재 파이프라인의 Vertex Shader 자리에 이 셰이더를 쓰겠다"

여기서 중요한 점:

- 컨텍스트는 **현재 상태(state)** 를 가진다
- 셰이더, 버퍼, 텍스처 바인딩은 모두 컨텍스트의 상태
- Draw 호출은 **컨텍스트에 누적된 상태를 기준으로 실행**

## 핵심 요약

- Device
    - GPU를 대표
    - 리소스 생성 전용
    - 상태 없음

- DeviceContext
    - GPU 명령 실행자
    - 파이프라인 상태 보유
    - Draw 호출 담당
