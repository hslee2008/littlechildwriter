<!-- eslint-disable vue/no-v-text-v-html-on-component -->
<!-- eslint-disable vue/no-v-html -->
<template>
  <div>
    <v-card>
      <NuxtLink to="./markdown" class="text-decoration-none">
        <v-card-subtitle>
          Markdown을 지원합니다 <v-icon size="small">mdi-information</v-icon>
        </v-card-subtitle>
      </NuxtLink>
      <v-card-title>
        <v-text-field
          variant="outlined"
          :model-value="topic"
          label="Topic"
          placeholder="Topic"
          required
        />
      </v-card-title>
      <v-card-text>
        <v-textarea
          :model-value="content"
          label="Content"
          placeholder="Content"
          hint="Markdown을 사용할 수 있습니다."
          required
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn variant="tonal" color="primary" @click="SaveContent"
          >업데이트</v-btn
        >
      </v-card-actions>
    </v-card>

    <br />

    <v-card>
      <v-card-title>미리보기</v-card-title>
      <v-card-text v-html="parse(content)" />
    </v-card>
  </div>
</template>

<script setup lang="ts">
import { parse } from "marked";
const { $db } = useNuxtApp();

const route = useRoute();
const time = route.params.content;
const userInfo = User();
const router = useRouter();
const topic = ref("");
const content = ref("");

onBeforeMount(() => {
  $db
    .ref(`blog/${time}`)
    .once("value")
    .then((s: any) => {
      const data = s.val();
      topic.value = data.topic;
      content.value = data.markdown;
    });
});

const SaveContent = () => {
  const { uid, displayName, photoURL } = userInfo.value;

  $db.ref(`/blog/${time}`).update({
    topic: topic.value,
    markdown: parse(content.value),
    uid,
    displayName,
    photoURL,
  });

  router.push(`/blog/content/${time}`);
};

useHead({
  title: "창작 코너 업데이트 - Little Child Writer",
});
</script>

<script lang="ts">
export default {
  name: "ContentEdit",
  inheritAttrs: false,
  customOptions: {},
};
</script>
