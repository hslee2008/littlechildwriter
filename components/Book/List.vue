<template>
  <div>
    <v-row class="mt-5 mx-2 g-10">
      <v-col cols="12">
        <v-text-field
          v-if="search"
          v-model="searchText"
          variant="outlined"
          label="검색"
          outlined
          dense
        />
      </v-col>
    </v-row>

    <v-card v-if="loading" class="text-center">
      <v-card-text>
        <v-progress-circular indeterminate color="primary" size="30" />
        <v-card-title>책을 불러오는 중입니다...</v-card-title>
      </v-card-text>
    </v-card>
    <BookCard v-else-if="(item ?? []).length > 0" :items="item" />
    <v-card v-else-if="searchText.length === 0" class="d-flex justify-center">
      <div>
        <v-card-title>검색 결과가 없습니다.</v-card-title>
        <v-card-actions>
          <v-btn
            rounded="lg"
            variant="tonal"
            append-icon="mdi-open-in-new"
            to="/book/list"
            class="ml-2"
          >
            모든 책 보기
          </v-btn>
        </v-card-actions>
      </div>
    </v-card>

    <div v-if="!loading" class="d-flex">
      <v-row class="mt-10" align="center" justify="center">
        <v-spacer />

        <v-btn
          variant="plain"
          icon="mdi-chevron-left"
          size="large"
          @click="Before"
        />
        <v-btn
          variant="plain"
          icon="mdi-chevron-right"
          size="large"
          @click="Next"
        />

        <v-spacer />
      </v-row>
    </div>
  </div>
</template>

<script setup lang="ts">
const { $db } = useNuxtApp()

const books = ref<any[]>([])
const searchText = ref<string>('')
const page = ref<number>(1)

const currentBookLength = ref(10)

const loading = ref<boolean>(true)

const item = computed(() => {
  let BooksInner: any[] = []

  if (searchText.value) {
    const ref = $db.ref('contents')
    const query = ref.orderByChild('title').equalTo(searchText.value)
    query.on('value', (snapshot: any) => {
      BooksInner = snapshot.val()
      BooksInner = Keys(BooksInner)?.map((key: any) => BooksInner[key])
    })
  } else {
    BooksInner = books.value.slice((page.value - 1) * 10, page.value * 10)
  }

  return BooksInner
})

const FetchSpecUserBook = (limit: number) => {
  $db
    .ref('contents')
    .orderByChild('uid')
    .equalTo(props.user)
    .limitToLast(limit)
    .on('child_added', async (s: any) => {
      const data = await s.val()
      books.value.unshift(data)
    })
}

const FetchAllUserBook = (limit: number) => {
  $db
    .ref('contents')
    .limitToLast(limit)
    .on('child_added', async (s: any) => {
      const data = await s.val()
      books.value.unshift(data)
    })
}

onBeforeMount(() => {
  if (props.user === 'everyone') FetchAllUserBook(20)
  else FetchSpecUserBook(20)

  setTimeout(() => {
    loading.value = false
  }, 4000)
})

const Before = () => {
  if (page.value > 1) {
    page.value--
  }

  window.scrollTo(0, 0)
}

const Next = () => {
  if (props.user === 'everyone') FetchAllUserBook(currentBookLength.value + 10)
  else FetchSpecUserBook(currentBookLength.value + 10)

  currentBookLength.value += 10

  if (page.value < Math.ceil(books.value.length / 10)) {
    page.value++
  }

  window.scrollTo(0, 0)
}

const props = defineProps<{
  user: string
  search: boolean
}>()
</script>
