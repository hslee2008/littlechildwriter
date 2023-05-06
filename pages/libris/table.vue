<template>
  <div>
    <h1>리브리스 포인트제</h1>

    <br />

    <v-table class="rounded-lg">
      <template #default>
        <thead>
          <tr>
            <th class="text-left">책 관련 활동</th>
            <th class="text-left">점수</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>새로운 책 올리기</td>
            <td>해당 페이지 수 / 5 점</td>
          </tr>
          <tr>
            <td>책의 좋아요 버튼 누르기</td>
            <td>0.1점</td>
          </tr>
          <tr>
            <td>책 읽기 (읽은 사람과 글 쓴 사람 둘 다)</td>
            <td>0.1점</td>
          </tr>
          <tr>
            <td>댓글</td>
            <td>5점</td>
          </tr>
          <tr>
            <td>책 공유</td>
            <td>1점</td>
          </tr>
        </tbody>
      </template>
    </v-table>

    <br />

    <v-table class="rounded-lg">
      <template #default>
        <thead>
          <tr>
            <th class="text-left">Libris 사용하기</th>
            <th class="text-left">점수</th>
            <th class="text-left">예시</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>홈페이지에 핀하기</td>
            <td>-250</td>
            <td>1주일 동안 내가 가장 좋아하는 책 홈페이지에 핀하기</td>
          </tr>
        </tbody>
      </template>
    </v-table>

    <br />

    <v-table class="rounded-lg">
      <template #default>
        <thead>
          <tr>
            <th class="text-left">기타 활동</th>
            <th class="text-left">점수</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>창작 코너 새로운 글 올리기</td>
            <td>75점</td>
          </tr>
          <tr>
            <td>토론 광장 새로운 주제 올리기</td>
            <td>3점</td>
          </tr>
          <tr>
            <td>토론 광장 주제 추천 받기</td>
            <td>0점</td>
          </tr>
          <tr>
            <td>토론 광장 의견 올리기</td>
            <td>35점</td>
          </tr>
          <tr>
            <td>토론 광장 제언하기</td>
            <td>10점</td>
          </tr>
          <tr>
            <td>구독하기 (구독하고 구독 받은 사람 둘 다)</td>
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
