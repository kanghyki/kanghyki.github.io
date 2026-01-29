---
title: C++ using vs typedef
summary:
tags:
date: 2026-01-28 19:19:35 +09:00
updated: 2026-01-28 19:23:11 +09:00
doc_type: reference
---
```cpp
class Aclass {};

typedef AClass A;
// or
using A = Aclass;
```
기능상 차이는 비슷하지만 `using`은 템플릿 문법에 사용가능하다.
```
template<class T>
using V = std::vector<T>;
```