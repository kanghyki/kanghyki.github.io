---
title: DX Graphic Pipeline
summary: DirectX의 그래픽스 파이프라인
tags:
---

https://learn.microsoft.com/en-us/windows/win32/direct3d11/overviews-direct3d-11-graphics-pipeline

프로그래밍 가능한 파이프라인인 Direct3D 11는 실시간 게임 어플리케이션용 그래픽을 생성하도록 설계되었다.

다음은 각각의 프로그래밍 가능한 스테이지를 통해 입력에서부터 출력으로의 데이터 플로우를 보여준다 .

![[assets/Pasted image 20260122082930.jpg]]

> 아래 스테이지들에서 사용하는 Create, Set 함수들은 그래픽스 파이프라인의 옵션들을 만들고 설정하는 것 뿐,
> 실제로 이 옵션들을 사용해 그래픽스 파이프라인의 흐름대로 렌더링하는건 DrawIndexed() 함수가 호출된 이후다.

1. [[Input Assembler stage]]
2. [[Vertex Shader stage]]
3. [[Hull Shader stage]]
4. [[Tessellator Stage]]
5. [[Geometry Shader stage]]
6. [[Domain Shader stage]]
7. [[Stream Output stage]]
8. [[Rasterizer stage]]
9. [[Pixel Shader stage]]
10. [[Output Merger stage]]
