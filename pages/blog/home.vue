<template>
  <div>
    <div class="mb-5">
      <h1>창작 코너</h1>

      <v-btn
        v-if="userInfo.loggedIn"
        rounded="lg"
        variant="tonal"
        color="primary"
        class="my-5"
        to="/blog/new"
        prepend-icon="mdi-plus"
      >
        새 블로그
      </v-btn>
    </div>

    <v-list nav>
      <v-list-item
        v-for="(item, i) in list"
        :key="item.time"
        :to="`/blog/content/${item.time}`"
      >
        <template #prepend>
          <UserPhoto :size="45" :src="item?.photoURL" />
        </template>

        <v-list-item-title>{{ item.topic }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.displayName }}</v-list-item-subtitle>

        <v-spacer />

        <template v-if="userInfo.is(item.uid)" #append>
          <v-btn
            rounded="lg"
            icon="mdi-dots-vertical"
            cols="1"
            @click.stop.prevent=""
          >
            <v-menu offset-y activator="parent">
              <v-list>
                <v-list-item @click="DeleteContent(i)">
                  <v-list-item-title>
                    <v-icon start> mdi-trash-can </v-icon> 삭제
                  </v-list-item-title>
                </v-list-item>
                <v-list-item :to="`./edit/${item.time}`">
                  <v-list-item-title>
                    <v-icon start> mdi-pencil </v-icon> 편집
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()
const userInfo = User()
const list = ref<any>([])

onMounted(() =>
  $db.ref('/blog').once('value', (snapshot: any) => {
    const data = snapshot.val()

    if (data) {
      list.value = Object.values(data).reverse()
    }
  })
)

const DeleteContent = (i: number) => {
  $db.ref(`/blog/${list.value[i].time}`).remove()
  list.value.splice(i, 1)
}

useHead({
  title: '창작 코너 - LCW'
})
</script>
