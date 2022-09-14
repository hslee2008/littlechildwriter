import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "h79uao",

  component: {
    devServer: {
      framework: "vue",
      bundler: "webpack",
    },
  },

  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
