<template>
    <div class="min-h-screen bg-gray-100 flex flex-col">

        <!-- TOP BAR - DIBUAT LEBIH RAPIH -->
        <div class="bg-white border-b border-gray-200 px-4 sm:px-8 py-4 flex items-center justify-between shadow-sm">
            <div class="flex items-center gap-4">
                <button @click="$router.back()"
                    class="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 transition-colors">
                    <ArrowLeft class="h-4 w-4" />
                    <span>Kembali</span>
                </button>
                <div class="w-px h-5 bg-gray-300"></div>
                <span class="text-sm text-gray-700">Preview Laporan PDF</span>
            </div>
            <button @click="generatePdf" :disabled="generating"
                class="flex items-center gap-2 px-5 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white text-sm font-medium rounded transition-colors shadow-sm">
                <Download v-if="!generating" class="h-4 w-4" />
                <span v-else
                    class="inline-block h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                {{ generating ? 'Menyiapkan...' : 'Unduh PDF' }}
            </button>
        </div>

        <!-- BODY: FLEX ROW -->
        <div class="flex flex-1">

            <!-- SIDEBAR FILTER - DIBUAT LEBIH RAPIH, TIDAK STICKY -->
            <aside
                class="w-64 flex-shrink-0 bg-white border-r border-gray-200 flex flex-col gap-4 p-5 h-screen overflow-y-auto">
                <div class="border-b border-gray-200 pb-3">
                    <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Filter Laporan</p>
                </div>

                <!-- Periode -->
                <div class="flex flex-col gap-2">
                    <label class="text-xs font-medium text-gray-600">Periode</label>
                    <div class="relative" ref="periodeRef">
                        <button @click.stop="periodeOpen = !periodeOpen"
                            class="w-full flex items-center justify-between px-3 py-2 text-sm border rounded bg-white text-gray-700 hover:border-gray-400 transition"
                            :class="periodeOpen ? 'border-blue-500' : 'border-gray-300'">
                            <span>{{PERIODE_LIST.find(p => p.value === selectedPeriode)?.label || 'Pilih Periode'}}</span>
                            <ChevronDown class="h-4 w-4 text-gray-400 transition-transform"
                                :class="{ 'rotate-180': periodeOpen }" />
                        </button>
                        <div v-if="periodeOpen"
                            class="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg">
                            <ul class="py-1">
                                <li v-for="p in PERIODE_LIST" :key="p.value" @mousedown.prevent="selectPeriode(p)"
                                    class="px-3 py-2 text-sm cursor-pointer"
                                    :class="selectedPeriode === p.value ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'">
                                    {{ p.label }}
                                </li>
                                <li @mousedown.prevent="selectPeriode({ value: 'custom', label: 'Rentang Tanggal' })"
                                    class="px-3 py-2 text-sm cursor-pointer border-t border-gray-100"
                                    :class="selectedPeriode === 'custom' ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-500 hover:bg-gray-50'">
                                    Rentang Tanggal...
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Custom Range -->
                <Transition name="slide">
                    <div v-if="selectedPeriode === 'custom'"
                        class="flex flex-col gap-3 mt-1 pl-2 border-l-2 border-blue-300">
                        <div class="flex flex-col gap-1">
                            <label class="text-xs text-gray-500">Dari Tanggal</label>
                            <input v-model="dateFrom" type="date"
                                class="w-full px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                        </div>
                        <div class="flex flex-col gap-1">
                            <label class="text-xs text-gray-500">Sampai Tanggal</label>
                            <input v-model="dateTo" type="date"
                                class="w-full px-3 py-2 text-sm border border-gray-300 rounded outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-200" />
                        </div>
                    </div>
                </Transition>

                <!-- Kelas -->
                <div class="flex flex-col gap-2">
                    <label class="text-xs font-medium text-gray-600">Kelas</label>
                    <div class="relative" ref="kelasRef">
                        <div class="flex items-center border rounded bg-white overflow-hidden focus-within:border-blue-500 focus-within:ring-1 focus-within:ring-blue-200"
                            :class="kelasOpen ? 'border-blue-500' : 'border-gray-300'">
                            <input v-model="kelasSearch" type="text" placeholder="Semua Kelas"
                                class="flex-1 min-w-0 px-3 py-2 text-sm outline-none bg-transparent text-gray-700 placeholder-gray-400"
                                @click.stop="openKelas" />
                            <button @click.stop="openKelas" class="px-3 py-2 text-gray-400 flex-shrink-0">
                                <ChevronDown class="h-4 w-4 transition-transform"
                                    :class="{ 'rotate-180': kelasOpen }" />
                            </button>
                        </div>
                        <div v-if="kelasOpen"
                            class="absolute z-30 w-full mt-1 bg-white border border-gray-200 rounded shadow-lg">
                            <ul class="custom-scroll max-h-48 overflow-y-auto py-1">
                                <li @mousedown.prevent="selectKelas(null)" class="px-3 py-2 text-sm cursor-pointer"
                                    :class="!selectedKelas ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-600 hover:bg-gray-50'">
                                    Semua Kelas
                                </li>
                                <li v-for="k in filteredKelas" :key="k.id" @mousedown.prevent="selectKelas(k)"
                                    class="px-3 py-2 text-sm cursor-pointer"
                                    :class="selectedKelas === k.id ? 'bg-blue-50 text-blue-700 font-medium' : 'text-gray-700 hover:bg-gray-50'">
                                    {{ k.name }}
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                <!-- Tombol Aksi -->
                <div class="flex gap-2 mt-2">
                    <button v-if="selectedKelas || selectedPeriode !== 'bulan'" @click="resetFilter"
                        class="flex-1 text-xs text-red-500 hover:text-red-700 transition-colors py-2">
                        Reset Filter
                    </button>
                    <button @click="onFilterChange" :disabled="loading"
                        class="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-gray-800 hover:bg-gray-900 disabled:bg-gray-400 text-white text-sm rounded transition-colors">
                        <RefreshCw class="h-3.5 w-3.5" :class="{ 'animate-spin': loading }" />
                        Perbarui
                    </button>
                </div>
            </aside>

            <!-- PREVIEW AREA - RESPONSIVE DENGAN SCALE, PREVIEW TETAP SAMA PERSIS -->
            <main class="flex-1 overflow-auto py-6 px-4 flex flex-col items-center justify-start">
                <div v-if="loading" class="flex flex-col items-center gap-4 py-32 text-gray-400">
                    <span
                        class="h-10 w-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin inline-block"></span>
                    <span class="text-sm font-medium">Memuat data...</span>
                </div>

                <div v-else class="preview-container">
                    <div id="pdf-content" class="pdf-content-wrapper">
                        <!-- ==================== PREVIEW PDF - SAMA PERSIS DENGAN ASLINYA ==================== -->

                        <!-- HALAMAN 1 -->
                        <div class="pdf-page bg-white"
                            style="width:794px;min-height:1123px;font-family:'Times New Roman',Times,serif;margin-bottom:24px;box-shadow:0 4px 24px rgba(0,0,0,0.13);">

                            <div
                                style="border-bottom:3px solid #1e3a5f;padding:20px 40px 16px;display:flex;align-items:center;gap:20px;">
                                <div
                                    style="width:72px;height:72px;border-radius:50%;border:2px solid #1e3a5f;display:flex;align-items:center;justify-content:center;flex-shrink:0;">
                                    <span
                                        style="font-size:10px;font-weight:bold;color:#1e3a5f;text-align:center;line-height:1.2;">LOGO</span>
                                </div>
                                <div style="flex:1;text-align:center;">
                                    <div style="font-size:11px;color:#374151;letter-spacing:0.5px;">PEMERINTAH DAERAH
                                        KABUPATEN BANDUNG BARAT</div>
                                    <div style="font-size:11px;color:#374151;">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
                                    <div
                                        style="font-size:18px;font-weight:bold;color:#1e3a5f;margin:2px 0;letter-spacing:0.5px;">
                                        SMKN 1 CISARUA</div>
                                    <div style="font-size:10px;color:#6b7280;">Jl. Kolonel Masturi No.KM. 4, Kertawangi,
                                        Kec. Cisarua, Kabupaten Bandung Barat, Jawa Barat 40551</div>
                                    <div style="font-size:10px;color:#6b7280;">Telp. (022) 2787xxxx &nbsp;|&nbsp; Email:
                                        smkn1cisarua@disdik.jabarprov.go.id</div>
                                </div>
                                <div style="width:72px;"></div>
                            </div>

                            <div style="text-align:center;padding:18px 40px 14px;border-bottom:1px solid #d1d5db;">
                                <div
                                    style="font-size:14px;font-weight:bold;text-transform:uppercase;letter-spacing:1px;color:#111827;">
                                    LAPORAN STATISTIK PRESENSI GURU</div>
                                <div style="font-size:11px;color:#6b7280;margin-top:4px;">{{ periodeLabel }}</div>
                                <div v-if="selectedKelasName" style="font-size:11px;color:#6b7280;">Kelas: {{
                                    selectedKelasName }}</div>
                            </div>

                            <div style="padding:24px 40px;">
                                <div style="margin-bottom:20px;">
                                    <div
                                        style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;color:#1e3a5f;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:12px;">
                                        I. RINGKASAN EKSEKUTIF</div>
                                    <table style="width:100%;border-collapse:collapse;">
                                        <tr>
                                            <td
                                                style="width:25%;padding:10px 14px;background:#f0f4ff;border:1px solid #c7d2fe;">
                                                <div
                                                    style="font-size:9px;color:#6366f1;text-transform:uppercase;letter-spacing:0.5px;">
                                                    Total Presensi</div>
                                                <div
                                                    style="font-size:22px;font-weight:bold;color:#1e293b;line-height:1.2;">
                                                    {{ staticStats.total }}</div>
                                                <div style="font-size:9px;color:#94a3b8;">jadwal tercatat</div>
                                            </td>
                                            <td
                                                style="width:25%;padding:10px 14px;background:#f0fdf4;border:1px solid #bbf7d0;border-left:none;">
                                                <div
                                                    style="font-size:9px;color:#16a34a;text-transform:uppercase;letter-spacing:0.5px;">
                                                    Tingkat Kehadiran</div>
                                                <div
                                                    style="font-size:22px;font-weight:bold;color:#15803d;line-height:1.2;">
                                                    {{ staticStats.pct_hadir }}%</div>
                                                <div style="font-size:9px;color:#94a3b8;">dari total presensi</div>
                                            </td>
                                            <td
                                                style="width:25%;padding:10px 14px;background:#fff7ed;border:1px solid #fed7aa;border-left:none;">
                                                <div
                                                    style="font-size:9px;color:#ea580c;text-transform:uppercase;letter-spacing:0.5px;">
                                                    TH + Tugas</div>
                                                <div
                                                    style="font-size:22px;font-weight:bold;color:#c2410c;line-height:1.2;">
                                                    {{ staticStats.total_th_tugas }}</div>
                                                <div style="font-size:9px;color:#94a3b8;">kali tidak hadir + tugas</div>
                                            </td>
                                            <td
                                                style="width:25%;padding:10px 14px;background:#fff1f2;border:1px solid #fecdd3;border-left:none;">
                                                <div
                                                    style="font-size:9px;color:#e11d48;text-transform:uppercase;letter-spacing:0.5px;">
                                                    Tidak Hadir</div>
                                                <div
                                                    style="font-size:22px;font-weight:bold;color:#be123c;line-height:1.2;">
                                                    {{ staticStats.pct_tidak_hadir }}%</div>
                                                <div style="font-size:9px;color:#94a3b8;">dari total presensi</div>
                                            </td>
                                        </tr>
                                    </table>
                                </div>

                                <div style="margin-bottom:20px;">
                                    <div
                                        style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;color:#1e3a5f;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:12px;">
                                        II. PERFORMA KEHADIRAN PER GURU</div>
                                    <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                        <thead>
                                            <tr style="background:#1e3a5f;color:white;">
                                                <th
                                                    style="padding:7px 10px;text-align:center;font-weight:600;width:30px;">
                                                    No</th>
                                                <th style="padding:7px 10px;text-align:left;font-weight:600;">Nama Guru
                                                </th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">Hadir
                                                </th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">TH +
                                                    Tugas</th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">Tidak
                                                    Hadir</th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">Blm
                                                    Dipresensi</th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">% Hadir
                                                </th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">
                                                    Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(guru, i) in staticPerforma.slice(0, 18)" :key="guru.nama_guru"
                                                :style="{ background: i % 2 === 0 ? '#f8fafc' : 'white' }">
                                                <td
                                                    style="padding:6px 10px;text-align:center;color:#6b7280;border-bottom:1px solid #f1f5f9;">
                                                    {{ i + 1 }}</td>
                                                <td
                                                    style="padding:6px 10px;font-weight:500;color:#111827;border-bottom:1px solid #f1f5f9;">
                                                    {{ guru.nama_guru }}</td>
                                                <td
                                                    style="padding:6px 10px;text-align:center;color:#16a34a;font-weight:600;border-bottom:1px solid #f1f5f9;">
                                                    {{ guru.hadir }}</td>
                                                <td
                                                    style="padding:6px 10px;text-align:center;color:#d97706;font-weight:500;border-bottom:1px solid #f1f5f9;">
                                                    {{ guru.tidak_hadir_tugas }}</td>
                                                <td
                                                    style="padding:6px 10px;text-align:center;color:#dc2626;font-weight:500;border-bottom:1px solid #f1f5f9;">
                                                    {{ guru.tidak_hadir }}</td>
                                                <td style="padding:6px 10px;text-align:center;border-bottom:1px solid #f1f5f9;"
                                                    :style="{ color: guru.tidak_dipresensi > 0 ? '#d97706' : '#d1d5db' }">
                                                    {{ guru.tidak_dipresensi }}</td>
                                                <td style="padding:6px 10px;text-align:center;font-weight:700;border-bottom:1px solid #f1f5f9;"
                                                    :style="{ color: guru.pct_hadir >= 80 ? '#16a34a' : guru.pct_hadir >= 60 ? '#d97706' : '#dc2626' }">
                                                    {{ guru.pct_hadir }}%</td>
                                                <td
                                                    style="padding:6px 10px;text-align:center;border-bottom:1px solid #f1f5f9;">
                                                    <span
                                                        :style="{ fontSize: '9px', fontWeight: '600', padding: '2px 7px', borderRadius: '3px', background: guru.pct_hadir >= 80 ? '#dcfce7' : guru.pct_hadir >= 60 ? '#fef9c3' : '#fee2e2', color: guru.pct_hadir >= 80 ? '#15803d' : guru.pct_hadir >= 60 ? '#a16207' : '#b91c1c' }">{{
                                                            guru.pct_hadir >= 80 ? 'BAIK' : guru.pct_hadir >= 60 ? 'CUKUP' :
                                                        'KURANG' }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>

                            <div
                                style="border-top:1px solid #e5e7eb;padding:8px 40px;display:flex;justify-content:space-between;align-items:center;font-size:9px;color:#9ca3af;">
                                <span>SMKN 1 CISARUA — Laporan Statistik Presensi Guru</span>
                                <span>Dicetak: {{ todayStr }}</span>
                                <span>Halaman 1</span>
                            </div>
                        </div>

                        <!-- HALAMAN 2 -->
                        <div class="pdf-page bg-white"
                            style="width:794px;min-height:1123px;font-family:'Times New Roman',Times,serif;box-shadow:0 4px 24px rgba(0,0,0,0.13);">

                            <div
                                style="border-bottom:2px solid #1e3a5f;padding:12px 40px;display:flex;align-items:center;justify-content:space-between;">
                                <div style="font-size:13px;font-weight:bold;color:#1e3a5f;">SMKN 1 CISARUA</div>
                                <div style="font-size:10px;color:#6b7280;">Laporan Statistik Presensi Guru — {{
                                    periodeLabel }}</div>
                            </div>

                            <div style="padding:24px 40px;">
                                <div v-if="staticPerforma.length > 18" style="margin-bottom:20px;">
                                    <div
                                        style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;color:#1e3a5f;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:12px;">
                                        II. PERFORMA KEHADIRAN PER GURU (LANJUTAN)</div>
                                    <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                        <thead>
                                            <tr style="background:#1e3a5f;color:white;">
                                                <th
                                                    style="padding:7px 10px;text-align:center;font-weight:600;width:30px;">
                                                    No</th>
                                                <th style="padding:7px 10px;text-align:left;font-weight:600;">Nama Guru
                                                </th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">Hadir
                                                </th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">TH +
                                                    Tugas</th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">Tidak
                                                    Hadir</th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">Blm
                                                    Dipresensi</th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">% Hadir
                                                </th>
                                                <th style="padding:7px 10px;text-align:center;font-weight:600;">
                                                    Keterangan</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            <tr v-for="(guru, i) in staticPerforma.slice(18)" :key="guru.nama_guru"
                                                :style="{ background: i % 2 === 0 ? '#f8fafc' : 'white' }">
                                                <td
                                                    style="padding:6px 10px;text-align:center;color:#6b7280;border-bottom:1px solid #f1f5f9;">
                                                    {{ i + 19 }}</td>
                                                <td
                                                    style="padding:6px 10px;font-weight:500;color:#111827;border-bottom:1px solid #f1f5f9;">
                                                    {{ guru.nama_guru }}</td>
                                                <td
                                                    style="padding:6px 10px;text-align:center;color:#16a34a;font-weight:600;border-bottom:1px solid #f1f5f9;">
                                                    {{ guru.hadir }}</td>
                                                <td
                                                    style="padding:6px 10px;text-align:center;color:#d97706;font-weight:500;border-bottom:1px solid #f1f5f9;">
                                                    {{ guru.tidak_hadir_tugas }}</td>
                                                <td
                                                    style="padding:6px 10px;text-align:center;color:#dc2626;font-weight:500;border-bottom:1px solid #f1f5f9;">
                                                    {{ guru.tidak_hadir }}</td>
                                                <td style="padding:6px 10px;text-align:center;border-bottom:1px solid #f1f5f9;"
                                                    :style="{ color: guru.tidak_dipresensi > 0 ? '#d97706' : '#d1d5db' }">
                                                    {{ guru.tidak_dipresensi }}</td>
                                                <td style="padding:6px 10px;text-align:center;font-weight:700;border-bottom:1px solid #f1f5f9;"
                                                    :style="{ color: guru.pct_hadir >= 80 ? '#16a34a' : guru.pct_hadir >= 60 ? '#d97706' : '#dc2626' }">
                                                    {{ guru.pct_hadir }}%</td>
                                                <td
                                                    style="padding:6px 10px;text-align:center;border-bottom:1px solid #f1f5f9;">
                                                    <span
                                                        :style="{ fontSize: '9px', fontWeight: '600', padding: '2px 7px', borderRadius: '3px', background: guru.pct_hadir >= 80 ? '#dcfce7' : guru.pct_hadir >= 60 ? '#fef9c3' : '#fee2e2', color: guru.pct_hadir >= 80 ? '#15803d' : guru.pct_hadir >= 60 ? '#a16207' : '#b91c1c' }">{{
                                                            guru.pct_hadir >= 80 ? 'BAIK' : guru.pct_hadir >= 60 ? 'CUKUP' :
                                                        'KURANG' }}</span>
                                                </td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>

                                <div style="display:grid;grid-template-columns:1fr 1fr;gap:20px;margin-bottom:20px;">
                                    <div>
                                        <div
                                            style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;color:#1e3a5f;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:10px;">
                                            III. TOP 10 KEHADIRAN</div>
                                        <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                            <thead>
                                                <tr style="background:#f0fdf4;">
                                                    <th
                                                        style="padding:5px 8px;text-align:center;color:#374151;font-weight:600;width:28px;">
                                                        #</th>
                                                    <th
                                                        style="padding:5px 8px;text-align:left;color:#374151;font-weight:600;">
                                                        Nama Guru</th>
                                                    <th
                                                        style="padding:5px 8px;text-align:center;color:#374151;font-weight:600;">
                                                        %</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="g in staticTopHadir" :key="g.nama_guru">
                                                    <td
                                                        style="padding:5px 8px;text-align:center;color:#6b7280;border-bottom:1px solid #f1f5f9;">
                                                        {{ g.rank }}</td>
                                                    <td
                                                        style="padding:5px 8px;color:#111827;border-bottom:1px solid #f1f5f9;">
                                                        {{ g.nama_guru }}</td>
                                                    <td
                                                        style="padding:5px 8px;text-align:center;font-weight:700;color:#16a34a;border-bottom:1px solid #f1f5f9;">
                                                        {{ g.persen }}%</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                    <div>
                                        <div
                                            style="font-size:11px;font-weight:bold;text-transform:uppercase;letter-spacing:0.8px;color:#1e3a5f;border-bottom:1px solid #e5e7eb;padding-bottom:4px;margin-bottom:10px;">
                                            IV. TOP 10 KETIDAKHADIRAN</div>
                                        <table style="width:100%;border-collapse:collapse;font-size:10px;">
                                            <thead>
                                                <tr style="background:#fff1f2;">
                                                    <th
                                                        style="padding:5px 8px;text-align:center;color:#374151;font-weight:600;width:28px;">
                                                        #</th>
                                                    <th
                                                        style="padding:5px 8px;text-align:left;color:#374151;font-weight:600;">
                                                        Nama Guru</th>
                                                    <th
                                                        style="padding:5px 8px;text-align:center;color:#374151;font-weight:600;">
                                                        Jml</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                <tr v-for="g in staticTopTidakHadir" :key="g.nama_guru">
                                                    <td
                                                        style="padding:5px 8px;text-align:center;color:#6b7280;border-bottom:1px solid #f1f5f9;">
                                                        {{ g.rank }}</td>
                                                    <td
                                                        style="padding:5px 8px;color:#111827;border-bottom:1px solid #f1f5f9;">
                                                        {{ g.nama_guru }}</td>
                                                    <td
                                                        style="padding:5px 8px;text-align:center;font-weight:700;color:#dc2626;border-bottom:1px solid #f1f5f9;">
                                                        {{ g.total_tidak_hadir }}x</td>
                                                </tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>

                                <div
                                    style="background:#f8fafc;border:1px solid #e2e8f0;border-radius:4px;padding:12px 16px;margin-bottom:24px;font-size:10px;color:#475569;">
                                    <div style="font-weight:600;margin-bottom:4px;">Catatan:</div>
                                    <div>• <b>Hadir</b>: Guru hadir sesuai jadwal mengajar</div>
                                    <div>• <b>TH + Tugas</b>: Tidak hadir namun memberikan tugas kepada siswa</div>
                                    <div>• <b>Tidak Hadir</b>: Tidak hadir tanpa keterangan / murni absen</div>
                                    <div>• <b>Blm Dipresensi</b>: Slot jadwal yang belum dicatat kehadirannya</div>
                                    <div>• <b>Keterangan BAIK</b> ≥ 80%, <b>CUKUP</b> 60–79%, <b>KURANG</b> &lt; 60%
                                    </div>
                                </div>

                                <div style="display:grid;grid-template-columns:1fr 1fr 1fr;gap:0;margin-top:8px;">
                                    <div style="text-align:center;font-size:10px;color:#374151;">
                                        <div>Dibuat oleh,</div>
                                        <div style="height:56px;"></div>
                                        <div style="border-top:1px solid #374151;padding-top:4px;margin:0 20px;">(
                                            _________________ )</div>
                                        <div style="color:#6b7280;">Operator / Tata Usaha</div>
                                    </div>
                                    <div style="text-align:center;font-size:10px;color:#374151;">
                                        <div>Diketahui oleh,</div>
                                        <div style="height:56px;"></div>
                                        <div style="border-top:1px solid #374151;padding-top:4px;margin:0 20px;">(
                                            _________________ )</div>
                                        <div style="color:#6b7280;">Wakil Kepala Sekolah</div>
                                    </div>
                                    <div style="text-align:center;font-size:10px;color:#374151;">
                                        <div>Cisarua, {{ todayStr }}</div>
                                        <div>Mengetahui,</div>
                                        <div style="height:44px;"></div>
                                        <div style="border-top:1px solid #374151;padding-top:4px;margin:0 20px;">(
                                            _________________ )</div>
                                        <div style="font-weight:600;color:#111827;">Kepala Sekolah</div>
                                        <div style="color:#6b7280;">NIP. __________________</div>
                                    </div>
                                </div>
                            </div>

                            <div
                                style="border-top:1px solid #e5e7eb;padding:8px 40px;display:flex;justify-content:space-between;align-items:center;font-size:9px;color:#9ca3af;">
                                <span>SMKN 1 CISARUA — Laporan Statistik Presensi Guru</span>
                                <span>Dicetak: {{ todayStr }}</span>
                                <span>Halaman 2</span>
                            </div>
                        </div>

                        <!-- ==================== END PREVIEW PDF ==================== -->
                    </div>
                </div>
            </main>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ChevronDown, Download, RefreshCw } from 'lucide-vue-next'

const loading = ref(false)
const generating = ref(false)
const selectedPeriode = ref('bulan')
const selectedKelas = ref('')
const selectedKelasName = ref('')
const dateFrom = ref('')
const dateTo = ref('')
const kelasOpen = ref(false)
const kelasSearch = ref('')
const periodeOpen = ref(false)
const periodeRef = ref(null)
const kelasRef = ref(null)

const PERIODE_LIST = [
    { value: 'minggu', label: 'Minggu Ini' },
    { value: 'bulan', label: 'Bulan Ini' },
    { value: 'tahun', label: 'Tahun Ini' },
]

const STATIC_KELAS = [
    { id: '1', name: 'X RPL 1' }, { id: '2', name: 'X RPL 2' },
    { id: '3', name: 'XI RPL 1' }, { id: '4', name: 'XI RPL 2' },
    { id: '5', name: 'XII RPL 1' }, { id: '6', name: 'XII RPL 2' },
    { id: '7', name: 'X TKJ 1' }, { id: '8', name: 'XI TKJ 1' },
]

const staticStats = {
    total: 248, pct_hadir: 84, pct_tidak_hadir: 16, total_th_tugas: 21
}

const staticPerforma = [
    { nama_guru: 'Drs. Ahmad Fauzi, M.Pd', hadir: 22, tidak_hadir_tugas: 1, tidak_hadir: 0, tidak_dipresensi: 0, pct_hadir: 96 },
    { nama_guru: 'Siti Rahayu, S.Pd', hadir: 20, tidak_hadir_tugas: 2, tidak_hadir: 1, tidak_dipresensi: 0, pct_hadir: 87 },
    { nama_guru: 'Budi Santoso, S.Kom', hadir: 19, tidak_hadir_tugas: 3, tidak_hadir: 1, tidak_dipresensi: 1, pct_hadir: 83 },
    { nama_guru: 'Rina Wulandari, S.Pd', hadir: 18, tidak_hadir_tugas: 2, tidak_hadir: 2, tidak_dipresensi: 0, pct_hadir: 82 },
    { nama_guru: 'Hendra Gunawan, S.T', hadir: 17, tidak_hadir_tugas: 4, tidak_hadir: 2, tidak_dipresensi: 0, pct_hadir: 74 },
    { nama_guru: 'Dewi Lestari, M.Pd', hadir: 21, tidak_hadir_tugas: 1, tidak_hadir: 0, tidak_dipresensi: 0, pct_hadir: 95 },
    { nama_guru: 'Agus Setiawan, S.Pd', hadir: 16, tidak_hadir_tugas: 3, tidak_hadir: 4, tidak_dipresensi: 2, pct_hadir: 70 },
    { nama_guru: 'Nurul Hidayah, S.Pd', hadir: 20, tidak_hadir_tugas: 2, tidak_hadir: 1, tidak_dipresensi: 0, pct_hadir: 87 },
    { nama_guru: 'Wahyu Pratama, S.Kom', hadir: 15, tidak_hadir_tugas: 5, tidak_hadir: 3, tidak_dipresensi: 1, pct_hadir: 65 },
    { nama_guru: 'Fitri Handayani, S.Pd', hadir: 22, tidak_hadir_tugas: 0, tidak_hadir: 0, tidak_dipresensi: 0, pct_hadir: 100 },
    { nama_guru: 'Rizky Firmansyah, S.T', hadir: 18, tidak_hadir_tugas: 2, tidak_hadir: 2, tidak_dipresensi: 0, pct_hadir: 82 },
    { nama_guru: 'Yuni Astuti, M.Pd', hadir: 19, tidak_hadir_tugas: 1, tidak_hadir: 2, tidak_dipresensi: 0, pct_hadir: 86 },
    { nama_guru: 'Dedi Kurniawan, S.Pd', hadir: 13, tidak_hadir_tugas: 4, tidak_hadir: 5, tidak_dipresensi: 3, pct_hadir: 59 },
    { nama_guru: 'Sri Mulyani, S.Pd', hadir: 20, tidak_hadir_tugas: 2, tidak_hadir: 0, tidak_dipresensi: 0, pct_hadir: 91 },
    { nama_guru: 'Tono Subianto, S.Kom', hadir: 17, tidak_hadir_tugas: 3, tidak_hadir: 2, tidak_dipresensi: 1, pct_hadir: 77 },
    { nama_guru: 'Maya Sari, S.Pd', hadir: 21, tidak_hadir_tugas: 1, tidak_hadir: 1, tidak_dipresensi: 0, pct_hadir: 91 },
    { nama_guru: 'Bambang Irawan, S.T', hadir: 16, tidak_hadir_tugas: 3, tidak_hadir: 4, tidak_dipresensi: 0, pct_hadir: 70 },
    { nama_guru: 'Lina Marlina, S.Pd', hadir: 14, tidak_hadir_tugas: 5, tidak_hadir: 4, tidak_dipresensi: 2, pct_hadir: 64 },
    { nama_guru: 'Eko Prasetyo, S.Kom', hadir: 20, tidak_hadir_tugas: 1, tidak_hadir: 1, tidak_dipresensi: 0, pct_hadir: 91 },
    { nama_guru: 'Ratna Dewi, S.Pd', hadir: 18, tidak_hadir_tugas: 2, tidak_hadir: 2, tidak_dipresensi: 1, pct_hadir: 82 },
    { nama_guru: 'Haris Munandar, M.Pd', hadir: 22, tidak_hadir_tugas: 0, tidak_hadir: 0, tidak_dipresensi: 0, pct_hadir: 100 },
    { nama_guru: 'Indah Permata, S.Pd', hadir: 12, tidak_hadir_tugas: 6, tidak_hadir: 5, tidak_dipresensi: 2, pct_hadir: 55 },
]

const staticTopHadir = [
    { rank: 1, nama_guru: 'Fitri Handayani, S.Pd', persen: 100 },
    { rank: 2, nama_guru: 'Haris Munandar, M.Pd', persen: 100 },
    { rank: 3, nama_guru: 'Drs. Ahmad Fauzi, M.Pd', persen: 96 },
    { rank: 4, nama_guru: 'Dewi Lestari, M.Pd', persen: 95 },
    { rank: 5, nama_guru: 'Sri Mulyani, S.Pd', persen: 91 },
    { rank: 6, nama_guru: 'Maya Sari, S.Pd', persen: 91 },
    { rank: 7, nama_guru: 'Eko Prasetyo, S.Kom', persen: 91 },
    { rank: 8, nama_guru: 'Siti Rahayu, S.Pd', persen: 87 },
    { rank: 9, nama_guru: 'Nurul Hidayah, S.Pd', persen: 87 },
    { rank: 10, nama_guru: 'Yuni Astuti, M.Pd', persen: 86 },
]

const staticTopTidakHadir = [
    { rank: 1, nama_guru: 'Indah Permata, S.Pd', total_tidak_hadir: 5 },
    { rank: 2, nama_guru: 'Dedi Kurniawan, S.Pd', total_tidak_hadir: 5 },
    { rank: 3, nama_guru: 'Agus Setiawan, S.Pd', total_tidak_hadir: 4 },
    { rank: 4, nama_guru: 'Bambang Irawan, S.T', total_tidak_hadir: 4 },
    { rank: 5, nama_guru: 'Lina Marlina, S.Pd', total_tidak_hadir: 4 },
    { rank: 6, nama_guru: 'Wahyu Pratama, S.Kom', total_tidak_hadir: 3 },
    { rank: 7, nama_guru: 'Rizky Firmansyah, S.T', total_tidak_hadir: 2 },
    { rank: 8, nama_guru: 'Rina Wulandari, S.Pd', total_tidak_hadir: 2 },
    { rank: 9, nama_guru: 'Hendra Gunawan, S.T', total_tidak_hadir: 2 },
    { rank: 10, nama_guru: 'Yuni Astuti, M.Pd', total_tidak_hadir: 2 },
]

const todayStr = computed(() =>
    new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
)

const periodeLabel = computed(() => {
    if (selectedPeriode.value === 'custom' && dateFrom.value && dateTo.value) {
        const fmt = s => new Date(s).toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })
        return `Periode: ${fmt(dateFrom.value)} s.d. ${fmt(dateTo.value)}`
    }
    const map = { minggu: 'Periode: Minggu Ini', bulan: 'Periode: Bulan Ini', tahun: 'Periode: Tahun Ini', custom: 'Periode: Rentang Tanggal' }
    return map[selectedPeriode.value] ?? ''
})

const filteredKelas = computed(() => {
    if (!kelasSearch.value) return STATIC_KELAS
    return STATIC_KELAS.filter(k => k.name.toLowerCase().includes(kelasSearch.value.toLowerCase()))
})

const selectPeriode = (p) => {
    selectedPeriode.value = p.value
    periodeOpen.value = false
}

const openKelas = () => { kelasOpen.value = !kelasOpen.value }

const selectKelas = (k) => {
    selectedKelas.value = k?.id ?? ''
    selectedKelasName.value = k?.name ?? ''
    kelasSearch.value = k?.name ?? ''
    kelasOpen.value = false
}

const resetFilter = () => {
    selectedPeriode.value = 'bulan'
    selectedKelas.value = ''
    selectedKelasName.value = ''
    kelasSearch.value = ''
    dateFrom.value = ''
    dateTo.value = ''
}

const onFilterChange = async () => {
    loading.value = true
    await new Promise(r => setTimeout(r, 600))
    loading.value = false
}

const generatePdf = async () => {
    generating.value = true
    try {
        const html2pdf = (await import('html2pdf.js')).default
        const el = document.getElementById('pdf-content')
        const filename = `Laporan_Presensi_SMKN1Cisarua_${selectedPeriode.value}${selectedKelasName.value ? '_' + selectedKelasName.value : ''}.pdf`
        await html2pdf().set({
            margin: 0,
            filename,
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true, letterRendering: true },
            jsPDF: { unit: 'px', format: [794, 1123], orientation: 'portrait' },
            pagebreak: { mode: 'avoid-all' }
        }).from(el).save()
    } finally { generating.value = false }
}

const handleClickOutside = (e) => {
    if (periodeRef.value && !periodeRef.value.contains(e.target)) periodeOpen.value = false
    if (kelasRef.value && !kelasRef.value.contains(e.target)) {
        kelasOpen.value = false
        if (!selectedKelas.value) kelasSearch.value = ''
    }
}

onMounted(() => { document.addEventListener('click', handleClickOutside) })
onUnmounted(() => { document.removeEventListener('click', handleClickOutside) })
</script>

<style scoped>
/* Preview PDF - RESPONSIVE DENGAN SCALE TANPA MENGUBAH ISI */
.preview-container {
    display: flex;
    justify-content: center;
    width: 100%;
}

.pdf-content-wrapper {
    transform-origin: top center;
}

/* Ukuran desktop - normal */
@media (min-width: 1024px) {
    .pdf-content-wrapper {
        transform: scale(1);
    }
}

/* Tablet - preview diskalakan tapi tetap proporsional */
@media (max-width: 1023px) and (min-width: 769px) {
    .pdf-content-wrapper {
        transform: scale(0.7);
        transform-origin: top center;
        margin-bottom: -340px;
    }
}

/* Mobile landscape */
@media (max-width: 768px) {
    .pdf-content-wrapper {
        transform: scale(0.55);
        transform-origin: top center;
        margin-bottom: -500px;
    }
}

/* Mobile portrait */
@media (max-width: 480px) {
    .pdf-content-wrapper {
        transform: scale(0.42);
        transform-origin: top center;
        margin-bottom: -650px;
    }
}

/* Animasi transition untuk custom range */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.2s ease;
}

.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-8px);
}

.slide-enter-to,
.slide-leave-from {
    opacity: 1;
    transform: translateY(0);
}

/* Custom scroll untuk sidebar */
.custom-scroll::-webkit-scrollbar {
    width: 4px;
}

.custom-scroll::-webkit-scrollbar-track {
    background: transparent;
}

.custom-scroll::-webkit-scrollbar-thumb {
    background-color: #d1d5db;
    border-radius: 20px;
}

.custom-scroll {
    scrollbar-width: thin;
    scrollbar-color: #d1d5db transparent;
}
</style>