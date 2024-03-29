<template>
  <div>
    <br />

    <h1>{{ content.topic }}</h1>
    <v-card class="d-flex" :to="`/user/${content.uid}`">
      <v-avatar size="45" class="my-auto ml-3">
        <UserPhoto :size="45" :src="content?.photoURL" />
      </v-avatar>
      <div>
        <v-card-title>{{ content.displayName }}</v-card-title>
        <v-card-subtitle class="text-grey">
          {{ new Date(content.time).toLocaleDateString() }}
        </v-card-subtitle>
      </div>
    </v-card>

    <v-btn
      v-if="userInfo.loggedIn"
      rounded="lg"
      :variant="
        Object.values(content.upvote ?? {}).includes(userInfo.uid)
          ? 'tonal'
          : 'outlined'
      "
      :elevation="
        Object.values(content.upvote ?? {}).includes(userInfo.uid) ? 2 : 0
      "
      size="small"
      class="mt-5"
      prepend-icon="mdi-arrow-up-bold"
      @click="Upvote()"
    >
      좋은 주제
    </v-btn>

    <v-divider class="my-10" />

    <v-row>
      <v-col :cols="mobile ? 12 : 6">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <span>
              찬성
              <span class="text-grey">
                ({{ Keys(content.pro ?? {}).length }})
              </span>
            </span>
            <v-btn
              v-if="userInfo.loggedIn"
              rounded="lg"
              variant="tonal"
              size="small"
              prepend-icon="mdi-plus"
              @click=";(side = 'pro'), (write = true)"
            >
              글쓰기
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list nav>
              <v-list-item v-for="(item, i) in content.pro" :key="item.time">
                <template #prepend>
                  <NuxtLink :to="`/user/${item.uid}`" class="mr-3">
                    <UserPhoto :size="45" :src="item?.photoURL" />
                  </NuxtLink>
                </template>

                <div class="ml-1 mt-3">
                  <p>{{ item.topic }}</p>
                  <v-list-item-subtitle>
                    {{ item.displayName }}
                  </v-list-item-subtitle>
                </div>

                <template #append>
                  <v-menu offset-y>
                    <template #activator="{ props }">
                      <v-btn
                        icon="mdi-dots-vertical"
                        variant="plain"
                        v-bind="props"
                        cols="1"
                        @click.stop.prevent=""
                      />
                    </template>
                    <v-list>
                      <v-list-item
                        v-if="userInfo.is(item.uid)"
                        @click="DeleteContent('pro', i)"
                      >
                        <v-list-item-title>
                          <v-icon start> mdi-trash-can </v-icon> 삭제
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="userInfo.is(item.uid)"
                        @click="UpdateOnPro(item.topic, i)"
                      >
                        <v-list-item-title>
                          <v-icon start> mdi-pencil </v-icon> 수정
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item :to="`/debate/thread/${time}+pro+${i}`">
                        <v-list-item-title>
                          <v-icon start> mdi-fencing </v-icon> 반박
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col :cols="mobile ? 12 : 6">
        <v-card>
          <v-card-title class="d-flex justify-space-between">
            <span>
              반대
              <span class="text-grey">
                ({{ Keys(content.con ?? {}).length }})
              </span>
            </span>
            <v-btn
              v-if="userInfo.loggedIn"
              rounded="lg"
              variant="tonal"
              size="small"
              prepend-icon="mdi-plus"
              @click=";(side = 'con'), (write = true)"
            >
              글쓰기
            </v-btn>
          </v-card-title>
          <v-card-text>
            <v-list nav>
              <v-list-item v-for="(item, i) in content.con" :key="item.time">
                <template #prepend>
                  <NuxtLink :to="`/user/${item.uid}`" class="mr-3">
                    <UserPhoto :size="45" :src="item?.photoURL" />
                  </NuxtLink>
                </template>

                <div class="ml-1 mt-3">
                  <p>{{ item.topic }}</p>
                  <v-list-item-subtitle>
                    {{ item.displayName }}
                  </v-list-item-subtitle>
                </div>

                <template #append>
                  <v-menu offset-y>
                    <template #activator="{ props }">
                      <v-btn
                        rounded="lg"
                        icon="mdi-dots-vertical"
                        variant="plain"
                        v-bind="props"
                        cols="1"
                        @click.stop.prevent=""
                      />
                    </template>
                    <v-list>
                      <v-list-item
                        v-if="userInfo.is(item.uid)"
                        @click="DeleteContent('con', i)"
                      >
                        <v-list-item-title>
                          <v-icon start> mdi-trash-can </v-icon> 삭제
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item
                        v-if="userInfo.is(item.uid)"
                        @click="UpdateOnCon(item.topic, i)"
                      >
                        <v-list-item-title>
                          <v-icon start> mdi-pencil </v-icon> 수정
                        </v-list-item-title>
                      </v-list-item>
                      <v-list-item :to="`/debate/thread/${time}+con+${i}`">
                        <v-list-item-title>
                          <v-icon start> mdi-fencing </v-icon> 반박
                        </v-list-item-title>
                      </v-list-item>
                    </v-list>
                  </v-menu>
                </template>
              </v-list-item>
            </v-list>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>

    <v-divider class="my-10" />

    <div class="d-flex">
      <v-card-title>제언</v-card-title>
      <v-tooltip right>
        <template #activator="{ props }">
          <v-icon color="grey" size="small" v-bind="props" class="mt-3">
            mdi-information-outline
          </v-icon>
        </template>
        <span>
          토론 주제와 관련하여 새롭게 토론하고 싶은 주제를 제안해 주세요
        </span>
      </v-tooltip>
    </div>

    <v-btn
      v-if="userInfo.loggedIn"
      rounded="lg"
      variant="tonal"
      prepend-icon="mdi-plus"
      @click="suggestionCard = true"
    >
      제언하기
    </v-btn>

    <v-card v-if="suggestionCard" class="mt-2">
      <v-card-title>
        <v-text-field
          v-model="suggestion"
          variant="outlined"
          label="주제"
          outlined
          dense
          :rules="[() => !!suggestion || '주제를 입력하세요']"
        />
      </v-card-title>
      <v-card-text>
        <v-textarea
          v-model="suggestionContent"
          variant="outlined"
          label="내용"
          outlined
          dense
          :rules="[() => !!suggestionContent || '내용을 입력하세요']"
        />
      </v-card-text>
      <v-card-actions>
        <v-btn rounded="lg" variant="tonal" @click="suggestionCard = false">
          취소
        </v-btn>
        <v-btn rounded="lg" variant="tonal" @click="newSuggestion">
          등록
        </v-btn>
      </v-card-actions>
    </v-card>

    <v-list nav>
      <v-list-item v-for="(item, i) in content.suggestion" :key="item.time">
        <template #prepend>
          <NuxtLink :to="`/user/${item.uid}`" class="mr-3">
            <UserPhoto :size="45" :src="item?.photoURL" />
          </NuxtLink>
        </template>

        <div class="ml-1 mt-3">
          <p>{{ item.topic }}</p>
          <v-list-item-subtitle>
            {{ item.displayName }}
          </v-list-item-subtitle>
        </div>

        <template #append>
          <v-btn
            rounded="lg"
            icon="mdi-dots-vertical"
            cols="1"
            @click.stop.prevent=""
          >
            <v-menu offset-y activator="parent">
              <v-list>
                <v-list-item @click="DeleteContent('suggestion', i)">
                  <v-list-item-title>
                    <v-icon start> mdi-trash-can </v-icon> 삭제
                  </v-list-item-title>
                </v-list-item>
                <v-list-item @click="UpdateOnSuggestion(item.topic, i)">
                  <v-list-item-title>
                    <v-icon start> mdi-pencil </v-icon> 수정
                  </v-list-item-title>
                </v-list-item>
              </v-list>
            </v-menu>
          </v-btn>
        </template>
      </v-list-item>
    </v-list>

    <v-dialog v-model="write" width="500">
      <v-card>
        <v-card-title>글쓰기</v-card-title>
        <v-card-text>
          <v-textarea
            v-model="claim"
            variant="outlined"
            label="내용"
            placeholder="내용을 입력해 주세요."
            rows="10"
          />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn rounded="lg" variant="tonal" @click="write = false">
            취소
          </v-btn>
          <v-btn rounded="lg" variant="tonal" @click="post">작성</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-dialog v-model="edit" width="500">
      <v-card>
        <v-card-title>글쓰기</v-card-title>
        <v-card-text>
          <v-textarea v-model="editContent" variant="outlined" rows="10" />
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn rounded="lg" variant="tonal" @click="edit = false">
            취소
          </v-btn>
          <v-btn rounded="lg" variant="tonal" @click="update"> 업데이트 </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script setup lang="ts">
import { useDisplay } from 'vuetify';
const { $db } = useNuxtApp()

const { mobile } = useDisplay()
const userInfo = User()
const route = useRoute()
const time = route.params.topic
const content = ref<any>({
  upvote: {}
})
const write = ref(false)
const edit = ref(false)
const editContent = ref<any>('')
const editIndex = ref<any>('')
const side = ref('')
const claim = ref('')

const suggestionCard = ref(false)
const suggestion = ref('')
const suggestionContent = ref('')

const post = () => {
  const { uid, displayName, photoURL } = userInfo

  $db.ref(`/debate/${time}/${side.value}`).push({
    displayName,
    uid,
    photoURL,
    topic: claim.value,
    time: Date.now()
  })

  write.value = false

  Libris(userInfo.uid, 35 + claim.value.length / 10)
  Notify(
    content.value.uid,
    userInfo.photoURL,
    `${userInfo.displayName}님이 새로운 의견을 냈습니다`,
    `/debate/topic/${time}`
  )

  claim.value = ''
}

const update = () => {
  if (side.value === 'suggestion') {
    $db.ref(`/debate/${time}/suggestion/${editIndex.value}`).update({
      topic: editContent.value
    })

    edit.value = false
    suggestion.value = ''
    suggestionContent.value = ''
  } else {
    $db.ref(`/debate/${time}/${side.value}/${editIndex.value}`).update({
      topic: editContent.value
    })

    edit.value = false
    editContent.value = ''
    editIndex.value = ''
  }
}

const DeleteContent = (side: string, i: number) => {
  if (side === 'suggestion') $db.ref(`/debate/${time}/suggestion/${i}`).remove()
  else $db.ref(`/debate/${time}/${side}/${i}`).remove()
}

const UpdateOnCon = (topic: string, index: number) => {
  editContent.value = topic
  editIndex.value = index
  edit.value = true
  side.value = 'con'
}

const UpdateOnPro = (topic: string, index: number) => {
  editContent.value = topic
  editIndex.value = index
  edit.value = true
  side.value = 'pro'
}

const UpdateOnSuggestion = (topic: string, index: number) => {
  editContent.value = topic
  editIndex.value = index
  edit.value = true
  side.value = 'suggestion'
}

const Upvote = () => {
  const { uid } = userInfo

  if (!Object.values(content.value.upvote ?? {}).includes(userInfo.uid)) {
    $db.ref(`/debate/${time}/upvote`).push(uid)
  } else {
    $db
      .ref(`/debate/${time}/upvote`)
      .orderByValue()
      .equalTo(uid)
      .once('value', (snapshot: any) => {
        snapshot.forEach((child: any) => {
          $db.ref(`/debate/${time}/upvote/${child.key}`).remove()
        })
      })
  }

  Notify(
    content.value.uid,
    userInfo.photoURL,
    `${userInfo.displayName}님이 토론 주제를 추천했습니다`,
    `/debate/topic/${time}`
  )
}

const newSuggestion = () => {
  const { uid, displayName, photoURL } = userInfo

  $db.ref(`/debate/${time}/suggestion`).push({
    displayName,
    uid,
    photoURL,
    topic: suggestion.value,
    content: suggestionContent.value,
    time: Date.now()
  })

  suggestionCard.value = false
  suggestion.value = ''
  suggestionContent.value = ''

  Libris(userInfo.uid, 10)
  Notify(
    content.value.uid,
    userInfo.photoURL,
    `${userInfo.displayName}님이 새로운 제언을 했습니다`,
    `/debate/topic/${time}`
  )
}

onMounted(() => {
  $db
    .ref(`/debate/${time}`)
    .on('value', async (s: any) => (content.value = await s.val()))
})
</script>
