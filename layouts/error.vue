<template>
  <div>
    <v-parallax
      src="/background.avif"
      width="100%"
      height="100%"
      class="parallax"
    >
      <v-layout column align-center justify-center class="white--text">
        <h1 class="display-1 font-weight-bold">404</h1>
        <h2 class="headline font-weight-bold">
          죄송합니다. 요청하신 페이지를 찾을 수 없습니다. 또는 알 수 없었던
          오류가 발생했을 수도 있습니다.
        </h2>
        <v-btn color="primary" large to="/" class="mt-10"> 메인으로 </v-btn>
      </v-layout>
    </v-parallax>
  </div>
</template>

<style scoped>
.parallax {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>
