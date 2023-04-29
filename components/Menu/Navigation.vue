<template>
  <v-list nav expand>
    <v-list-item to="/" title="홈페이지" prepend-icon="mdi-home-variant" />
    <v-list-item
      to="/book/list"
      title="책 목록"
      prepend-icon="mdi-format-list-text"
    />
    <v-list-item
      to="/class/classes"
      title="알림판"
      prepend-icon="mdi-school"
    />
    <v-list-item
      to="/blog/home"
      title="창작 코너"
      prepend-icon="mdi-typewriter"
    />
    <v-list-item
      to="/debate/home"
      title="토론 광장"
      prepend-icon="mdi-lectern"
    />

    <v-divider class="my-3" />

    <v-list-item
      to="/libris/libris"
      title="명예의 전당"
      prepend-icon="mdi-podium-gold"
    />
    <v-list-item
      to="/libris/table"
      title="포인트제"
      prepend-icon="mdi-table"
    />
  </v-list>
</template>
