<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Header Section -->
    <div class="bg-white shadow-sm border-b border-gray-200">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div class="py-6">
          <h1 class="text-2xl font-bold text-gray-900">Tentang Kami</h1>
          <p class="mt-1 text-sm text-gray-500">
            Kenali tim dan teknologi di balik sistem presensi ini
          </p>
        </div>
      </div>
    </div>

    <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Hero Section -->
      <div
        class="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl shadow-xl overflow-hidden"
      >
        <div class="px-8 py-12 sm:px-12 sm:py-16">
          <div class="max-w-3xl">
            <div class="flex items-center gap-3 mb-6">
              <div
                class="h-16 w-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center"
              >
                <GraduationCap class="h-10 w-10 text-white" />
              </div>
              <div>
                <h2 class="text-3xl sm:text-4xl font-bold text-white">
                  Sistem Presensi Guru
                </h2>
                <p class="text-blue-100 text-sm mt-1">
                  Solusi Digital untuk Manajemen Kehadiran
                </p>
              </div>
            </div>

            <p class="text-lg text-blue-50 leading-relaxed mb-6">
              Sistem informasi berbasis web yang dirancang untuk memudahkan
              pengelolaan presensi guru di sekolah. Dibangun dengan teknologi
              modern dan user-friendly interface untuk meningkatkan efisiensi
              administrasi sekolah.
            </p>

            <div class="flex flex-wrap gap-3">
              <span
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white"
              >
                <Calendar class="h-4 w-4 mr-2" />
                2025/2026
              </span>
              <span
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white"
              >
                <Rocket class="h-4 w-4 mr-2" />
                Production Ready
              </span>
              <span
                class="inline-flex items-center px-4 py-2 rounded-full text-sm font-medium bg-white/20 backdrop-blur-sm text-white"
              >
                <Users class="h-4 w-4 mr-2" />
                Tim 4 Orang
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Latar Belakang -->
      <div class="bg-white rounded-xl shadow p-8">
        <div class="flex items-center gap-3 mb-6">
          <div
            class="h-12 w-12 rounded-xl bg-blue-100 flex items-center justify-center"
          >
            <BookOpen class="h-6 w-6 text-blue-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Latar Belakang</h3>
        </div>

        <div class="prose max-w-none text-gray-600 space-y-4">
          <p class="text-base leading-relaxed">
            Sistem Presensi Guru ini awalnya dimulai sebagai project
            <span class="font-semibold text-gray-900"
              >Uji Kompetensi Keahlian (UKK)</span
            >
            untuk siswa kelas 12 SMK jurusan Rekayasa Perangkat Lunak. Namun,
            melihat potensi dan manfaat nyata yang dapat diberikan, kami
            memutuskan untuk mengembangkannya menjadi
            <span class="font-semibold text-gray-900"
              >sistem production-ready</span
            >
            yang dapat diimplementasikan di sekolah-sekolah secara real.
          </p>

          <p class="text-base leading-relaxed">
            Kami mengidentifikasi bahwa banyak sekolah masih menggunakan sistem
            presensi manual yang memakan waktu, rentan terhadap kesalahan, dan
            sulit untuk dianalisis. Melalui observasi dan wawancara dengan
            beberapa guru dan admin sekolah, kami mengembangkan solusi digital
            yang tidak hanya memenuhi kebutuhan akademis, tetapi juga dapat
            membantu pihak sekolah dalam mengelola presensi guru secara lebih
            efisien, akurat, dan real-time dalam operasional sehari-hari.
          </p>

          <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            <div class="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <div class="flex items-center gap-2 mb-2">
                <Target class="h-5 w-5 text-blue-600" />
                <h4 class="font-semibold text-gray-900">Tujuan</h4>
              </div>
              <p class="text-sm text-gray-600">
                Memudahkan monitoring kehadiran guru secara real-time dan akurat
              </p>
            </div>

            <div class="bg-green-50 rounded-lg p-4 border border-green-100">
              <div class="flex items-center gap-2 mb-2">
                <CheckCircle class="h-5 w-5 text-green-600" />
                <h4 class="font-semibold text-gray-900">Manfaat</h4>
              </div>
              <p class="text-sm text-gray-600">
                Mengurangi beban administrasi dan meningkatkan efisiensi sekolah
              </p>
            </div>

            <div class="bg-purple-50 rounded-lg p-4 border border-purple-100">
              <div class="flex items-center gap-2 mb-2">
                <Lightbulb class="h-5 w-5 text-purple-600" />
                <h4 class="font-semibold text-gray-900">Inovasi</h4>
              </div>
              <p class="text-sm text-gray-600">
                Digitalisasi sistem presensi dengan teknologi web modern
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Tech Stack -->
      <div class="bg-white rounded-xl shadow p-8">
        <div class="flex items-center gap-3 mb-6">
          <div
            class="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center"
          >
            <Code2 class="h-6 w-6 text-purple-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900">
            Teknologi yang Digunakan
          </h3>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Frontend -->
          <div
            class="border-2 border-green-200 rounded-xl p-6 bg-gradient-to-br from-green-50 to-white"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="h-10 w-10 rounded-lg bg-green-600 flex items-center justify-center"
              >
                <Monitor class="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900">Frontend</h4>
                <p class="text-sm text-gray-500">User Interface & Experience</p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100"
              >
                <img
                  src="https://nuxt.com/icon.png"
                  alt="Nuxt"
                  class="h-8 w-8"
                />
                <div>
                  <p class="font-semibold text-gray-900">Nuxt.js 3</p>
                  <p class="text-xs text-gray-500">Vue Framework untuk SSR</p>
                </div>
              </div>

              <div
                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100"
              >
                <div
                  class="h-8 w-8 rounded bg-blue-500 flex items-center justify-center"
                >
                  <span class="text-white font-bold text-xs">CSS</span>
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Tailwind CSS</p>
                  <p class="text-xs text-gray-500">
                    Utility-first CSS Framework
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-green-100"
              >
                <div
                  class="h-8 w-8 rounded bg-orange-500 flex items-center justify-center"
                >
                  <Palette class="h-5 w-5 text-white" />
                </div>
                <div>
                  <p class="font-semibold text-gray-900">Lucide Icons</p>
                  <p class="text-xs text-gray-500">Beautiful Icon Library</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Backend -->
          <div
            class="border-2 border-yellow-200 rounded-xl p-6 bg-gradient-to-br from-yellow-50 to-white"
          >
            <div class="flex items-center gap-3 mb-4">
              <div
                class="h-10 w-10 rounded-lg bg-yellow-600 flex items-center justify-center"
              >
                <Server class="h-6 w-6 text-white" />
              </div>
              <div>
                <h4 class="text-lg font-semibold text-gray-900">Backend</h4>
                <p class="text-sm text-gray-500">Server & Database Logic</p>
              </div>
            </div>

            <div class="space-y-3">
              <div
                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-100"
              >
                <img
                  src="https://i.pinimg.com/736x/40/e9/7a/40e97aae3a908371bbd98e3fa4cc845c.jpg"
                  alt="Express"
                  class="h-8 w-8"
                />
                <div>
                  <p class="font-semibold text-gray-900">Express.js</p>
                  <p class="text-xs text-gray-500">
                    Fast Node.js Web Framework
                  </p>
                </div>
              </div>

              <div
                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-100"
              >
                <Database class="h-8 w-8 text-blue-600" />
                <div>
                  <p class="font-semibold text-gray-900">MySQL</p>
                  <p class="text-xs text-gray-500">Relational Database</p>
                </div>
              </div>

              <div
                class="flex items-center gap-3 p-3 bg-white rounded-lg border border-yellow-100"
              >
                <Shield class="h-8 w-8 text-green-600" />
                <div>
                  <p class="font-semibold text-gray-900">JWT Authentication</p>
                  <p class="text-xs text-gray-500">Secure Token-based Auth</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Additional Tools -->
        <div class="mt-6 pt-6 border-t border-gray-200">
          <h4 class="text-sm font-semibold text-gray-700 mb-4">
            Tools & DevOps
          </h4>
          <div class="flex flex-wrap gap-3">
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
            >
              <GitBranch class="h-4 w-4 mr-2" />
              Git & GitHub
            </span>
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
            >
              <Package class="h-4 w-4 mr-2" />
              npm / yarn
            </span>
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
            >
              <Terminal class="h-4 w-4 mr-2" />
              VS Code
            </span>
            <span
              class="inline-flex items-center px-3 py-1.5 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 border border-gray-200"
            >
              <FileCode class="h-4 w-4 mr-2" />
              Postman
            </span>
          </div>
        </div>
      </div>

      <!-- Our Team -->
      <div class="bg-white rounded-xl shadow p-8">
        <div class="flex items-center gap-3 mb-8">
          <div
            class="h-12 w-12 rounded-xl bg-indigo-100 flex items-center justify-center"
          >
            <Users class="h-6 w-6 text-indigo-600" />
          </div>
          <div>
            <h3 class="text-2xl font-bold text-gray-900">Tim Kami</h3>
            <p class="text-sm text-gray-500">4 Developer yang berdedikasi</p>
          </div>
        </div>

        <!-- Foto Bersama -->
        <div
          class="mb-10 rounded-2xl overflow-hidden shadow-lg group relative bg-gray-100 w-full h-64 sm:h-80 md:h-[400px] flex items-center justify-center"
        >
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80"
            alt="Foto Bersama Tim"
            class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
          <div
            class="absolute inset-0 bg-gradient-to-t from-gray-900/80 via-gray-900/20 to-transparent flex items-end"
          >
            <div class="p-6 sm:p-8 w-full">
              <div class="flex items-center gap-2 text-white mb-2">
                <Camera class="h-6 w-6 text-blue-400" />
                <h4 class="text-2xl font-bold">Tim Development</h4>
              </div>
              <p class="text-gray-200 text-sm sm:text-base max-w-2xl">
                Kolaborasi solid antara Frontend dan Backend Developer dalam
                menghadirkan sistem presensi yang modern dan reliable untuk
                dunia pendidikan.
              </p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <!-- Team Member 1 - Frontend (SWAPPED - was developer 2) -->
          <div
            class="group relative bg-gradient-to-br from-green-50 to-white border-2 border-green-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="absolute top-4 right-4">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                Frontend
              </span>
            </div>

            <div
              class="relative w-24 h-24 mx-auto mb-4 group/photo group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src="/team/rifqy.jpeg"
                alt="Foto Profil"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg bg-green-50"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 h-48 opacity-0 invisible group-hover/photo:opacity-100 group-hover/photo:visible transition-all duration-300 pointer-events-none z-50 rounded-xl overflow-hidden shadow-2xl border-4 border-white scale-95 group-hover/photo:scale-100 origin-bottom"
              >
                <img
                  src="/team/rifqy.jpeg"
                  alt="Full Image"
                  class="w-full h-full object-cover bg-white"
                />
              </div>
            </div>

            <div class="text-center">
              <h4 class="text-lg font-bold text-gray-900">
                Rifqy Aliansyah Assidik
              </h4>
              <p class="text-sm text-gray-500 mb-2">Frontend Developer</p>

              <div class="relative group/quote cursor-pointer mb-4">
                <p class="text-xs text-gray-600 line-clamp-2 italic px-2">
                  "Fokus di state management dan integrasi API agar web selalu
                  nyambung dan dinamis."
                </p>
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900/95 backdrop-blur-sm text-gray-50 text-xs rounded-xl p-3 opacity-0 invisible group-hover/quote:opacity-100 group-hover/quote:visible transition-all duration-300 z-50 shadow-xl scale-95 group-hover/quote:scale-100 origin-bottom"
                >
                  "Fokus di state management dan integrasi API agar web selalu
                  nyambung dan dinamis."
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"
                  ></div>
                </div>
              </div>

              <div class="flex justify-center gap-3 mb-4">
                <a
                  href="#"
                  class="text-gray-400 hover:text-gray-900 transition-colors"
                  ><Github class="w-4 h-4"
                /></a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-pink-600 transition-colors"
                  ><Instagram class="w-4 h-4"
                /></a>
              </div>

              <div class="space-y-2 text-left pt-4 border-t border-green-50">
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <Palette class="h-3 w-3 text-green-600" />
                  <span>Design System</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <Zap class="h-3 w-3 text-green-600" />
                  <span>State Management</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <RefreshCw class="h-3 w-3 text-green-600" />
                  <span>API Integration</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Member 2 - Frontend -->
          <div
            class="group relative bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="absolute top-4 right-4">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800"
              >
                Frontend
              </span>
            </div>

            <div
              class="relative w-24 h-24 mx-auto mb-4 group/photo group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src="/team/nesya.jpeg"
                alt="Foto Profil"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg bg-blue-50"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 h-48 opacity-0 invisible group-hover/photo:opacity-100 group-hover/photo:visible transition-all duration-300 pointer-events-none z-50 rounded-xl overflow-hidden shadow-2xl border-4 border-white scale-95 group-hover/photo:scale-100 origin-bottom"
              >
                <img
                  src="/team/nesya.jpeg"
                  alt="Full Image"
                  class="w-full h-full object-cover bg-white"
                />
              </div>
            </div>

            <div class="text-center">
              <h4 class="text-lg font-bold text-gray-900">Nesya Alviani</h4>
              <p class="text-sm text-gray-500 mb-2">Frontend Developer</p>

              <div class="relative group/quote cursor-pointer mb-4">
                <p class="text-xs text-gray-600 line-clamp-2 italic px-2">
                  "Senang mengulik desain UI/UX dan bikin web tampil interaktif
                  dan responsif."
                </p>
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900/95 backdrop-blur-sm text-gray-50 text-xs rounded-xl p-3 opacity-0 invisible group-hover/quote:opacity-100 group-hover/quote:visible transition-all duration-300 z-50 shadow-xl scale-95 group-hover/quote:scale-100 origin-bottom"
                >
                  "Senang mengulik desain UI/UX dan bikin web tampil interaktif
                  dan responsif."
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"
                  ></div>
                </div>
              </div>

              <div class="flex justify-center gap-3 mb-4">
                <a
                  href="#"
                  class="text-gray-400 hover:text-gray-900 transition-colors"
                  ><Github class="w-4 h-4"
                /></a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-pink-600 transition-colors"
                  ><Instagram class="w-4 h-4"
                /></a>
              </div>

              <div class="space-y-2 text-left pt-4 border-t border-blue-50">
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <Code class="h-3 w-3 text-blue-600" />
                  <span>UI/UX Implementation</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <Layout class="h-3 w-3 text-blue-600" />
                  <span>Component Development</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <Sparkles class="h-3 w-3 text-blue-600" />
                  <span>Responsive Design</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Member 3 - Backend -->
          <div
            class="group relative bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="absolute top-4 right-4">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800"
              >
                Backend
              </span>
            </div>

            <div
              class="relative w-24 h-24 mx-auto mb-4 group/photo group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf"
                alt="Foto Profil"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg bg-yellow-50"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 h-48 opacity-0 invisible group-hover/photo:opacity-100 group-hover/photo:visible transition-all duration-300 pointer-events-none z-50 rounded-xl overflow-hidden shadow-2xl border-4 border-white scale-95 group-hover/photo:scale-100 origin-bottom"
              >
                <img
                  src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix&backgroundColor=ffdfbf"
                  alt="Full Image"
                  class="w-full h-full object-cover bg-white"
                />
              </div>
            </div>

            <div class="text-center">
              <h4 class="text-lg font-bold text-gray-900">Nama Developer 3</h4>
              <p class="text-sm text-gray-500 mb-2">Backend Developer</p>

              <div class="relative group/quote cursor-pointer mb-4">
                <p class="text-xs text-gray-600 line-clamp-2 italic px-2">
                  "Menyukai bagian logika di balik layar, query database, dan
                  flow data."
                </p>
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900/95 backdrop-blur-sm text-gray-50 text-xs rounded-xl p-3 opacity-0 invisible group-hover/quote:opacity-100 group-hover/quote:visible transition-all duration-300 z-50 shadow-xl scale-95 group-hover/quote:scale-100 origin-bottom"
                >
                  "Menyukai bagian logika di balik layar, query database, dan
                  flow data."
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"
                  ></div>
                </div>
              </div>

              <div class="flex justify-center gap-3 mb-4">
                <a
                  href="#"
                  class="text-gray-400 hover:text-gray-900 transition-colors"
                  ><Github class="w-4 h-4"
                /></a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-pink-600 transition-colors"
                  ><Instagram class="w-4 h-4"
                /></a>
              </div>

              <div class="space-y-2 text-left pt-4 border-t border-yellow-50">
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <Server class="h-3 w-3 text-yellow-600" />
                  <span>API Development</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <Database class="h-3 w-3 text-yellow-600" />
                  <span>Database Design</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <Shield class="h-3 w-3 text-yellow-600" />
                  <span>Authentication & Security</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Team Member 4 - Backend -->
          <div
            class="group relative bg-gradient-to-br from-purple-50 to-white border-2 border-purple-100 rounded-xl p-6 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
          >
            <div class="absolute top-4 right-4">
              <span
                class="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800"
              >
                Backend
              </span>
            </div>

            <div
              class="relative w-24 h-24 mx-auto mb-4 group/photo group-hover:scale-105 transition-transform duration-300 cursor-pointer"
            >
              <img
                src="/team/karisma.jpeg"
                alt="Foto profil"
                class="w-full h-full object-cover rounded-full border-4 border-white shadow-lg bg-purple-50"
              />
              <div
                class="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-48 h-48 opacity-0 invisible group-hover/photo:opacity-100 group-hover/photo:visible transition-all duration-300 pointer-events-none z-50 rounded-xl overflow-hidden shadow-2xl border-4 border-white scale-95 group-hover/photo:scale-100 origin-bottom"
              >
                <img
                  src="/team/karisma.jpeg"
                  alt="Full Image"
                  class="w-full h-full object-cover bg-white"
                />
              </div>
            </div>

            <div class="text-center">
              <h4 class="text-lg font-bold text-gray-900">
                Karisma Dwi Anjani
              </h4>
              <p class="text-sm text-gray-500 mb-2">Backend Developer</p>

              <div class="relative group/quote cursor-pointer mb-4">
                <p class="text-xs text-gray-600 line-clamp-2 italic px-2">
                  "Tertarik untuk explore server, keamanan data, serta validasi
                  backend yang kuat."
                </p>
                <div
                  class="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-56 bg-gray-900/95 backdrop-blur-sm text-gray-50 text-xs rounded-xl p-3 opacity-0 invisible group-hover/quote:opacity-100 group-hover/quote:visible transition-all duration-300 z-50 shadow-xl scale-95 group-hover/quote:scale-100 origin-bottom"
                >
                  "Tertarik untuk explore server, keamanan data, serta validasi
                  backend yang kuat."
                  <div
                    class="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900/95"
                  ></div>
                </div>
              </div>

              <div class="flex justify-center gap-3 mb-4">
                <a
                  href="#"
                  class="text-gray-400 hover:text-gray-900 transition-colors"
                  ><Github class="w-4 h-4"
                /></a>
                <a
                  href="#"
                  class="text-gray-400 hover:text-pink-600 transition-colors"
                  ><Instagram class="w-4 h-4"
                /></a>
              </div>

              <div class="space-y-2 text-left pt-4 border-t border-purple-50">
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <CloudCog class="h-3 w-3 text-purple-600" />
                  <span>Server Management</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <Lock class="h-3 w-3 text-purple-600" />
                  <span>Data Validation</span>
                </div>
                <div class="flex items-center gap-2 text-xs text-gray-600">
                  <FileCode class="h-3 w-3 text-purple-600" />
                  <span>Business Logic</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Features -->
      <div class="bg-white rounded-xl shadow p-8">
        <div class="flex items-center gap-3 mb-6">
          <div
            class="h-12 w-12 rounded-xl bg-green-100 flex items-center justify-center"
          >
            <Star class="h-6 w-6 text-green-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900">Fitur Utama Sistem</h3>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div
            class="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div
              class="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0"
            >
              <CheckCircle class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">
                Presensi Real-time
              </h4>
              <p class="text-sm text-gray-600">
                Monitoring kehadiran guru secara langsung
              </p>
            </div>
          </div>

          <div
            class="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div
              class="h-8 w-8 rounded-lg bg-green-600 flex items-center justify-center flex-shrink-0"
            >
              <BarChart3 class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">
                Laporan & Statistik
              </h4>
              <p class="text-sm text-gray-600">
                Dashboard analitik kehadiran lengkap
              </p>
            </div>
          </div>

          <div
            class="flex items-start gap-3 p-4 bg-purple-50 rounded-lg border border-purple-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div
              class="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0"
            >
              <Users class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">User Management</h4>
              <p class="text-sm text-gray-600">
                Kelola data user dan hak akses
              </p>
            </div>
          </div>

          <div
            class="flex items-start gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div
              class="h-8 w-8 rounded-lg bg-yellow-600 flex items-center justify-center flex-shrink-0"
            >
              <Calendar class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">Jadwal Mengajar</h4>
              <p class="text-sm text-gray-600">
                Manajemen jadwal dan kelas guru
              </p>
            </div>
          </div>

          <div
            class="flex items-start gap-3 p-4 bg-teal-50 rounded-lg border border-teal-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div
              class="h-8 w-8 rounded-lg bg-teal-600 flex items-center justify-center flex-shrink-0"
            >
              <FileSpreadsheet class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">Import Data</h4>
              <p class="text-sm text-gray-600">
                Import data guru via file Excel/CSV
              </p>
            </div>
          </div>

          <div
            class="flex items-start gap-3 p-4 bg-indigo-50 rounded-lg border border-indigo-100 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          >
            <div
              class="h-8 w-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0"
            >
              <Shield class="h-5 w-5 text-white" />
            </div>
            <div>
              <h4 class="font-semibold text-gray-900 mb-1">Keamanan Data</h4>
              <p class="text-sm text-gray-600">
                Enkripsi & autentikasi yang aman
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Development Journey -->
      <div class="bg-white rounded-xl shadow p-8">
        <div class="flex items-center gap-3 mb-6">
          <div
            class="h-12 w-12 rounded-xl bg-orange-100 flex items-center justify-center"
          >
            <Rocket class="h-6 w-6 text-orange-600" />
          </div>
          <h3 class="text-2xl font-bold text-gray-900">
            Perjalanan Development
          </h3>
        </div>

        <div class="space-y-6">
          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div
                class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
              >
                <CheckCircle class="h-5 w-5 text-green-600" />
              </div>
              <div class="w-0.5 h-full bg-green-200 mt-2"></div>
            </div>
            <div class="pb-6 flex-1">
              <h4 class="font-semibold text-gray-900">Research & Planning</h4>
              <p class="text-sm text-gray-500 mb-2">Fase Awal</p>
              <p class="text-sm text-gray-600">
                Riset kebutuhan sekolah, wawancara dengan guru dan admin,
                analisis sistem yang ada, dan perancangan solusi yang tepat
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div
                class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
              >
                <CheckCircle class="h-5 w-5 text-green-600" />
              </div>
              <div class="w-0.5 h-full bg-green-200 mt-2"></div>
            </div>
            <div class="pb-6 flex-1">
              <h4 class="font-semibold text-gray-900">Design & Prototyping</h4>
              <p class="text-sm text-gray-500 mb-2">Fase Desain</p>
              <p class="text-sm text-gray-600">
                Pembuatan wireframe, design system, database schema, dan
                prototype UI/UX untuk validasi konsep
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div
                class="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0"
              >
                <CheckCircle class="h-5 w-5 text-green-600" />
              </div>
              <div class="w-0.5 h-full bg-green-200 mt-2"></div>
            </div>
            <div class="pb-6 flex-1">
              <h4 class="font-semibold text-gray-900">
                Development & Integration
              </h4>
              <p class="text-sm text-gray-500 mb-2">Fase Development</p>
              <p class="text-sm text-gray-600">
                Sprint development frontend & backend, integrasi API,
                implementasi fitur-fitur utama, dan continuous testing
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div
                class="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center flex-shrink-0"
              >
                <Loader class="h-5 w-5 text-blue-600" />
              </div>
              <div class="w-0.5 h-full bg-blue-200 mt-2"></div>
            </div>
            <div class="pb-6 flex-1">
              <h4 class="font-semibold text-gray-900">Testing & Refinement</h4>
              <p class="text-sm text-gray-500 mb-2">Ongoing</p>
              <p class="text-sm text-gray-600">
                User acceptance testing, bug fixing, performance optimization,
                dan improvement based on feedback
              </p>
            </div>
          </div>

          <div class="flex gap-4">
            <div class="flex flex-col items-center">
              <div
                class="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0"
              >
                <Rocket class="h-5 w-5 text-gray-400" />
              </div>
            </div>
            <div class="flex-1">
              <h4 class="font-semibold text-gray-900">Production Deployment</h4>
              <p class="text-sm text-gray-500 mb-2">Coming Soon</p>
              <p class="text-sm text-gray-600">
                Server setup, database migration, final security audit, dan
                launch ke production environment untuk implementasi di sekolah
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Contact/Footer Info -->
      <div
        class="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl shadow-xl p-8 text-white"
      >
        <div class="text-center max-w-2xl mx-auto">
          <h3 class="text-2xl font-bold mb-3">Terima Kasih!</h3>
          <p class="text-gray-300 mb-6">
            Dari project UKK hingga menjadi sistem production-ready, perjalanan
            ini mengajarkan kami banyak hal tentang pengembangan software yang
            real dan impactful untuk dunia pendidikan.
          </p>

          <div class="flex flex-wrap justify-center gap-4">
            <div
              class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <GraduationCap class="h-5 w-5" />
              <span class="text-sm">SMK RPL</span>
            </div>
            <div
              class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <Award class="h-5 w-5" />
              <span class="text-sm">2025/2026</span>
            </div>
            <div
              class="flex items-center gap-2 px-4 py-2 bg-white/10 rounded-lg backdrop-blur-sm"
            >
              <Code2 class="h-5 w-5" />
              <span class="text-sm">Full-Stack Project</span>
            </div>
          </div>

          <p class="text-gray-400 text-sm mt-8">
            SMKN 1 Cisarua &copy; {{ new Date().getFullYear() }}.
          </p>
        </div>
      </div>
    </div>

    <!-- Image Modal -->
    <div
      v-if="showModal"
      @click="closeModal"
      class="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in"
    >
      <div class="relative max-w-2xl w-full" @click.stop>
        <button
          @click="closeModal"
          class="absolute -top-12 right-0 text-white hover:text-gray-300 transition-colors"
        >
          <X class="h-8 w-8" />
        </button>
        <img
          :src="modalImage"
          alt="Full Image"
          class="w-full h-auto rounded-2xl shadow-2xl animate-scale-in"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import {
  GraduationCap,
  Calendar,
  Award,
  Users,
  BookOpen,
  Target,
  CheckCircle,
  Lightbulb,
  Code2,
  Monitor,
  Server,
  Database,
  Shield,
  Palette,
  GitBranch,
  Package,
  Terminal,
  FileCode,
  Code,
  Layout,
  Sparkles,
  Zap,
  RefreshCw,
  CloudCog,
  Lock,
  Star,
  BarChart3,
  Bell,
  Clock,
  Loader,
  FileSpreadsheet,
  Github,
  Instagram,
  Camera,
  Rocket,
  ZoomIn,
  X,
} from "lucide-vue-next";

// Image Modal
const showModal = ref(false);
const modalImage = ref("");

const showImageModal = (imageUrl) => {
  modalImage.value = imageUrl;
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  modalImage.value = "";
};
</script>

<style scoped>
.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

.animate-scale-in {
  animation: scaleIn 0.3s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes scaleIn {
  from {
    transform: scale(0.9);
    opacity: 0;
  }
  to {
    transform: scale(1);
    opacity: 1;
  }
}
</style>
