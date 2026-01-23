---
title: 프레임 버퍼
summary:
tag:
---


# 프레임 버퍼

## 프레임 버퍼란 무엇인가?
컬러 버퍼, 깊이 버퍼, 스텐실 버퍼 등의 조합을 GPU 메모리 상에 저장하고 이를 프레임 버퍼라고 부른다.

기본적으로 OpenGL을 이용해 렌더링 작업을 하면 기본 프레임 버퍼(Default framebuffer) 위에서 수행된다.

간단하게 도화지라고 생각하면 좋을 것 같다.


## 왜 사용하는가?
프레임 버퍼를 사용하면 추가적으로 렌더링할 타겟을 얻을 수 있다.

이를 이용해 거울과 같은 시각효과나 후처리, Deffered shading 등..  다양한 효과를 적용할 수 있다.


## 프레임 버퍼 만들기
프레임 버퍼는 OpenGL에서 다른 버퍼를 만드는 것과 유사한 방법으로 만들 수 있다.

```cpp
unsigned int fbo;
glGenFramebuffers(1, &fbo);
```

그런 다음 프레임 버퍼를 바인딩 해준다.

```cpp
glBindFramebuffer(GL_FRAMEBUFFER, fbo);
```

바인딩할 때 사용하는 파라미터는

- GL_READ_FRAMEBUFFER (읽기)
- GL_DRAW_FRAMEBUFFER (쓰기)
- GL_FRAMEBUFFER (둘 다)

가 있지만 많은 경우에 읽기와 쓰기를 구분하지 않고 사용하기 때문에 `GL_FRAMEBUFFER`를 사용해 읽기와 쓰기를 모두 바인딩한다.

이렇게 만들고 바로 사용하면 좋겠지만 아직 이 프레임 버퍼는 완전하지 않다.

프레임 버퍼를 완전하게 만들기 위해서는 아래의 조건을 만족해야 한다.

- 적용할 하나 이상의 버퍼(컬러, 깊이, 스텐실 버퍼 등)
- 하나 이상의 메모리가 할당된 Color attachment
- 각 버퍼에 동일한 수의 샘플
    - 샘플에 대한 이야기는 [이곳](https://learnopengl.com/Advanced-OpenGL/Anti-Aliasing)에서 확인할 수 있다.

만약 사용하기 위한 조건을 만족했다면 `glCheckFramebufferStatus()` 함수를 통해 프레임 버퍼가 성공적으로 만들어졌는지 확인할 수 있다.

`GL_FRAMEBUFFER_COMPLETE`를 확인했다면 렌더링을 진행하면 된다!

```cpp
if(glCheckFramebufferStatus(GL_FRAMEBUFFER) == GL_FRAMEBUFFER_COMPLETE) {
	// go to render
}
```

이제 이어지는 모든 렌더링 작업은 현재 바인딩된 프레임 버퍼에 적용된다.

### 다시 기본 프레임 버퍼를 할당하기
방금 만든 프레임 버퍼는 기본 프레임 버퍼가 아니기 때문에, 

프레임 버퍼를 만들고 난 이후의 렌더링 작업은 실제로 출력에 영향을 미치지 않는다.

이런 이유로 다른 프레임 버퍼에 렌더링을 할 때 이를 off-screen rendering이라고 한다.

따라서 다시 렌더링 작업을 메인 윈도우에 표시하고 싶다면 기본 프레임 버퍼(0번)를 활성화 시키면 된다.

```cpp
glBindFramebuffer(GL_FRAMEBUFFER, 0);
```

예를들어 아래와 같은 렌더링 로직이 있다고 가정해보자

```cpp
...
rendering_ImGuI(); // ImGui를 기본 프레임 버퍼에 렌더링하고

bindFramebuffer(my_own); // 만든 프레임 버퍼 바인딩

rendering_my_object(); // 오브젝트 그리고

bindFramebuffer(default); // 다시 기본 프레임 버퍼 바인딩
...
```

결과는 아래와 같다.

![[Untitled 2.png]]


오브젝트가 안보이는 모습

메인 윈도우에 렌더링한 작업이 보이지 않는다.

(그 렌더링 작업은 만들었던 프레임 버퍼에 적용됐다.)

> 우측하단 렌더링된 작은 화면은 만들었던 프레임 버퍼의 결과를 이미지로 가져와 ImGui에 표시한 것이다.


### 프레임 버퍼 지우기
프레임 버퍼를 모두 사용했다면 잊지말고 지워준다.

```cpp
glDeleteFramebuffers(1, &fbo);  
```


## 텍스처 할당하기
프레임 버퍼를 텍스처에 할당하면 모든 렌더링 명령이 일반 색상, 깊이, 스텐실 버퍼처럼 기록된다.

텍스처를 이용했을 때 이점은 렌더링 출력이 텍스처 내부 이미지에 저장되어서 셰이더에서 쉽게 사용할 수 있다는 점이다!

### 텍스처 만들기
일반적으로 텍스처를 만드는 것과 다른 점은

1. 텍스처의 크기가 스크린의 크기와 같다는 점이고
2. `glTexImage2D()` 함수의 마지막 파라미터에 `*NULL*`을 전달한다는 것이다.

```cpp
unsigned int texture;
glGenTextures(1, &texture);
glBindTexture(GL_TEXTURE_2D, texture);
  
glTexImage2D(GL_TEXTURE_2D, 0, GL_RGB, 800, 600, 0, GL_RGB, GL_UNSIGNED_BYTE, NULL);

glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, GL_LINEAR);
glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, GL_LINEAR); 
```

메모리만 할당받고 실제로 메모리 안을 채우지 않는 이유는

프레임 버퍼에 렌더링을 하면 텍스처가 채워질 것이기 때문이다.

또한 *Mipmapping*이나 *Wrapping*은 대부분의 경우 신경쓰지 않아도 된다.

(대부분 스크린 크기와 같기 때문에)

이제 만든 텍스처를 프레임 버퍼에 할당해보자

```cpp
glFramebufferTexture2D(GL_FRAMEBUFFER, GL_COLOR_ATTACHMENT0, GL_TEXTURE_2D, texture, 0); 
```

`glFramebufferTexture2D()` 함수의 파라미터는 다음과 같다.

- 프레임버퍼의 타입
- 할당하고자 하는 것의 타입 (여기서는 컬러버퍼0)
- 텍스처의 타입
- 텍스처 ID
- 밉맵 레벨

깊이 버퍼와 스텐실 버퍼도 텍스처를 만들고 할당하거나

깊이 버퍼와 스텐실 버퍼는 한개의 텍스처로 처리할 수 있는데 이는 생략한다.

(자세한 내용은 레퍼런스에서 찾아볼 수 있다. 하지만 여기에서는 다음 내용을 위해 넘어갑니다.!)


### 렌더 버퍼 오브젝트(Renderbuffer objects)
텍스처 이후 프레임 버퍼에 할당 가능한 타입으로 도입되었다.

렌더 버퍼는 텍스처와 마찬가지로 실제 버퍼이지만, 버퍼에 접근하여 읽을 수는 없다. (`glReadPixels()`을 통해 읽을 수 있다. ~~느리다~~)

이것은 OpenGL이 메모리 최적화를 하기 때문인데,

이를 통해 프레임 버퍼에 대한 off-screen rendering에서 텍스처보다 성능적인 이점을 제공한다.


### 렌더 버퍼 만들기
다른 버퍼와 유사하게 만들고 바인딩 할 수 있다.

```cpp
unsigned int rbo;
glGenRenderbuffers(1, &rbo);
glBindRenderbuffer(GL_RENDERBUFFER, rbo);
```

렌더 버퍼는 write-only 이므로 깊이 및 스텐실 버퍼로 주로 사용된다.

값을 읽을 필요가 많지 않은 깊이와 스텐실 테스트를 적용하고 싶기 때문이다.

깊이 및 스텐실 버퍼는 `glRenderbufferStorage()` 함수를 통해 생성할 수 있다.

```cpp
glRenderbufferStorage(GL_RENDERBUFFER, GL_DEPTH24_STENCIL8, 800, 600);
```

마지막으로 프레임 버퍼와 렌더 버퍼를 연결하면 된다.

```cpp
glFramebufferRenderbuffer(GL_FRAMEBUFFER, GL_DEPTH_STENCIL_ATTACHMENT, GL_RENDERBUFFER, rbo); 
```


## 사용하기
이제 프레임 버퍼에 렌더링된 컬러 텍스처를 자유롭게 사용할 수 있다.

### 예시 : Post proccessing - 감마
![[Untitled 1 1.png]]

감마 값을 높게 설정해 어두워진 모습


### 예시 : Post proccessing - 그레이스케일
![[Untitled 2 1.png]]

회색빛 세상


## Reference
[LearnOpenGL - Framebuffers](https://learnopengl.com/Advanced-OpenGL/Framebuffers)
