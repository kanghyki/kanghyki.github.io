---
title: Visual Studio format on save
summary:
tags:
  - IDE
date: 2026-01-29 14:40:46 +09:00
updated: 2026-01-29 16:04:56 +09:00
doc_type: reference
---
프로젝트 루트에 `.clang-format` 파일을 추가한다.

- `ClangFormat` 지원 사용 체크

![[Pasted image 20260129144239.png]]

- `저장 시 코드 정리 프로필 실행` 체크
- `코드 정리 구성`으로 들어간다.

![[Pasted image 20260129144208.png]]

- `문서 서식(C++)`를 추가한다.

![[Pasted image 20260129144408.png]]


- 단축키로 포매팅하고 싶으면 `환경-키보드`에서 `편집.문서서식` 단축키를 지정하면 된다.

![[Pasted image 20260129144819.png]]

- 내가 자주 쓰는 `.clang-format`
```cpp
# ===== Base =====
BasedOnStyle: LLVM
Language: Cpp

# ===== Indentation =====
IndentWidth: 4
TabWidth: 4
UseTab: Never

# ===== Line Length =====
ColumnLimit: 100

# ===== Braces =====
BreakBeforeBraces: Stroustrup
AllowShortBlocksOnASingleLine: Empty
AllowShortIfStatementsOnASingleLine: Never
AllowShortLoopsOnASingleLine: false

# ===== Function =====
AlwaysBreakAfterReturnType: None
AlwaysBreakAfterDefinitionReturnType: None

# ===== Alignment =====
AlignAfterOpenBracket: Align
AlignOperands: true
AlignTrailingComments: true
AlignConsecutiveAssignments: false
AlignConsecutiveDeclarations: false

# ===== Pointer / Reference =====
PointerAlignment: Left
ReferenceAlignment: Pointer

# ===== Spaces =====
SpaceBeforeParens: ControlStatements
SpaceInEmptyParentheses: false
SpacesInParentheses: false
SpacesInSquareBrackets: false

# ===== Includes =====
SortIncludes: true
IncludeBlocks: Regroup

# ===== Misc =====
KeepEmptyLinesAtTheStartOfBlocks: false
MaxEmptyLinesToKeep: 2
Cpp11BracedListStyle: true
DeriveLineEnding: true
DerivePointerAlignment: false===== Base =====
BasedOnStyle: LLVM
Language: Cpp

# ===== Indentation =====
IndentWidth: 4
TabWidth: 4
UseTab: Never

# ===== Line Length =====
ColumnLimit: 100

# ===== Braces =====
BreakBeforeBraces: Stroustrup
AllowShortBlocksOnASingleLine: Empty
AllowShortIfStatementsOnASingleLine: Never
AllowShortLoopsOnASingleLine: false

# ===== Function =====
AlwaysBreakAfterReturnType: None
AlwaysBreakAfterDefinitionReturnType: None

# ===== Alignment =====
AlignAfterOpenBracket: Align
AlignOperands: true
AlignTrailingComments: true
AlignConsecutiveAssignments: false
AlignConsecutiveDeclarations: false

# ===== Pointer / Reference =====
PointerAlignment: Left
ReferenceAlignment: Pointer

# ===== Spaces =====
SpaceBeforeParens: ControlStatements
SpaceInEmptyParentheses: false
SpacesInParentheses: false
SpacesInSquareBrackets: false

# ===== Includes =====
SortIncludes: true
IncludeBlocks: Regroup

# ===== Misc =====
KeepEmptyLinesAtTheStartOfBlocks: false
MaxEmptyLinesToKeep: 2
Cpp11BracedListStyle: true
DeriveLineEnding: true
DerivePointerAlignment: false
```
