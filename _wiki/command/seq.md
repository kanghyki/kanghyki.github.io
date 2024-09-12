---
layout  : wiki
title   : seq
summary : 수열을 출력한다.
date    : 2024-09-12 17:20:18 +0900
updated : 2024-09-13 00:31:44 +0900
tag     : bash command
toc     : true
public  : false
parent  : 
latex   : false
resource: 16905A4D-4CEA-4F50-BD20-E034BC78410D
---
* TOC
{:toc}

# 기본
```bash
$ seq 0 5
0
1
2
3
4
5
```

## bash for

```bash
$ for i in $(seq 0 5); do echo "? : ${i}"; done
? : 0
? : 1
? : 2
? : 3
? : 4
? : 5
```

> asdasd
