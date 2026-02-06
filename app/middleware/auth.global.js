import { canAccessPage } from '~/utils/roles'

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    const publicRoutes = ['/login']

    const isPublicRoute = publicRoutes.includes(to.path)

    if (authStore.isAuthenticated && to.path === '/login') {
        return navigateTo('/')
    }

    if (!authStore.isAuthenticated && !isPublicRoute) {
        return navigateTo('/login')
    }

    if (authStore.isAuthenticated && to.path !== '/') {
        const pageName = to.path.split('/')[1]
        const userRole = authStore.user?.role

        if (pageName && !canAccessPage(userRole, pageName)) {
            return navigateTo('/')
        }
    }
})