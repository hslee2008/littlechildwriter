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
    <v-card v-else-if="searchText.length === 0" class="text-center">
      <v-card-text class="d-flex justify-center">
        <div>
          <v-progress-circular indeterminate color="primary" size="30" />
          <v-card-title>책을 불러오는데 오래 걸립니다...</v-card-title>
          <v-card-title>또는 검색 결과가 없습니다.</v-card-title>

          <v-img
            src="https://media.tenor.com/6EY-3VQx2EIAAAAM/internet-fast.gif"
            width="200"
            class="rounded-xl mt-3 mb-5 mx-auto"
          />
        </div>
      </v-card-text>
    </v-card>

    <div class="d-flex text-center ma-3 mx-5">
      <v-row class="mt-10" align="center" justify="center">
        <v-spacer />

        <v-btn icon variant="plain" color="blue darken-3" @click="Before">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-btn icon variant="plain" color="blue darken-3" @click="Next">
          <v-icon>mdi-chevron-right</v-icon>
        </v-btn>
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
      BooksInner = Object.keys(BooksInner)?.map((key: any) => BooksInner[key])
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
