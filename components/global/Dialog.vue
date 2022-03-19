<template>
  <v-dialog v-model="dialog" width="500">
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        @click="dialog = true"
        color="red lighten-2"
        v-bind="attrs"
        v-on="on"
        ><v-icon left>mdi-{{ icon }}</v-icon
        >{{ buttonTitle }}</v-btn
      >
    </template>

    <v-card>
      <v-card-title> {{ title }} </v-card-title>

      <v-card-text> {{ text }} </v-card-text>

      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="functionOk"> 👌 OK </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data() {
    return {
      dialog: false,
    };
  },
  props: ['functionOk', 'buttonTitle', 'title', 'text', 'icon'],
};
</script>
