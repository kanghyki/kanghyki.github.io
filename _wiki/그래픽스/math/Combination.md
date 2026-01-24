---
title: 결합
summary:
tags:
date: 2026-01-23 20:58:18 +0900
updated: 2026-01-23 20:58:18 +0900
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
\sum_i \alpha_i x_i,\quad \sum_i \alpha_i = 1
$$

- 가중치 합이 1
- 원점과 무관, 점의 상대적 위치만 중요
- 선, 평면 위의 점을 자유롭게 표현

---

### Convex combination

$$
\sum\limits_{i=0}^n \alpha_i x_i,\quad (s.t. \; \sum\limits_{i=0}^n \alpha_i = 1,\quad 0 \le \alpha_i \le 1)
$$

![Image](https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Convex_combination_illustration.svg/250px-Convex_combination_illustration.svg.png)

- affine combination + 음수 금지
- 결과는 항상 **점들이 만든 영역 내부**
- 외삽 불가, 보간만 가능

핵심 그림 해석

- 삼각형이면 항상 내부
- 선분이면 항상 두 점 사이

---

### 요약

- Linear: 원점에서 벡터를 늘렸다 줄였다
- Affine: 점들을 기준으로 위치를 섞는다
- Convex: 점들 사이에서만 안전하게 섞는다

그래픽스 기준으로 보면

- 방향, 속도 -> linear
- 위치 보간, transform -> affine
- 바리센트릭 좌표, 픽셀 보간 -> convex

## Refernce

- https://en.wikipedia.org/wiki/Linear_combination
- https://en.wikipedia.org/wiki/Affine_combination
- https://en.wikipedia.org/wiki/Convex_combination

## 1. Linear combination — 원점이 모든 것의 기준

![Image](https://upload.wikimedia.org/wikipedia/commons/6/6f/Linjcomb.png)

기하적으로 linear combination은 **벡터**를 다룬다.

- 모든 벡터는 **원점에서 시작하는 화살표**
- 계산 결과도 항상 "원점 기준 화살표"

두 벡터 $$(v_1, v_2) $$가 있을 때

$$
\alpha v_1 + \beta v_2
$$

이건

- 화살표를 늘리거나 줄이고
- 더해서 새로운 화살표를 만드는 것

중요한 점

- 원점을 옮기면 같은 계산이라도 **공간에서 의미가 깨짐**
- 그래서 linear combination은 **점**이 아니라 **방향 + 크기**의 개념

요약

- "이 공간의 원점은 여기다"가 먼저 정해져야 함

---

## 2. Affine combination — 원점을 지워버린 기하

이제 원점을 없앤다.
대신 **점과 점의 관계**만 남긴다.

$$
\sum_i \alpha_i x_i,\quad \sum_i \alpha_i = 1
$$

기하적으로 이 조건의 의미는

- 전체를 더해도 **쓸데없는 원점 성분이 남지 않게 만든다**

두 점 (A, B)를 보자.

$$
(1-t)A + tB
$$

이 식은 사실

- “A에서 B로 얼마나 이동했는가”만 표현
- 공간 전체를 어디로 옮겨도 결과는 동일

기하적 결과

- 두 점 → **직선**
- 세 점 → **평면**
- 원점 없이도 선과 면이 정의됨

요약

- affine combination은 **점의 기하**
- "어디에 있느냐"보다 "서로 어떻게 배치돼 있느냐"

---

## 3. convex combination — 영역 내부만 허용

![Image](https://upload.wikimedia.org/wikipedia/commons/c/c4/Convex_combination_illustration.svg)

여기서 한 제약이 더 붙는다.

$$
\sum_i \alpha_i = 1,\quad \alpha_i \ge 0
$$

기하적 의미

- 어떤 점도 "반대 방향으로 잡아당기지 못함"
- 결과는 항상 **점들이 만든 도형 내부**

두 점

- 선분 내부만 가능

세 점

- 삼각형 내부만 가능

이게 바로 **볼록 껍질(convex hull)**

그래픽스에서 바리센트릭 좌표가
삼각형 밖으로 안 나가는 이유가 이 조건 때문이다.

요약

- convex combination = "밖으로 튀는 걸 금지한 affine"

---

## 기하적 차이

- Linear
    - 기준: 원점
    - 대상: 벡터
    - 결과: 방향과 크기

- Affine
    - 기준: 없음
    - 대상: 점
    - 결과: 직선·평면 위의 위치

- Convex
    - 기준: 없음
    - 대상: 점
    - 결과: 도형 내부 위치만

---

## 직관

- Linear: 원점에서 화살표를 조합
- Affine: 점들 사이의 위치를 표현
- Convex: 그중에서도 "안쪽"만 허용
