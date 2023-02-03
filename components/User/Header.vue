<template>
  <v-row class="mb-5">
    <v-avatar size="75" class="mt-4 ml-5">
      <UserPhoto :src="targetUser?.photoURL" :size="75" />
    </v-avatar>

    <div class="d-flex align-center">
      <div>
        <v-card-title>{{ targetUser.displayName }}</v-card-title>
        <v-card-subtitle class="text--grey">
          구독자 {{ formatter(subCount) }}명
        </v-card-subtitle>
      </div>
    </div>

    <div v-if="userInfo.loggedIn" class="ml-auto my-auto float-right mr-5">
      <v-btn
        v-if="userInfo.uid !== uid"
        rounded="lg"
        variant="tonal"
        color="red"
        class="rounded-xl"
        @click="subscribe"
      >
        {{ subscribed ? '구독 취소' : '구독' }}
      </v-btn>
      <v-btn
        v-else
        rounded="lg"
        variant="tonal"
        color="primary"
        to="/account/account"
        class="rounded-xl"
      >
        편집 <v-icon right> mdi-pencil </v-icon>
      </v-btn>
    </div>
  </v-row>
</template>

<script setup>
defineProps({
  targetUser: {
    type: Object,
    required: true
  },
  subCount: {
    type: Number,
    required: true
  },
  uid: {
    type: String,
    required: true
  },
  subscribed: {
    type: Boolean,
    required: true
  },
  subscribe: {
    type: Function,
    required: true
  },
  userInfo: {
    type: Object,
    required: true
  }
})
</script>
