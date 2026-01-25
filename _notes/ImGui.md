---
title: ImGui
summary: Immediate Mode Graphical User Interface
tags:
  - Library
date: 2026-01-23 15:12:25 +0900
updated: 2026-01-24 06:24:38 +0900
doc_type: reference
---

## ImGui란

[GitHub - ocornut/imgui: Dear ImGui: Bloat-free Graphical User interface for C++ with minimal dependencies](https://github.com/ocornut/imgui)

ImGui는 C++용 GUI 라이브러리입니다.

OpenGL, DirectX, Metal, Vulkan 등의 Graphics API를 이용해 GUI 컴포넌트를 직접 그리는 기능을 제공합니다.

## ImGui의 특징

**ImGUI는** 이벤트 방식으로 로직을 처리하는 것이 아니라 아래 코드와 같이 이벤트가 발생하면 즉시 코드를 실행시키는 방식으로 동작한다.

```cpp
if (ImGui::Begin("ImGui"))
{
    if (ImGui::Checkbox("WireFrame", &mIsActiveWireFrame))
    {
        if (mIsActiveWireFrame)
        {
            glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
        }
        else
        {
            glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
        }
    }
}
ImGui::End();
```

이런 방식은 쉽고 빠르게 코드를 작성할 수 있지만 필연적으로 GUI 코드와 렌더링 코드가 분리되지 않기 때문에 큰 규모의 GUI를 만들 때는 적합하지 않을 수 있다.

**ImGui는** Rendering backend가 분리되어 있어 사용하는 ImGui가 지원하는 Graphics API라면 해당 Graphics API와 함께 사용할 수 있다.![[Untitled.png]]

다양한 Graphics API를 지원한다.

## ImGui 설정하기

<aside>
💡 2026년 1월 23일 기준으로 v1.92.5 버전까지 릴리즈 됐습니다.
</aside>

1. ImGui Tags탭에서 원하는 버전을 찾아 다운로드합니다.

![[Pasted image 20260123150929.png]]

2. ImGui 소스코드를 프로젝트 내부에 옮겨줍니다. (필자는 프로젝트 루트 디렉토리에 ImGui 폴더를 만들어 옮겨줬습니다.)
   ![[Untitled 3.png]]
   복사할 소스코드 & 라이선스

3. 사용할 Graphics API에 맞춰 imgui 구현체도 옮겨줍니다. (이 글에서는 OpenGL3 구현체와 glfw 구현체를 사용합니다.)
   ![[Untitled 4.png]]
   Rendering Backend

4. 사용하는 환경에 맞게 ImGui 파일을 빌드하고 링킹해서 사용합니다.

CMake를 사용하는 예시는 아래 링크에서 볼 수 있습니다.

[OpenGL course 07-03: ImGui](https://youtu.be/3EiXfyHv124?si=Hp9wU0_j2pYoq3iq&t=1205)

## ImGui 사용하기 (예시)

```cpp
#include <imgui_impl_glfw.h>
#include <imgui_impl_opengl3.h>
{
	// OpenGL_Context_초기화();

	/* OpenGL Context 초기화 후 ImGui 초기화 */
	auto imguiContext = ImGui::CreateContext();
	ImGui::SetCurrentContext(imguiContext);
	ImGui_ImplGlfw_InitForOpenGL(window, false);
	ImGui_ImplOpenGL3_Init();
	ImGui_ImplOpenGL3_CreateFontsTexture();
	ImGui_ImplOpenGL3_CreateDeviceObjects();

	while (rendering loop) {
	/* 매 프레임마다 새로운 프레임을 만듦 */
	ImGui_ImplGlfw_NewFrame();
    ImGui::NewFrame();

    rendering_code();

    /* ImGui 렌더링 */
    ImGui::Render();
    ImGui_ImplOpenGL3_RenderDrawData(ImGui::GetDrawData());

    // glfwSwapBuffers(window);
    // glfwPollEvents();
	}

	/* 종료 전 자원 회수 */
	ImGui_ImplOpenGL3_DestroyFontsTexture();
	ImGui_ImplOpenGL3_DestroyDeviceObjects();
	ImGui_ImplOpenGL3_Shutdown();
	ImGui_ImplGlfw_Shutdown();
	ImGui::DestroyContext(imguiContext);

	// do_something_before_end();

	return 0;
}
```

아래 코드는 위 코드의 `rendering_code()` 함수의 내부 모습이다.

```cpp
#include <imgui.h>

{
	if (ImGui::Begin("Hello, ImGui"))
	{
    ImGui::Text("Hello, text");
    if (ImGui::Checkbox("WireFrame", &mIsActiveWireFrame))
    {
      if (mIsActiveWireFrame)
      {
        glPolygonMode(GL_FRONT_AND_BACK, GL_LINE);
      }
      else
      {
        glPolygonMode(GL_FRONT_AND_BACK, GL_FILL);
      }
    }
	}
	ImGui::End();

	do_something_for_render();
	// ...
}
```

## imgui.h

![[Untitled 5.png]]

imgui.h

imgui.h에는 제공하는 기능에 대한 설명이 꽤나 자세하게 적혀있어 참고할 때 유용하게 사용할 수 있다.

### Reference

[GitHub - ocornut/imgui: Dear ImGui: Bloat-free Graphical User interface for C++ with minimal dependencies](https://github.com/ocornut/imgui)
