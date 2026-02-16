export default defineNuxtPlugin(async (nuxtApp) => {
    const authStore = useAuthStore()

    if (process.client) {
        authStore.checkAuth()

        if (authStore.isAuthenticated && authStore.token) {

            const result = await authStore.fetchMe()

            if (result.shouldLogout) {
                navigateTo('/login')
            }
        }
    }
})