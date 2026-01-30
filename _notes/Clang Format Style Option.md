---
title: Clang Format Style Option
summary:
tags:
date: 2026-01-30 18:47:48 +09:00
updated: 2026-01-30 18:49:18 +09:00
doc_type: capture
---
## Link
https://clang.llvm.org/docs/ClangFormatStyleOptions.html

내 `.clang-format`
```
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
BreakBeforeBraces: Allman
AllowShortBlocksOnASingleLine: Empty
AllowShortIfStatementsOnASingleLine: Never
AllowShortLoopsOnASingleLine: false
InsertBraces: true

# ===== Function =====
AllowShortFunctionsOnASingleLine: None
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