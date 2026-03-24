export default defineNuxtPlugin(async () => {
    const authStore = useAuthStore()

    authStore.checkAuth()

    if (authStore.isAuthenticated && authStore.token) {
        const result = await authStore.fetchMe()

        if (result.shouldLogout) {
            await navigateTo('/login')
        }
    }
})