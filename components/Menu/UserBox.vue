<template>
  <v-avatar size="35">
    <v-img alt="User Avatar" :src="userInfo.photoURL" />
  </v-avatar>
  <v-menu right activator="parent">
    <v-card color="#212121">
      <v-card class="d-flex" color="#212121">
        <v-avatar size="60" class="ma-auto ml-6">
          <v-img alt="User Avatar" :src="userInfo.photoURL" />
        </v-avatar>

        <v-card-text>
          <v-card-title>{{ userInfo.displayName }}</v-card-title>
          <v-card-subtitle>{{ userInfo.email }}</v-card-subtitle>
        </v-card-text>
      </v-card>

      <v-list nav bg-color="#212121">
        <v-list-item
          title="로그아웃"
          prepend-icon="mdi-logout"
          @click="userInfo.logout"
        />
      </v-list>

      <v-card class="py-3" color="#212121">
        <v-btn-toggle block variant="outlined" class="d-flex justify-center">
          <v-btn to="/account/account" icon="mdi-cog-outline"></v-btn>
          <v-btn
            :to="`/user/${userInfo.uid}`"
            icon="mdi-account-circle"
          ></v-btn>
          <v-btn to="/user/bookmarks" icon="mdi-bookmark-multiple"></v-btn>
          <v-btn to="/book/post" icon="mdi-pencil"></v-btn>
        </v-btn-toggle>
      </v-card>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
const userInfo = User()
userInfo.initUserInfo()
</script>
