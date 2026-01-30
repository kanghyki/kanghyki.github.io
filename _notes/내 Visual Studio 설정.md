---
title: 내 Visual Studio 설정
summary:
tags:
date: 2026-01-29 18:41:12 +09:00
updated: 2026-01-30 15:04:14 +09:00
doc_type: capture
---
### 테마
![[Pasted image 20260129184150.png]]

dracula

### Text Editor
![[Pasted image 20260129184122.png]]
- Line spacing : 1.15

### VsVim
![[Pasted image 20260129184402.png]]
vsvim 확장을 사용하면 `VsVim-Defaults`에서 caret을 변경할 수 있음

### .vimrc
2026-01-29 기준 사용중인 `.vimrc`
```
let mapleader=","
let maplocalleader="\\"

set scrolloff=5
set number
set incsearch
set hlsearch
set ignorecase
set smartcase
set clipboard=unnamed

inoremap jk <Esc>
nnoremap <BS><BS> <C-^>
nnoremap <leader><space> :nohlsearch<CR>

" Go to Implementation
nnoremap gi :vsc Edit.GoToImplementation<CR>

" Go to Definition
nnoremap gd :vsc Edit.GoToDefinition<CR>

" Go to Type Definition
nnoremap gt :vsc Edit.GoToTypeDefinition<CR>

" Find Usages
nnoremap gr :vsc Edit.FindAllReferences<CR>

" Quick Doc
nnoremap gh :vsc Edit.QuickInfo<CR>

" Search Everywhere
nnoremap <leader>ff :vsc Edit.NavigateTo<CR>

" Find in Path
nnoremap <leader>fg :vsc Edit.FindinFiles<CR>

" 버퍼/탭 이동
nnoremap <leader>q :vsc Window.PreviousDocumentWindow<CR>
nnoremap <leader>w :vsc Window.NextDocumentWindow<CR>

" 버퍼 닫기
nnoremap <leader>bd :vsc File.Close<CR>
```