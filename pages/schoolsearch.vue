<template>
  <div v-html="searchHTML"></div>
</template>

<script>
import Vue from 'vue'

export default Vue.extend({
  data() {
    return {
      searchHTML: ''
    }
  },
  created() {
    fetch(
      'https://reading.gglec.go.kr/r/newReading/search/schoolSearchResult.jsp?dataType=ALL&division1=ALL&connect1=A&searchCon1=%EC%BD%94%EC%8A%A4%EB%AA%A8%EC%8A%A4'
    )
      .then(res => res.text())
      .then(html => {
        this.searchHTML = html
      })
  }
})
</script>
