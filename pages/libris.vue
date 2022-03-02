<template>
  <LibrisCount :librisTop="librisTop" :showActionButton="false" />
</template>

<script>
import { db } from '../plugins/firebase.js'

export default {
  data() {
    return {
      librisTop: [],
    }
  },
  mounted() {
    db.ref('/users')
      .orderByChild('/libris')
      .on('child_added', async (s) => {
        this.librisTop.unshift({
          name: s.val().username,
          libris: s.val().libris ?? 0,
          image: s.val().photoURL,
          uid: s.key,
        })
      })
  },
}
</script>
