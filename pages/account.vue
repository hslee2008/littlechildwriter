<template>
  <div class="account">
    <v-form v-model="valid">
      <v-card-title>기본 설정</v-card-title>
      <v-card-title v-if="error">{{ error.message }}</v-card-title>

      <v-divider class="mt-5 ma-5 mb-15" />

      <v-row style="gap: 10px" class="ma-5">
        <v-text-field
          label="Name"
          placeholder="Name"
          filled
          required
          dense
          solo
          validate-on-blur
          v-model="userInfo.username"
          :rules="nameRules"
          value="name"
          prepend-inner-icon="mdi-account"
        />
        <v-text-field
          label="Email"
          placeholder="Email"
          filled
          required
          dense
          disabled
          solo
          validate-on-blur
          v-model="userInfo.email"
          :rules="emailRules"
          value="email"
          prepend-inner-icon="mdi-email"
        />
      </v-row>

      <v-card tile justify-center class="ma-5 rounded-lg">
        <v-card-title>프로필 아바타</v-card-title>
        <v-divider />
        <br />
        <v-text-field
          label="URL"
          placeholder="URL"
          filled
          required
          flat
          dense
          solo
          validate-on-blur
          v-model="userInfo.photoURL"
          :rules="photoRules"
          value="photo"
          prepend-inner-icon="mdi-camera"
        />
        <v-card-text class="d-flex justify-center">
          <v-avatar size="100"><v-img :src="userInfo.photoURL" /></v-avatar>
        </v-card-text>
      </v-card>

      <v-card tile justify-center class="ma-5 rounded-lg">
        <v-card-title>자신을 소개하세요!</v-card-title>
        <v-card-text class="d-flex justify-center">
          <v-textarea
            required
            flat
            outlined
            dense
            solo
            validate-on-blur
            label="Bio"
            v-model="userInfo.bio"
            placeholder="나의 소개"
            no-resize
          />
        </v-card-text>
      </v-card>

      <v-card-title class="mt-15">홈 설정</v-card-title>

      <v-divider class="mt-5 ma-5 mb-15" />

      <v-card tile justify-center class="ma-5 rounded-lg">
        <v-card-title>프로필 페이지 배경화면</v-card-title>
        <v-divider />
        <br />
        <v-text-field
          label="프로필 페이지 배경화면"
          placeholder="배경화면"
          filled
          required
          flat
          dense
          solo
          validate-on-blur
          v-model="background"
          :rules="photoRules"
          value="Background"
          prepend-inner-icon="mdi-camera"
        />
        <v-card-text class="d-flex justify-center">
          <v-avatar size="100"><v-img :src="background" /></v-avatar>
        </v-card-text>
      </v-card>

      <v-card tile justify-center class="ma-5 rounded-lg">
        <v-card-title>특집 프로젝트 선택하기</v-card-title>
        <v-divider />
        <br />
        <v-virtual-scroll
          :bench="0"
          :items="mine"
          height="300"
          item-height="32"
        >
          <template v-slot:default="{ item }">
            <v-list-item :key="item.title" class="ml-5">
              <v-list-item-action>
                <v-row style="gap: 15px">
                  <v-checkbox
                    ripple
                    dense
                    v-model="checked[item.title]"
                    :label="item.title"
                  />

                  <v-btn
                    icon
                    x-small
                    color="primary"
                    :to="'content/' + item.link"
                  >
                    <v-icon>mdi-open-in-new</v-icon>
                  </v-btn>
                </v-row>
              </v-list-item-action>
            </v-list-item>
          </template>
        </v-virtual-scroll>
      </v-card>

      <br /><br />

      <v-row justify="center" style="gap: 5px">
        <v-btn @click="update" color="primary">
          <v-icon left>mdi-account</v-icon>업데이트
        </v-btn>
        <Dialog
          :functionOk="delete_account"
          buttonTitle="계정 삭제"
          title="진짜로 계정을 삭제하겠습니까?"
          text="계정을 삭제하면 복구할 수 없습니다. 모든 글 및 댓글은 남아 있습니다."
          icon="delete"
        />
      </v-row>
    </v-form>

    <br /><br /><br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase';

export default {
  data() {
    return {
      userInfo: {
        username: '',
        photoURL: '',
        uid: '',
        email: '',
        bio: '',
      },

      error: '',
      background: '',

      valid: true,

      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => v.length <= 30 || 'Name must be less than 30 characters',
      ],
      photoRules: [
        (v) => !!v || 'Name is required',
        (v) => v.length <= 10000 || 'Name must be less than 10000 characters',
      ],
      emailRules: [
        (v) => !!v || 'Email is required',
        (v) => /^\S+@\S+\.\S+$/.test(v) || 'Email must be valid',
      ],
      bioRules: [
        (v) => !!v || 'Bio is required',
        (v) => v.length > 10 || 'Name must be more than 10 characters',
      ],

      mine: [],
      checked: {},
    };
  },
  methods: {
    getUserInfo() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.userInfo = {
            username: user.displayName,
            photoURL: user.photoURL,
            uid: user.uid,
            email: user.email,
          };

          await db
            .ref(`/users/${user.uid}`)
            .once('value')
            .then((res) => res.val())
            .then((s) => {
              this.userInfo.bio = s.bio;
              this.background =
                s.background ??
                'https://littlechildwriter.web.app/background.avif';
              this.checked = s.checked ?? {};
            });
        }
      });
    },
    async update() {
      const { username, photoURL, uid } = this.userInfo;

      auth.currentUser
        .updateProfile({
          displayName: this.userInfo.username,
          photoURL: this.userInfo.photoURL,
        })
        .then(() => {
          db.ref(`/users/${uid}`).update({
            username,
            photoURL,
            bio: this.bio,
            background: this.background,
            project: this.mine,
            projectChecked: this.checked,
          });

          this.$router.push(`target/${uid}`);
        })
        .catch((error) => alert(error.message));
    },
    delete_account() {
      auth.onAuthStateChanged(
        (u) => u && u.delete().then(() => this.$router.push('/'))
      );
    },
    getMine() {
      db.ref('/contents').once('value', async (s) => {
        Object.values(await s.val()).forEach(
          (c) =>
            c.uid === this.userInfo.uid &&
            this.mine.push({
              title: c.title,
              description: c.content,
              image: c.image,
              username: c.username,
              uid: c.uid,

              link: `${c.uid}-${c.time}`,
            })
        );
      });
    },
  },

  async created() {
    await this.getUserInfo();
    await this.getMine();
  },
};
</script>
