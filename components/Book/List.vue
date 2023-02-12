<template>
  <div>
    <v-row class="mt-5 mx-2 g-10">
      <v-col cols="12">
        <div v-if="star" class="ml-4">
          <v-chip
            v-if="everything"
            class="ma-2"
            closable
            @click:close="everything = false"
          >
            모두
          </v-chip>
          <v-chip v-else class="ma-2" closable @click:close="everything = true">
            <v-rating
              v-model="rating"
              half-increments
              size="20"
              color="amber"
              background-color="white"
            />
          </v-chip>
        </div>

        <v-text-field
          v-else
          v-model="search"
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
    <BookCard v-else-if="item.length > 0" :items="item" />
    <v-card v-else-if="search.length === 0" class="text-center">
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
        <v-btn text color="primary" variant="tonal" class="ml-2">
          {{ itemsPerPage }}
          <v-icon right> mdi-chevron-down </v-icon>

          <v-menu top activator="parent">
            <v-list>
              <v-list-item
                v-for="num in [5, 10, 15, 20]"
                :key="num"
                @click="itemsPerPage = num"
              >
                <v-list-item-title>{{ num }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>
        </v-btn>

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
const search = ref<string>('')
const rating = ref<number>(5)
const page = ref<number>(1)
const itemsPerPage = ref<number>(10)

const currentBookLength = ref(10)

const loading = ref<boolean>(true)
const everything = ref<boolean>(true)

const item = computed(() => {
  return books.value
    .filter((book: any) => {
      if (props.star) {
        return book.rating === rating.value || everything.value === true
      } else {
        return (
          (book.title?.toLowerCase() ?? []).includes(
            search.value.toLowerCase()
          ) ||
          book.displayName
            ?.toLowerCase()
            .includes(search.value.toLowerCase()) ||
          (book?.categories ?? []) === search.value.toLowerCase() ||
          search.value === ''
        )
      }
    })
    .slice(
      (page.value - 1) * itemsPerPage.value,
      page.value * itemsPerPage.value
    )
})

onBeforeMount(() => {
  $db
    .ref('contents')
    .limitToLast(20)
    .on('child_added', async (s: any) => {
      const data = await s.val()

      if (props.user === 'everyone') books.value.unshift(data)
      else if (data.uid === props.user) books.value.unshift(data)
    })

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
  $db
    .ref('contents')
    .limitToLast(currentBookLength.value + 20)
    .on('child_added', async (s: any) => {
      const data = await s.val()

      if (props.user === 'everyone') books.value.unshift(data)
      else if (data.uid === props.user) books.value.unshift(data)
    })

  currentBookLength.value += 10

  if (page.value < Math.ceil(books.value.length / itemsPerPage.value)) {
    page.value++
  }

  window.scrollTo(0, 0)
}

const props = defineProps<{
  user: string
  star: boolean
}>()
</script>
