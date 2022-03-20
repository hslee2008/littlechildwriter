<template>
  <div>
    <v-form v-model="valid">
      <h1>기본 설정</h1>
      <h1 v-if="error">{{ error.message }}</h1>

      <v-divider />
      <br />

      <div>
        <v-row class="mx-1" style="gap: 5px">
          <v-text-field
            label="Name"
            placeholder="Name"
            filled
            required
            dense
            solo
            validate-on-blur
            v-model="name"
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
            v-model="email"
            :rules="emailRules"
            value="email"
            prepend-inner-icon="mdi-email"
          />
        </v-row>

        <v-card tile justify-center class="rounded-lg">
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
            v-model="photo"
            :rules="photoRules"
            value="photo"
            prepend-inner-icon="mdi-camera"
          />
          <v-card-text class="d-flex justify-center">
            <v-avatar size="100"><v-img :src="photo" /></v-avatar>
          </v-card-text>
        </v-card>

        <br />

        <br />

        <v-card tile justify-center class="rounded-lg">
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
              v-model="bio"
              placeholder="나의 소개"
              no-resize
            />
          </v-card-text>
        </v-card>

        <br />

        <br />

        <h1>홈 설정</h1>

        <v-divider />
        <br />

        <v-card tile justify-center class="rounded-lg">
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

        <br />

        <br />

        <v-card tile justify-center class="rounded-lg">
          <v-card-title>특집 프로젝트 선택하기</v-card-title>
          <v-divider />
          <br />
          <v-virtual-scroll
            :bench="benched"
            :items="mine"
            height="300"
            item-height="64"
          >
            <template v-slot:default="{ item }">
              <v-list-item :key="item.title">
                <v-list-item-action>
                  <v-checkbox
                    v-model="checked[item.title]"
                    :label="item.title"
                    color="primary"
                  />
                </v-list-item-action>
              </v-list-item>

              <v-divider />
            </template>
          </v-virtual-scroll>
        </v-card>
      </div>

      <br />

      <br />

      <v-row justify="center" style="gap: 5px">
        <v-btn @click="update" color="primary"
          ><v-icon left>mdi-account</v-icon>업데이트</v-btn
        >
        <Dialog
          :functionOk="delete_danger"
          buttonTitle="계정 삭제"
          title="진짜로 계정을 삭제하겠습니까?"
          text="계정을 삭제하면 복구할 수 없습니다"
          icon="delete"
        />
      </v-row>
    </v-form>

    <br />
    <br />
    <br />
  </div>
</template>

<script>
import { db, auth } from '../plugins/firebase';

export default {
  data() {
    return {
      dialog: false,
      name: '',
      photo: '',
      error: '',
      email: '',
      bio: '',
      background: '',
      valid: true,
      uid: '',
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
      icons: ['mdi-pencil'],
      transparent: 'rgba(255, 255, 255, 0)',

      benched: 0,
      mine: [],
      checked: {},
    };
  },
  computed: {
    items() {
      return Array.from({ length: this.length }, (k, v) => v + 1);
    },
    length() {
      return 7000;
    },
  },
  methods: {
    getUserInfo() {
      auth.onAuthStateChanged(async (user) => {
        if (user) {
          this.name = user.displayName;
          this.photo = user.photoURL;
          this.email = user.email;
          this.uid = user.uid;

          await db
            .ref(`/users/${user.uid}`)
            .once('value')
            .then((snapshot) => {
              this.bio = snapshot.val().bio;
              this.background =
                snapshot.val().background ??
                'https://images5.alphacoders.com/659/thumb-1920-659155.jpg';
              this.checked = snapshot.val().checked ?? {};
            });
        }
      });
    },
    async update() {
      const currentUser = auth.currentUser;

      currentUser
        .updateProfile({
          displayName: this.name,
          photoURL: this.photo,
        })
        .then(() => {
          db.ref(`/users/${currentUser.uid}`).update({
            username: this.name,
            photoURL: this.photo,
            bio: this.bio,
            background: this.background,
            project: this.mine,
            projectChecked: this.checked,
          });

          this.getUserInfo();

          this.$router.push(`target/${this.uid}`);
        })
        .catch((error) => alert(error.message));
    },
    delete_danger() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          deleteUser(user);
          this.$router.push('/');
        }
      });
    },
  },
  async mounted() {
    await this.getUserInfo();

    // get all the user's post from database
    await db.ref('/contents').once('value', async (snapshot) => {
      const data = Object.values(await snapshot.val());

      data.forEach((child) => {
        if (child.uid === this.uid) {
          this.mine.push({
            title: child.title,
            description: child.content,
            image: child.image,
            uid: child.uid,
            username: child.username,
            time: child.time,

            link: `${child.uid}-${child.time}`,
          });
        }
      });
    });
  },
};
</script>
