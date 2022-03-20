<template>
  <LibrisCount :librisTop="librisTop" :showActionButton="false" />
</template>

<script>
import { db } from '../plugins/firebase.js';

export default {
  data() {
    return {
      librisTop: [],
    };
  },
  created() {
    db.ref('/users')
      .orderByChild('/libris')
      .on('child_added', async (s) => {
        this.librisTop.unshift({
          name: s.val().username,
          libris: s.val().libris ?? 0,
          image:
            s.val().photoURL ??
            'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRrrnGZwdiVB0PvComVCV3YlXEMtQpHVmGjDg&usqp=CAU',
          uid: s.key,
        });
      });
  },
};
</script>
