---
layout  : wiki
title   : 그래프
summary : 그래프 자료구조
date    : 2024-09-16 11:12:04 +0900
updated : 2024-09-16 13:07:35 +0900
tag     : graph
toc     : true
public  : true
parent  : [[/algorithm]]
latex   : false
resource: D687C74E-1433-4E2C-83F8-A834C2BFD7F2
---
* TOC
{:toc}

## 그래프

정점(Vertex)와 간선(Edge)로 이루어진 자료구조를 의미한다.

## 표현

그래프의 표현은 인접 리스트와 인접 행렬으로 한다.

### 인접 리스트

만약 a, b, c 정점이 존재할 때,

```
a ->(2) b
b ->(5) c
```

으로 연결되어 있다면

```
a -> {2, b}
b -> {5, c}
```

로 표현한다.

### 인접 행렬

동일하게 a, b, c 정점이 존재할 때,

```
a ->(2) b
b ->(5) c
```

으로 연결되어 있다면

```
|   | a   | b   | c   |
|---|-----|-----|-----|
| a | 0   | 2   | INF |
| b | INF | 0   | 5   |
| c | INF | INF | 0   |
```

로 표현한다.
