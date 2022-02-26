<template>
  <div class="account">
    <v-form v-model="valid">
      <h1>Edit Account</h1>
      <h1 v-if="error">{{ error.message }}</h1>

      <v-divider></v-divider>
      <br />

      <div>
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
        ></v-text-field>
        <v-text-field
          label="Email"
          placeholder="Email"
          filled
          required
          dense
          disabled
          solo
          validate-on-blur
          v-model="emaili"
          :rules="emailRules"
          value="email"
          prepend-inner-icon="mdi-email"
        ></v-text-field>
        <div
          :style="
            'display: ' + $vuetify.breakpoint.mobile
              ? 'block'
              : 'flex' + '; gap: 10px'
          "
        >
          <v-card tile justify-center style="margin-bottom: 3px">
            <v-text-field
              label="URL"
              placeholder="URL"
              filled
              required
              shaped
              flat
              dense
              solo
              validate-on-blur
              v-model="photo"
              :rules="photoRules"
              value="photo"
              prepend-inner-icon="mdi-camera"
            ></v-text-field>
            <v-card-text style="display: flex; justify-content: center">
              <v-avatar size="100"><v-img :src="photo" /></v-avatar>
            </v-card-text>
          </v-card>
          <v-card tile justify-center>
            <v-card-title>자신을 소개하세요!</v-card-title>
            <v-card-text style="display: flex; justify-content: center">
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
              ></v-textarea>
            </v-card-text>
          </v-card>
        </div>
      </div>

      <br />

      <br />

      <v-row justify="center" style="gap: 10px">
        <v-btn @click="update" color="primary"
          ><v-icon left>mdi-account</v-icon>Update</v-btn
        >
        <v-btn @click="email" v-if="!verified"
          ><v-icon left>mdi-email</v-icon>Verify Email</v-btn
        >
        <v-dialog width="500">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="error" v-bind="attrs" v-on="on"
              ><v-icon left>mdi-alert-rhombus</v-icon>Delete</v-btn
            >
          </template>

          <v-card>
            <v-card-title> You are about to delete your account! </v-card-title>

            <v-card-text> This is permanent and cannot be undone. </v-card-text>

            <v-divider></v-divider>

            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" text @click="delete_danger">
                Whatever
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-row>
    </v-form>

    <br />
  </div>
</template>

<style scoped>
.account {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>

<script>
import { db, auth } from '../plugins/firebase'

export default {
  data() {
    return {
      dialog: false,
      name: '',
      photo: '',
      error: '',
      emaili: '',
      bio: '',
      verified: false,
      valid: true,
      uid: '',
      nameRules: [
        (v) => !!v || 'Name is required',
        (v) => v.length <= 30 || 'Name must be less than 30 characters',
      ],
      photoRules: [
        (v) => !!v || 'Name is required',
        (v) => v.length <= 500 || 'Name must be less than 500 characters',
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
    }
  },
  mounted() {
    this.getUserInfo()
  },
  methods: {
    getUserInfo() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          this.name = user.displayName
          this.photo = user.photoURL
          this.emaili = user.email
          this.verified = user.emailVerified
          this.uid = user.uid

          db.ref(`/users/${user.uid}`)
            .once('value')
            .then((snapshot) => {
              this.bio = snapshot.val().bio
            })
        }
      })
    },
    async update() {
      const currentUser = auth.currentUser

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
          })

          this.getUserInfo()

          this.$router.push('/loadaccount?uid=' + this.uid)
        })
        .catch((error) => alert(error.message))
    },
    async email() {
      const currentUser = auth.currentUser

      currentUser.sendEmailVerification(currentUser)
      currentUser.reload()

      auth.onAuthStateChanged((user) => {
        if (user) {
          this.verified = user.emailVerified
        }
      })
    },
    delete_danger() {
      auth.onAuthStateChanged((user) => {
        if (user) {
          deleteUser(user)
          this.$router.push('/')
        }
      })
    },
  },
}
</script>
