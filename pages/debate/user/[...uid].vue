<template>
  <div>
    <div>
      <h1>토론 광장 - 나의 주제</h1>

      <v-btn
        v-if="userInfo.loggedIn"
        rounded="lg"
        variant="tonal"
        color="primary"
        class="my-3 mr-2"
        to="/debate/new"
      >
        <v-icon start>mdi-plus</v-icon> 새 주제
      </v-btn>
      <v-btn
        v-if="userInfo.loggedIn"
        rounded="lg"
        variant="tonal"
        color="primary"
        class="my-3 mr-2"
        to="/debate/home"
      >
        <v-icon start>mdi-account</v-icon> 모든 주제
      </v-btn>

      <v-chip-group class="mt-1">
        <v-chip class="text-center">
          <v-icon class="mr-2">mdi-lectern</v-icon>
          {{ list.length }}개 주제
        </v-chip>
        <v-chip class="text-center">
          <v-icon class="mr-2">mdi-comment-flash</v-icon>
          {{ totalComment }}개 의견
        </v-chip>
      </v-chip-group>
    </div>

    <v-list nav class="mt-3">
      <v-list-item
        v-for="(item, i) in list"
        :key="item.time"
        :to="`/debate/topic/${item.time}`"
        class="mt-2"
      >
        <template #prepend>
          <v-avatar size="45">
            <UserPhoto :size="45" :src="item?.photoURL" />
          </v-avatar>
        </template>

        <v-list-item-title>{{ item.topic }}</v-list-item-title>
        <v-list-item-subtitle>{{ item.displayName }}</v-list-item-subtitle>

        <v-spacer />

        <template #append>
          <v-icon start class="mr-2">mdi-comment-flash</v-icon>
          {{ Object.keys({ ...item.pro, ...item.con } ?? {}).length }}

          <v-list-item-action v-if="userInfo.is(item.uid)">
            <v-btn
              variant="plain"
              rounded="lg"
              icon
              cols="1"
              @click.stop.prevent=""
            >
              <v-icon>mdi-dots-vertical</v-icon>

              <v-menu offset-y activator="parent">
                <v-list>
                  <v-list-item @click="DeleteContent(i)">
                    <v-list-item-title>
                      <v-icon start> mdi-trash-can </v-icon> 삭제
                    </v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-btn>
          </v-list-item-action>
        </template>
      </v-list-item>
    </v-list>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const route = useRoute()
const router = useRouter()
const userInfo = User()
const list = ref<any>([])

const totalComment = ref(0)

onMounted(() =>
  $db
    .ref('/debate')
    .orderByChild('uid')
    .equalTo(route.params.uid.toString())
    .on('child_added', async (s: any) => {
      list.value.unshift(await s.val())
      totalComment.value += Object.keys({
        ...s.val().pro,
        ...s.val().con
      }).length
    })
)

const DeleteContent = (i: number) => {
  $db.ref(`/debate/${list.value[i].time}`).remove()
  list.value.splice(i, 1)
  router.go(0)
}

useHead({
  title: '토론 광장 (나의 주제) - LCW'
})
</script>
