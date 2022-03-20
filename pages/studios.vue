<template>
  <div>
    <v-dialog v-model="makingStudioDialog" width="500">
      <template v-slot:activator="{ on, attrs }">
        <v-fab-transition>
          <v-btn
            v-bind="attrs"
            v-on="on"
            bottom
            right
            fixed
            color="primary"
            style="z-index: 100"
            :class="$vuetify.breakpoint.mobile ? 'mb-15' : 'mb-10'"
          >
            <v-icon left>mdi-android-studio</v-icon> 나만의 스튜디오 만들기
          </v-btn>
        </v-fab-transition>
      </template>

      <v-stepper v-model="makingStudioSteps">
        <v-stepper-header>
          <v-stepper-step :complete="makingStudioSteps > 1" step="1">
            스튜디오란?
          </v-stepper-step>

          <v-divider />

          <v-stepper-step :complete="makingStudioSteps > 2" step="2">
            기본 정보
          </v-stepper-step>

          <v-divider />

          <v-stepper-step step="3"> 이미지 업로드 </v-stepper-step>
        </v-stepper-header>

        <v-stepper-items>
          <v-stepper-content step="1">
            <v-card-title> 스튜디오란? </v-card-title>

            <v-card-text>
              스튜디오는 비슷한 책이나 똑같은 작가의 작품을 모아 놓은 것으로,
              Little 작가의 멤버들이 같이 작품을 만들어서 올리는 공간을
              뜻합니다.
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="makingStudioSteps = 2">
                👌 OK
              </v-btn>
            </v-card-actions>
          </v-stepper-content>

          <v-stepper-content step="2">
            <v-card-title> 스튜디오 기본 정보 </v-card-title>

            <v-card-text>
              <v-text-field
                label="스튜디오 이름"
                v-model="studioInfo.name"
                required
              />

              <v-text-field
                label="스튜디오 설명"
                v-model="studioInfo.description"
                required
              />
            </v-card-text>

            <v-divider />

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="makingStudioSteps = 3">
                👌 OK
              </v-btn>
            </v-card-actions>
          </v-stepper-content>

          <v-stepper-content step="3">
            <v-card-title> 스튜디오 고급 정보 </v-card-title>

            <v-card-text>
              <v-text-field
                prepend-icon="mdi-android-studio"
                label="스튜디오 사진 URL"
                v-model="studioInfo.image"
                required
              />

              <v-file-input
                type="file"
                accept="image/*"
                @change="uploadFile($event)"
                label="또는... 스튜디오 사진 업로드"
                color="grey"
                outlined
                dense
              />
            </v-card-text>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="makeAStudio">
                <v-icon left>mdi-check</v-icon> 만들기
              </v-btn>
            </v-card-actions>
          </v-stepper-content>
        </v-stepper-items>
      </v-stepper>
    </v-dialog>

    <v-data-iterator
      :items="fetchedStudios"
      :items-per-page.sync="itemsPerPage"
      :page.sync="page"
      :search="search"
      :sort-by="sortBy.toLowerCase()"
      :sort-desc="sortDesc"
      hide-default-footer
    >
      <template v-slot:header>
        <v-toolbar dark class="mb-1 elevation-0 transparent">
          <v-text-field
            v-model="search"
            clearable
            flat
            solo-inverted
            hide-details
            prepend-inner-icon="mdi-magnify"
            label="Search"
          />
          <template v-if="$vuetify.breakpoint.mdAndUp">
            <v-spacer></v-spacer>
            <v-select
              v-model="sortBy"
              flat
              solo-inverted
              hide-details
              :items="keys"
              prepend-inner-icon="mdi-magnify"
              label="Sort by"
            ></v-select>
            <v-spacer></v-spacer>
            <v-btn-toggle v-model="sortDesc" mandatory>
              <v-btn depressed :value="false">
                <v-icon>mdi-arrow-up</v-icon>
              </v-btn>
              <v-btn depressed :value="true">
                <v-icon>mdi-arrow-down</v-icon>
              </v-btn>
            </v-btn-toggle>
          </template>
        </v-toolbar>
      </template>

      <template v-slot:default="props">
        <v-row style="gap: 10px; margin-top: 5px; margin: 1px">
          <v-card
            v-for="(item, index) in props.items"
            :key="item.creator + item.name"
            class="my-3"
            elevation="20"
          >
            <v-img :src="item.image" width="50vh" style="margin: auto" />

            <v-card-title
              class="primary--text col-11 text-truncate"
              style="font-size: 1rem"
            >
              {{ item.name }}</v-card-title
            >
            <v-card-subtitle style="font-size: 0.9rem">{{
              item.creator
            }}</v-card-subtitle>

            <v-divider />

            <v-card-text>
              마지막 업데이트:
              {{ new Date(parseInt(item.lastUpdated)).toLocaleDateString() }}
            </v-card-text>

            <v-divider />

            <v-card-actions style="gap: 5px">
              <v-btn @click="openStudio(index)" color="primary" elevation="0"
                ><v-icon left>mdi-open-in-new</v-icon>열기</v-btn
              >
              <Dialog
                :functionOk="deleteStudio"
                buttonTitle="삭제"
                title="진짜로 삭제하겠습니까?"
                text="삭제하면 복구할 수 없습니다."
                icon="delete"
              />
            </v-card-actions>
          </v-card>
        </v-row>
      </template>

      <template v-slot:footer>
        <v-row class="mt-10 px-9" align="center" justify="center">
          <span class="grey--text to-hide">Items per page</span>
          <v-menu top>
            <template v-slot:activator="{ on, attrs }">
              <v-btn
                dark
                text
                color="primary"
                class="ml-2"
                v-bind="attrs"
                v-on="on"
              >
                {{ itemsPerPage }}
                <v-icon>mdi-chevron-down</v-icon>
              </v-btn>
            </template>
            <v-list>
              <v-list-item
                v-for="(number, index) in itemsPerPageArray"
                :key="index"
                @click="updateItemsPerPage(number)"
              >
                <v-list-item-title>{{ number }}</v-list-item-title>
              </v-list-item>
            </v-list>
          </v-menu>

          <v-spacer></v-spacer>

          <span class="mr-4 grey--text">
            Page {{ page }} of {{ numberOfPages }}
          </span>
          <v-btn
            icon
            dark
            color="blue darken-3"
            class="mr-1"
            @click="formerPage"
          >
            <v-icon>mdi-chevron-left</v-icon>
          </v-btn>
          <v-btn icon dark color="blue darken-3" class="ml-1" @click="nextPage">
            <v-icon>mdi-chevron-right</v-icon>
          </v-btn>
        </v-row>
      </template>
    </v-data-iterator>
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase.js';

export default {
  data() {
    return {
      fetchedStudios: [],
      itemsPerPageArray: [10, 30, 50, 70, 100],
      search: '',
      filter: {},
      sortDesc: true,
      page: 1,
      itemsPerPage: 10,
      sortBy: 'time',
      keys: ['time', 'views'],
      uid: '',

      studioInfo: {
        name: '',
        description: '',
        image: '',
        creator: '',
        lastUpdated: '',
        id: '',
        thelink: '',
        views: 0,
        liked: {},
        totalPosts: {},
        comments: [],
      },
      username: '',
      makingStudioDialog: false,
      makingStudioSteps: 1,
    };
  },

  computed: {
    numberOfPages() {
      return Math.ceil(this.fetchedStudios.length / this.itemsPerPage);
    },
    filteredKeys() {
      return this.keys.filter((key) => key !== 'Name');
    },
  },

  methods: {
    nextPage() {
      this.page + 1 <= this.numberOfPages && (this.page += 1);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
    formerPage() {
      this.page - 1 >= 1 && (this.page -= 1);

      window.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    },
    updateItemsPerPage(n) {
      this.itemsPerPage = n;
    },

    makeAStudio() {
      this.makingStudioDialog = false;

      this.studioInfo = {
        creator: this.username,
        lastUpdated: new Date.now(),
        id: this.uid + this.studioInfo.name.replace(/\s/g, ''),
      };

      db.ref('studios')
        .child(auth.currentUser.uid + this.studioInfo.name.replace(/\s/g, ''))
        .set(this.studioInfo);
    },
    fetchStudio() {
      db.ref('studios').on('value', (s) => {
        this.fetchedStudios = [];

        s.forEach((c) => this.fetchedStudios.push(c.val()));
      });
    },
    openStudio(i) {
      this.$router.push(`studio/${this.fetchedStudios[i].id}`);
    },
    deleteStudio(i) {
      db.ref('studios')
        .child(this.uid + this.fetchedStudios[i].name.replace(/\s/g, ''))
        .remove();
    },
    fetchUserInfo() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.username = user.displayName;
          this.uid = user.uid;
        }
      });
    },
  },

  async created() {
    this.fetchStudio();
    this.fetchUserInfo();
  },
};
</script>
