---
layout  : wiki
title   : 빔 설정 확인
summary : 빔 설정 확인하기
date    : 2024-09-13 16:28:26 +0900
updated : 2024-09-14 11:56:04 +0900
tag     : 
toc     : true
public  : true
parent  : [[/vim]]
latex   : false
resource: C40F4BE8-EFE1-4D22-AD84-6E1F86B37841
---
* TOC
{:toc}

### set ?

`:set {option}?<CR>`

```
:set conceallevel?<CR>
    conceallevel=0
```

### echo &

`:echo &{option}<CR>`

```
:echo &conceallevel<CR>

    0
```
