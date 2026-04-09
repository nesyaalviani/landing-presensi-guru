import tailwindcss from "@tailwindcss/vite";

export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
   css: ['./app/assets/css/main.css'],
   vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  modules: ['@pinia/nuxt'],
  
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE
    }
  },

  app: {
    head: {
      title: 'SMKN 1 Cisarua',
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },

  ssr: false
})
