---
title: 결합
summary:
tags:
  - 선형대수
date: 26-01-23 20:58:18 +09:00
updated: 26-01-25 07:38:04 +09:00
---

### Linear combination

$$
\sum\limits_{i=0}^n \alpha_i x_i
$$

![Image](https://upload.wikimedia.org/wikipedia/commons/6/6f/Linjcomb.png)

- 가중치 합 제약 없음
- 항상 원점을 기준으로 동작
- 결과는 벡터 공간 전체로 퍼질 수 있음

핵심 그림 해석

- 모든 화살표가 원점에서 시작
- 원점을 옮기면 같은 계산이라도 의미가 달라짐

---

### Affine combination

$$
\sum\limits_{i=0}^n \alpha_i x_i,\quad \sum\limits_{i=0}^n \alpha_i = 1
$$

- 가중치 합이 1
- 원점과 무관, 점의 상대적 위치만 중요
- 선, 평면 위의 점을 자유롭게 표현

세 점을 결합하는 경우 아래 식으로 표현할 수 있고
$$
P' = s \cdot P_1 + t \cdot P_2 + (1-s-t) \cdot P_3
$$
정리하면
$$
(P' - P_3) = s(P_1 - P_3) + t(P_2 - P_3)
$$
괄호를 벡터로 바꿔서보면
$$
\vec{w} = s \cdot \vec{u} + t \cdot \vec{v}
$$
로 나타낼 수 있다.
$$ \vec{u}, \vec{v} $$
두 벡터가 서로 선형 독립관계라면 2차원 벡터 공간의 모든 벡터를 생성할 수 있다.

---

### Convex combination

$$
\sum\limits_{i=0}^n \alpha_i x_i,\quad (s.t. \; \sum\limits_{i=0}^n \alpha_i = 1,\quad 0 \le \alpha_i \le 1)
$$

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Convex_combination_illustration.svg/250px-Convex_combination_illustration.svg.png)

이 때
$$
s, t
$$
의 값을 `[0, 1]`로 제한하면 삼각형 영역이 된다.

- affine combination이면서+ 음수 금지
- 결과는 항상 **점들이 만든 영역 내부**
	- 삼각형이면 항상 내부
	- 선분이면 항상 두 점 사이
- 외삽 불가, 보간만 가능

---
### 요약

- Linear: 원점에서 벡터를 늘렸다 줄였다
- Affine: 점들을 기준으로 위치를 섞는다
- Convex: 점들 사이에서만 안전하게 섞는다

그래픽스 기준으로 보면

- 방향, 속도 -> linear
- 위치 보간, transform -> affine
- 바리센트릭 좌표, 픽셀 보간 -> convex
