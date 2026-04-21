import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Para GitHub Pages: mude para '/nome-do-repo/' quando fizer deploy
  // Para GitHub Pages: o base deve ser o nome exato do repositório
  base: '/blocksmith/',
})
