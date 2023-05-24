<template>
  <div>
    <h1>리브리스 포인트제</h1>

    <br />

    <v-table class="rounded-lg">
      <template #default>
        <thead>
          <tr>
            <th class="text-left">활동</th>
            <th class="text-left">점수</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>새로운 책 올리기</td>
            <td>÷ 5점</td>
          </tr>
          <tr>
            <td>책 - 좋아요 누르기</td>
            <td>1점</td>
          </tr>
          <tr>
            <td>책 - 읽기</td>
            <td>1점</td>
          </tr>
          <tr>
            <td>책 - 댓글</td>
            <td>5점</td>
          </tr>
          <tr>
            <td>홈페이지 핀하기</td>
            <td>-250</td>
          </tr>
          <tr>
            <td>창작코너 - 글 올리기</td>
            <td>75점</td>
          </tr>
          <tr>
            <td>토론광장 - 주제 올리기</td>
            <td>3점</td>
          </tr>
          <tr>
            <td>토론광장 - 의견 올리기</td>
            <td>35점</td>
          </tr>
          <tr>
            <td>토론광장 - 제언하기</td>
            <td>10점</td>
          </tr>
          <tr>
            <td>구독하기 & 구독받기</td>
            <td>15점</td>
          </tr>
        </tbody>
      </template>
    </v-table>
  </div>
</template>

<script setup>
useHead({
  title: '리브리스 포인트제 - LCW'
})
</script>
