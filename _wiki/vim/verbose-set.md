---
layout  : wiki
title   : verbose set
summary : 마지막으로 설정이 세팅된 위치를 파악하기
date    : 2024-09-13 16:24:37 +0900
updated : 2024-09-14 11:56:01 +0900
tag     : vim
toc     : true
public  : true
parent  : [[/vim]]
latex   : false
resource: 74F9B097-DFFC-400A-843D-A972FAD01657
---
* TOC
{:toc}

## 설명
`:verbose set {option}<CR>`

마지막으로 설정이 세팅된 위치를 알려준다.

## 예시
```
:verbose set conceallevel<CR>

  conceallevel=0
        Last set from ~/.local/share/nvim/plugged/vimwiki/plugin/vimwiki.vim line 200
```
