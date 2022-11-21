<template>
  <div>
    <h1>리브리스 포인트제</h1>

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">책 관련 활동</th>
            <th class="text-left">점수</th>
            <th class="text-left">예시</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>새로운 책 올리기</td>
            <td>해당 페이지 수 / 20 점</td>
            <td>200페이지 ➜ 10점</td>
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
    </v-simple-table>

    <br />

    <v-simple-table>
      <template v-slot:default>
        <thead>
          <tr>
            <th class="text-left">기타 활동</th>
            <th class="text-left">점수</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>창작 코너 새로운 글 올리기</td>
            <td>50점</td>
          </tr>
          <tr>
            <td>토론 광장 새로운 주제 올리기</td>
            <td>10점</td>
          </tr>
          <tr>
            <td>토론 광장 의견 올리기</td>
            <td>5점</td>
          </tr>
          <tr>
            <td>토론 광장 제언하기</td>
            <td>5점</td>
          </tr>
          <tr>
            <td>구독하기 (구독하고 구독 받은 사람 둘 다)</td>
            <td>15점</td>
          </tr>
        </tbody>
      </template>
    </v-simple-table>
  </div>
</template>

<script setup>
useHead({
  title: '리브리스 포인트제 - LCW'
})
</script>
