<template>
  <div>
    <v-card class="d-flex justify-center align-center mb-5">
      <div class="mt-3">
        <UserPhoto :src="targetUser.photoURL" :size="55" />
      </div>
      <div class="ml-2">
        <v-card-title>{{ targetUser.displayName }}</v-card-title>
        <v-card-subtitle>토론 광장</v-card-subtitle>
      </div>
    </v-card>

    <div class="text-center">
      <v-btn rounded="lg" variant="tonal" class="my-3 mr-2" to="/debate/home">
        <v-icon start>mdi-chevron-left</v-icon> 모든 주제
      </v-btn>
    </div>

    <v-card class="mt-5">
      <v-card-text>
        <v-row>
          <v-col cols="6">
            <v-card-title class="text-center">총 주제</v-card-title>
            <v-card-text class="text-center">{{ list.length }}</v-card-text>
          </v-col>
          <v-col cols="6">
            <v-card-title class="text-center">총 댓글</v-card-title>
            <v-card-text class="text-center">{{ totalComment }}</v-card-text>
          </v-col>
        </v-row>
      </v-card-text>
    </v-card>

    <v-list v-if="list.length" class="mt-3" lines="two">
      <v-list-item
        v-for="(item, i) in list"
        :key="item.time"
        :to="`/debate/topic/${item.time}`"
        class="mt-2"
      >
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
    <v-card v-else class="mt-5">
      <v-card-text class="text-center">주제가 없습니다.</v-card-text>
    </v-card>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const route = useRoute()
const router = useRouter()
const userInfo = User()
const list = ref<any>([])

const targetUser = ref<any>({})
const totalComment = ref(0)

onMounted(() => {
  $db.ref(`/users/${route.params.uid}`).on('value', (s: any) => {
    targetUser.value = s.val()
  })

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
})

const DeleteContent = (i: number) => {
  $db.ref(`/debate/${list.value[i].time}`).remove()
  list.value.splice(i, 1)
  router.go(0)
}

useHead({
  title: '토론 광장 (나의 주제) - LCW'
})
</script>
