import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react() , tailwindcss()],
  define: {
    "import.meta.env.VITE_API_BASE_URL": JSON.stringify("http://localhost:4000/api/v1"),
  },
})

//http://localhost:4000/api/v1
//VITE_API_BASE_URL=https://eventsync-backend-22b9.onrender.com/api/v1