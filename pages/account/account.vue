<template>
  <v-form class="my-10">
    <v-card id="profile" class="mb-10 elevation-0" color="#23262e">
      <v-card-title>프로필 설정</v-card-title>

      <div class="d-flex ml-5">
        <v-avatar size="100">
          <UserPhoto :src="userInfo?.photoURL" />
        </v-avatar>
        <div>
          <v-card-title>{{ userInfo.displayName }}</v-card-title>
          <v-card-subtitle>{{ userInfo.email }}</v-card-subtitle>
          <v-card-action>
            <v-btn
              variant="tonal"
              text
              color="primary"
              class="ml-3 mt-3"
              @click="imageEdit = true"
            >
              이미지 편집
            </v-btn>
          </v-card-action>
        </div>
      </div>

      <v-card-text>
        <v-textarea
          :model-value="userDB.bio"
          auto-grow
          required
          flat
          dense
          variant="outlined"
          label="Bio"
          placeholder="나의 소개"
          class="ma-1 elevation-0"
        />
      </v-card-text>
    </v-card>

    <v-card id="book" class="mb-10 elevation-0" color="#23262e">
      <v-card-title>책 추천</v-card-title>
      <v-radio-group v-model="featured" class="ma-3">
        <v-list class="rounded-lg">
          <v-list-item v-for="book in books" :key="book.time">
            <template #prepend>
              <v-radio :key="book.time + '-radio'" :value="book.time" />
            </template>

            <v-list-item-title>{{ book.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-radio-group>
    </v-card>

    <v-card id="advanced" class="mb-10 elevation-0" color="#23262e">
      <v-card-title>고급 설정</v-card-title>

      <v-card-text>
        <v-text-field
          variant="outlined"
          :model-value="userInfo.uid"
          label="UID"
          placeholder="UID"
          required
          flat
          dense
          disabled
          prepend-inner-icon="mdi-account"
        />
      </v-card-text>
    </v-card>

    <v-dialog :model-value="imageEdit" width="500">
      <v-card>
        <v-card-title> 이미지 편집 </v-card-title>

        <v-card-text>
          <div class="text-center mb-3">
            <v-avatar size="100">
              <v-img :src="userInfo.photoURL" />
            </v-avatar>
          </div>

          <v-text-field
            variant="outlined"
            :model-value="userInfo.photoURL"
            label="URL"
            placeholder="URL"
            varaint="filled"
            required
            flat
            dense
            prepend-inner-icon="mdi-camera"
          />
        </v-card-text>

        <v-divider />

        <v-card-actions>
          <v-btn variant="tonal" color="red" text @click="imageEdit = false">
            취소
          </v-btn>
          <v-spacer />
          <v-btn variant="tonal" color="primary" text @click="save">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <v-row justify="center" class="g-10">
      <v-btn variant="tonal" color="primary" @click="Update">
        <v-icon start> mdi-account </v-icon>
        업데이트
      </v-btn>
    </v-row>
  </v-form>
</template>

<script setup lang="ts">
const { $db, $auth } = useNuxtApp();

const userInfo = User();
const router = useRouter();
const userDB = ref<any>({ bio: "" });
const books = ref<any[]>([]);
const imageEdit = ref<boolean>(false);
const featured = ref<number>(0);

useAuth(() => {
  $db
    .ref(`/users/${userInfo.value.uid}`)
    .once("value")
    .then(async (s: any) => (userDB.value = await s.val()));

  $db
    .ref(`/users/${userInfo.value.uid}`)
    .once("value")
    .then(async (s: any) => (featured.value = await s.val().featured));

  $db.ref("/contents/").on("value", async (s: any) => {
    const data = await s.val();

    for (const key in data)
      if (data[key].uid === userInfo.value.uid) books.value.push(data[key]);
  });
});

const Update = async () => {
  const { displayName, uid, email } = userInfo.value;
  const { bio } = userDB.value;

  await $auth.currentUser?.updateEmail(email);

  $db.ref(`/users/${uid}`).update({
    displayName,
    bio,
    featured: featured.value,
  });

  router.push(`/user/${uid}`);
};

const save = () => {
  const { photoURL } = userInfo.value;

  $auth.currentUser?.updateProfile({ photoURL });
  $db.ref(`/users/${userInfo.value.uid}`).update({ photoURL });

  imageEdit.value = false;
};

useHead({
  title: "계정 - LCW",
});
</script>
