<template>
  <v-avatar size="35">
    <v-img alt="User Avatar" :src="userInfo.photoURL" />
  </v-avatar>
  <v-menu right activator="parent">
    <v-card color="#212121">
      <v-list nav bg-color="#212121">
        <v-list-item
          title="로그아웃"
          prepend-icon="mdi-logout"
          @click="userInfo.logout"
        />
        <v-list-item>
          <v-btn-toggle block variant="outlined" class="d-flex justify-center">
            <v-btn to="/account/account" icon="mdi-cog-outline"></v-btn>
            <v-btn
              :to="`/user/${userInfo.uid}`"
              icon="mdi-account-circle"
            ></v-btn>
            <v-btn to="/user/bookmarks" icon="mdi-bookmark-multiple"></v-btn>
            <v-btn to="/book/post" icon="mdi-pencil"></v-btn>
          </v-btn-toggle>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<script setup lang="ts">
const userInfo = User()
userInfo.initUserInfo()
</script>
