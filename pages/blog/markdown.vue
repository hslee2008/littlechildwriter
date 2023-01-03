<template>
  <div>
    <v-card-title>Markdown이란?</v-card-title>

    <v-card-text>
      Markdown은 블로그, 개발자들이 많이 사용하는 문서 작성 언어이다. 제목,
      이미지, 링크 등의 텍스트 외의 다양한 요소들도 쉽게 사용할 수 있다.<br /><br />

      다음과 같은 문법은 제목으로 사용된다.<br /><br />

      <pre class="my-3">
        # 제목
        ## 부제목
        ### 소제목
        #### 소소제목
        ##### 소소소제목
        ###### 소소소소제목
      </pre>

      <h1>제목</h1>
      <h2>부제목</h2>
      <h3>소제목</h3>
      <h4>소소제목</h4>
      <h5>소소소제목</h5>
      <h6>소소소소제목</h6>

      <br /><br />

      이미지는 다음과 같이 사용할 수 있다.<br /><br />

      <pre class="my-3">
        ![이미지 설명](이미지 링크)
      </pre>

      <img src="https://littlechildwriter.web.app/icon.png" alt="이미지 설명" />

      <br /><br />

      링크는 다음과 같이 사용할 수 있다.<br /><br />

      <pre class="my-3">
        [링크 설명](링크)
      </pre>

      <a href="https://littlechildwriter.web.app">링크 설명</a>

      <br /><br />

      <NuxtLink to="./new" class="text-decoration-none">
        <v-btn color="primary">글쓰기</v-btn>
      </NuxtLink>
    </v-card-text>
  </div>
</template>
