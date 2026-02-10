import { canAccessPage, getDefaultRoute } from '~/utils/roles'

export default defineNuxtRouteMiddleware((to, from) => {
    const authStore = useAuthStore()

    const publicRoutes = ['/login']

    const isPublicRoute = publicRoutes.includes(to.path)

    if (authStore.isAuthenticated && to.path === '/login') {
        return navigateTo(getDefaultRoute(authStore.user?.role))
    }

    if (!authStore.isAuthenticated && !isPublicRoute) {
        return navigateTo('/login')
    }

    if (authStore.isAuthenticated) {
        const userRole = authStore.user?.role

        if (to.path === '/') {
            if (!canAccessPage(userRole, '/')) {
                return navigateTo(getDefaultRoute(userRole))
            }
        } else {
            const pageName = to.path.split('/')[1]

            if (pageName && !canAccessPage(userRole, pageName)) {
                return navigateTo(getDefaultRoute(userRole))
            }
        }
    }
})