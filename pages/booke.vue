<template>
  <div>
    <h1>Book</h1>
  </div>
</template>

<script setup>
const { pending, data } = useLazyFetch(
  'https://openapi.naver.com/v1/search/book.json',
  {
    headers: {
      'X-Naver-Client-Id': '8odgbcSItxzLGkQeUjA_',
      'X-Naver-Client-Secret': 'Ear7upff6k'
    },
    params: {
      query: 'vue'
    }
  }
)

watch(data, newData => {
  console.log(newData)
})
</script>
