import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  return {
    define: { //got some problems with this variables, there was no refference to each of them
      'process.env.SOME_KEY': JSON.stringify(env.SOME_KEY),
      'global': {},
    },
    plugins: [react()],
  }
})

