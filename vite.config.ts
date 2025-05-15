import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import postcssPresetMantine from 'postcss-preset-mantine'
import postcssSimpleVars from 'postcss-simple-vars'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        postcssPresetMantine(),
        postcssSimpleVars()
      ],
    },
  },
})
