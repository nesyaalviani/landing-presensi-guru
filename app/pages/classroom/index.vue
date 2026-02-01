<template>
    <section class="px-4 sm:px-6 lg:px-8 py-8 bg-white">
        <div class="mx-auto max-w-7xl">
            <!-- Search and Filter Bar -->
            <div class="mb-6 flex flex-col sm:flex-row gap-3 items-center justify-between">
                <div class="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                    <!-- Search -->
                    <div class="relative w-full sm:w-56">
                        <Search class="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                        <input type="text" placeholder="Cari nama kelas..."
                            class="w-full pl-9 pr-3 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none" />
                    </div>

                    <!-- Filter Jurusan -->
                    <div class="relative w-full sm:w-44">
                        <select
                            class="w-full pl-3 pr-8 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-gray-700">
                            <option value="">Semua Jurusan</option>
                            <option value="rpl">Rekayasa Perangkat Lunak</option>
                            <option value="rpl">Perhotelan</option>
                        </select>
                        <ChevronDown
                            class="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>

                    <!-- Filter Tingkat -->
                    <div class="relative w-full sm:w-32">
                        <select
                            class="w-full pl-3 pr-8 py-2 text-sm border border-gray-500 rounded-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none appearance-none bg-white text-gray-700">
                            <option value="">Tingkat</option>
                            <option value="10">X</option>
                            <option value="11">XI</option>
                            <option value="12">XII</option>
                        </select>
                        <ChevronDown
                            class="absolute right-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                </div>

                <!-- Tambah Button -->
                <div class="flex items-center w-full sm:w-auto">
                    <NuxtLink
                        to="/classroom/create"
                        class="w-full sm:w-auto flex items-center justify-center gap-2 rounded-sm bg-blue-500 px-4 py-2 text-sm font-semibold text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-600 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out shadow-md hover:shadow-lg">
                        <Plus class="h-4 w-4 transition-transform duration-200 group-hover:rotate-90" />
                        Tambah
                    </NuxtLink>
                </div>
            </div>

            <!-- Table Card -->
            <div class="bg-white shadow overflow-hidden rounded-sm">
                <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                        <thead class="bg-gray-100">
                            <tr>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Nama Kelas
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Jurusan
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Tingkat
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Status
                                </th>
                                <th scope="col"
                                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Aksi
                                </th>
                            </tr>
                        </thead>
                        <tbody class="bg-white divide-y divide-gray-200">
                            <!-- Row 1 -->
                            <tr class="hover:bg-gray-50 transition-colors">
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                    XII RPL 1
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    Rekayasa Perangkat Lunak
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                    XII
                                </td>
                                <td class="px-6 py-4 whitespace-nowrap">
                                    <span
                                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                        Aktif
                                    </span>
                                </td>

                                <td class="px-6 py-4 whitespace-nowrap">
                                    <div class="flex items-center gap-2">
                                        <button
                                            class="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                                            title="Edit">
                                            <Pencil class="h-4 w-4" />
                                        </button>
                                        <button class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                                            title="Delete">
                                            <ToggleLeft class="h-6 w-6" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div class="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
                <div class="flex items-center justify-between">
                    <div class="flex-1 flex justify-between sm:hidden">
                        <button
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Previous
                        </button>
                        <button
                            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                            Next
                        </button>
                    </div>
                    <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                        <div>
                        </div>
                        <div>
                            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                                <button
                                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <ChevronLeft class="h-5 w-5" />
                                </button>
                                <button
                                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-blue-50 text-sm font-medium text-blue-600">
                                    1
                                </button>
                                <button
                                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    2
                                </button>
                                <button
                                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium text-gray-700 hover:bg-gray-50">
                                    3
                                </button>
                                <button
                                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50">
                                    <ChevronRight class="h-5 w-5" />
                                </button>
                            </nav>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { Search, ChevronRight, ChevronLeft, Plus, Pencil, ToggleLeft, ChevronDown } from 'lucide-vue-next'
</script>