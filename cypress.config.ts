import { defineConfig } from 'cypress'

export default defineConfig({
  projectId: 'h79uao',

  component: {
    devServer: {
      framework: 'vue',
      bundler: 'webpack'
    }
  }
})
