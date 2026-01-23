---
title: 더블 버퍼링
summary:
tags:
---

### Reference

- https://docs.oracle.com/javase/tutorial/extra/fullscreen/doublebuf.html

### 더블 버퍼링이란

![dobule-buffering](https://docs.oracle.com/javase/tutorial/figures/extra/fullscreen/doubleBuffering.gif)

더블 버퍼링은 화면에 바로 그리지 않고, **보이지 않는 버퍼에서 한 프레임을 완성한 뒤 한 번에 화면에 보여주는 방식**이다.

이렇게 하면 그리는 중간 과정이 사용자에게 노출되지 않는다.

### 왜 필요한가

화면에 직접 그리면 프레임이 완성되기 전에 일부만 갱신되어
깜박임이나 찢어진 화면이 보일 수 있다.
더블 버퍼링은 이 문제를 해결한다. (화면을 안정적으로 만든다.)

### 동작 흐름

1. 백 버퍼에서 다음 프레임을 렌더링한다
2. 프레임이 완성되면 프런트 버퍼와 교체한다
3. 교체된 프런트 버퍼가 화면에 표시된다

렌더링은 항상 보이지 않는 버퍼에서만 일어난다.

### 풀스크린과 화면 메모리 접근

![page flipping](https://docs.oracle.com/javase/tutorial/figures/extra/fullscreen/pageFlipping.gif)

일반적으로 화면에 표시되는 **primary surface** 는
컴포넌트가 가진 그래픽 객체를 통해 간접적으로 조작된다.
이 과정에는 윈도우 시스템의 합성, 메시지 처리 등의 오버헤드가 개입한다.

하지만 **전체화면(full-screen exclusive mode)** 에서는 상황이 달라지는데,
이 모드에서는 전체 화면 윈도우의 그래픽 작업이 곧바로 **화면 메모리 자체를 직접 조작하는 것**이 된다.

### 페이지 플리핑

이 때 사용할 수 있는 기법이 **페이지 플리핑(page flipping)** 이다.

페이지 플리핑은 더블 버퍼링의 한 형태로,
백 버퍼의 내용을 화면 버퍼로 복사하지 않고
그래픽 카드가 참조하는 **비디오 메모리 주소를 교체**한다.

이 방식은

- 픽셀 데이터 복사가 없고
- 포인터 하나만 변경하면 되며
- 프레임 교체 비용이 매우 작다

### 핵심 포인트

- 그리기와 보여주기를 분리한다
- 화면에는 항상 완성된 프레임만 표시된다
- 깜박임과 중간 상태 노출이 사라진다
- 페이지 플리핑은 버퍼 복사 대신 참조 전환으로 이를 구현한다

> If your performance metric is simply the speed at which double-buffering or page-flipping occurs versus direct rendering, you may be disappointed. You may find that your numbers for direct rendering far exceed those for double-buffering and that those numbers far exceed those for page-flipping. Each of these techniques is for used for improving *perceived performance*, which is much more important in graphical applications than *numerical performance*.
>
> 그래픽 어플리케이션에서는 수치적 성능보다 체감 성능이 더 중요하다.
