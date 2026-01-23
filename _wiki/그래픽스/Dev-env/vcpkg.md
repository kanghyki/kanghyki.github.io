---
title: vcpkg with Visual Studio
summary:
tag:
---

# vcpkg ?

> vcpkg is a free and open-source C/C++ package manager maintained by Microsoft and the C++ community.

 vcpkg는 마이크로소프트와 C++커뮤니티에 의해 유지되는 오픈소스 C/C++ 패키지 매니저입니다.
 
https://github.com/microsoft/vcpkg

위 링크로 들어가보면 여러 시스템이랑 IDE를 지원하는걸 알 수 있습니다.

![[Pasted image 20260123152312.png]]

visual studio와 함께 사용하기 위해선 **vcpkg with Visual Studio** 링크와 함께 설치하면 된다.

# 트러블 슈팅

## ignoring mismatched VCPKG_ROOT environment value

```
warning: The vcpkg - is using detected vcpkg root - and ignoring mismatched VCPKG_ROOT environment value C:\Program Files\Microsoft Visual Studio\2022\Community\VC\vcpkg. To suppress this message, unset the environment variable or use the --vcpkg-root command line switch.
```

`VCPKG_ROOT` 환경변수가 설정되지 않아서 실행하는 vcpkg 경로와 `VCPKG_ROOT` 경로가 달라져서 생기는 오류

아래 명령어를 통해 터미널 세션에서 임시적으로 해결할 수 있습니다.
```sh
$env:VCPKG_ROOT="C:\여기에\설치한\vcpkg\경로를\적으세요"
$env:PATH="$env:VCPKG_ROOT;$env:PATH"
```

영구적으로 해결하고 싶다면 환경변수에 PATH와 VCPKG_ROOT에 설치한 vcpkg 경로를 추가하세요.
![[Pasted image 20260123153758.png]]

![[Pasted image 20260123153610.png]]