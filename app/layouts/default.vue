<template>
    <div class="drawer lg:drawer-open">
        <input id="my-drawer-4" type="checkbox" class="drawer-toggle" ref="drawerCheckbox" />
        <div class="drawer-content">
            <nav class="navbar h-18 w-full bg-base-200 border-b border-base-300 px-4">
                <!-- <label for="my-drawer-4" aria-label="open sidebar" class="btn btn-square btn-ghost lg:hidden">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                        stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                        class="my-1.5 inline-block size-4">
                        <path d="M4 4m0 2a2 2 0 0 1 2 -2h12a2 2 0 0 1 2 2v12a2 2 0 0 1 -2 2h-12a2 2 0 0 1 -2 -2z">
                        </path>
                        <path d="M9 4v16"></path>
                        <path d="M14 10l2 2l-2 2"></path>
                    </svg>
                </label> -->
                <div class="px-4 font-bold">Presensi Guru</div>
            </nav>
            <div class="p-4">
                <slot />
            </div>
        </div>
        <div class="drawer-side is-drawer-close:overflow-visible">
            <label for="my-drawer-4" aria-label="close sidebar" class="drawer-overlay"></label>
            <div class="flex min-h-full flex-col items-start bg-base-200 is-drawer-close:w-14 is-drawer-open:w-52">

                <div class="p-4 w-full border-b border-base-300">
                    <div class="is-drawer-close:hidden flex items-center gap-3">
                        <img src="https://ui-avatars.com/api/?name=Presensi+Guru&background=0D8ABC&color=fff&size=128"
                            alt="Logo Presensi Guru" class="w-10 h-10 rounded" />
                        <div>
                            <h2 class="font-bold text-base">Presensi Guru</h2>
                            <p class="text-xs opacity-60">Sistem Absensi</p>
                        </div>
                    </div>
                </div>

                <ul class="menu w-full grow border-r border-base-300 bg-base-200 p-2 gap-1">
                    <li>
                        <NuxtLink to="/" class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                            data-tip="Homepage">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                                stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                                class="my-1.5 inline-block size-4">
                                <path d="M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"></path>
                                <path
                                    d="M3 10a2 2 0 0 1 .709-1.528l7-5.999a2 2 0 0 1 2.582 0l7 5.999A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z">
                                </path>
                            </svg>
                            <span class="is-drawer-close:hidden">Dashboard</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/settings" class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                            data-tip="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                                stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                                class="my-1.5 inline-block size-4">
                                <path d="M20 7h-9"></path>
                                <path d="M14 17H5"></path>
                                <circle cx="17" cy="17" r="3"></circle>
                                <circle cx="7" cy="7" r="3"></circle>
                            </svg>
                            <span class="is-drawer-close:hidden">Data Kelas</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/settings" class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                            data-tip="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                                stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                                class="my-1.5 inline-block size-4">
                                <path d="M20 7h-9"></path>
                                <path d="M14 17H5"></path>
                                <circle cx="17" cy="17" r="3"></circle>
                                <circle cx="7" cy="7" r="3"></circle>
                            </svg>
                            <span class="is-drawer-close:hidden">Mata Pelajaran</span>
                        </NuxtLink>
                    </li>
                    <li>
                        <NuxtLink to="/settings" class="is-drawer-close:tooltip is-drawer-close:tooltip-right"
                            data-tip="Settings">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" stroke-linejoin="round"
                                stroke-linecap="round" stroke-width="2" fill="none" stroke="currentColor"
                                class="my-1.5 inline-block size-4">
                                <path d="M20 7h-9"></path>
                                <path d="M14 17H5"></path>
                                <circle cx="17" cy="17" r="3"></circle>
                                <circle cx="7" cy="7" r="3"></circle>
                            </svg>
                            <span class="is-drawer-close:hidden">Jadwal Pelajaran</span>
                        </NuxtLink>
                    </li>
                </ul>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const drawerCheckbox = ref(null)

onMounted(() => {
    const handleResize = () => {
        if (drawerCheckbox.value) {
            drawerCheckbox.value.checked = window.innerWidth >= 1024
        }
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
})
</script>