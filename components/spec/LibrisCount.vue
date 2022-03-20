<template>
  <v-lazy>
    <div>
      <div class="ma-5">
        <h2>명예의 전당</h2>
        <v-divider />
      </div>

      <v-card class="mx-5 transparent">
        <v-card-text>
          <div>리브리스 높은 사람</div>

          <v-timeline :dense="$vuetify.breakpoint.xs" clipped>
            <v-timeline-item
              v-for="(item, index) in librisTop"
              :key="item.uid"
              :icon="
                index == 0
                  ? 'mdi-chess-king'
                  : index == 1
                  ? 'mdi-chess-queen'
                  : index == 2
                  ? 'mdi-chess-rook'
                  : 'mdi-chess-bishop'
              "
            >
              <v-card class="mx-auto" max-width="344" outlined>
                <v-list-item three-line>
                  <v-list-item-content>
                    <div class="text-overline mb-4">{{ index + 1 }}등</div>
                    <v-list-item-title
                      class="mb-1"
                      :style="
                        'font-size: ' + $vuetify.breakpoint.name / 20 + 'px'
                      "
                    >
                      <NuxtLink :to="`/user/${item.uid}`">{{
                        item.name
                      }}</NuxtLink>
                    </v-list-item-title>

                    <v-list-item-subtitle
                      >{{ !$vuetify.breakpoint.mobile ? '리브리스: ' : ''
                      }}{{ Math.round(item.libris) }}</v-list-item-subtitle
                    >
                  </v-list-item-content>

                  <v-list-item-avatar
                    :size="$vuetify.breakpoint.xs ? 30 : 80"
                    color="grey"
                  >
                    <v-img :src="librisTop[index].image" />
                  </v-list-item-avatar>
                </v-list-item>
              </v-card>
            </v-timeline-item>
          </v-timeline>
        </v-card-text>

        <v-card-actions v-if="showActionButton">
          <v-btn to="/libris" text color="teal accent-4"> 모두 보기 </v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-lazy>
</template>

<script>
import { db } from '../../plugins/firebase.js';

export default {
  props: ['librisTop', 'showActionButton'],
};
</script>
