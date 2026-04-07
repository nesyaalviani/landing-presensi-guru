<template>
  <div class="app-shell">

    <!-- TOP BAR -->
    <header class="topbar">
      <div class="topbar-left">
        <button @click="$router.back()" class="btn-icon">
          <ArrowLeft class="icon-sm" />
        </button>
        <div class="topbar-title">
          <FileText class="icon-sm" />
          <span>Preview Laporan PDF</span>
        </div>
      </div>
     <button @click="generatePdf" :disabled="generating" class="btn-download">
  <span v-if="generating" class="spinner"></span>
  <Download v-else class="icon-sm" />
  <span class="dl-label">{{ generating ? 'Menyiapkan...' : 'Unduh PDF' }}</span>
</button>
    </header>

    <!-- FILTER BAR (horizontal, sticky) -->
    <div class="filter-bar">
      <!-- Periode -->
      <div class="filter-item" ref="periodeRef">
        <span class="filter-label">Periode</span>
        <button @click.stop="periodeOpen = !periodeOpen" class="filter-select" :class="{ active: periodeOpen }">
          {{ PERIODE_LIST.find(p => p.value === selectedPeriode)?.label || 'Pilih' }}
          <ChevronDown class="icon-xs" :class="{ rotated: periodeOpen }" />
        </button>
        <ul v-if="periodeOpen" class="dropdown">
          <li v-for="p in PERIODE_LIST" :key="p.value" @mousedown.prevent="selectPeriode(p)"
            class="dropdown-item" :class="{ selected: selectedPeriode === p.value }">{{ p.label }}</li>
          <li @mousedown.prevent="selectPeriode({ value: 'custom', label: 'Rentang Tanggal' })"
            class="dropdown-item divider-top" :class="{ selected: selectedPeriode === 'custom' }">Rentang Tanggal...</li>
        </ul>
      </div>

      <!-- Custom date range -->
      <Transition name="fade">
        <div v-if="selectedPeriode === 'custom'" class="filter-dates">
          <input v-model="dateFrom" type="date" class="input-date" title="Dari tanggal" />
          <span class="date-sep">—</span>
          <input v-model="dateTo" type="date" class="input-date" title="Sampai tanggal" />
        </div>
      </Transition>

      <!-- Kelas -->
      <div class="filter-item" ref="kelasRef">
        <span class="filter-label">Kelas</span>
        <div class="filter-search-wrap" :class="{ active: kelasOpen }">
          <input v-model="kelasSearch" type="text" placeholder="Semua Kelas" class="filter-search"
            @click.stop="kelasOpen = true" />
          <button @click.stop="kelasOpen = !kelasOpen" class="chevron-btn">
            <ChevronDown class="icon-xs" :class="{ rotated: kelasOpen }" />
          </button>
        </div>
        <ul v-if="kelasOpen" class="dropdown">
          <li @mousedown.prevent="selectKelas(null)" class="dropdown-item" :class="{ selected: !selectedKelas }">Semua Kelas</li>
          <li v-for="k in filteredKelas" :key="k.id" @mousedown.prevent="selectKelas(k)"
            class="dropdown-item" :class="{ selected: selectedKelas === k.id }">{{ k.name }}</li>
        </ul>
      </div>

      <!-- Actions -->
      <div class="filter-actions">
        <button v-if="selectedKelas || selectedPeriode !== 'bulan'" @click="resetFilter" class="btn-reset">Reset</button>
        <button @click="onFilterChange" :disabled="loading" class="btn-refresh">
          <RefreshCw class="icon-sm" :class="{ spinning: loading }" />
          Perbarui
        </button>
      </div>

      <!-- Legend -->
      <div class="legend">
        <span class="dot green"></span><span class="legend-txt">≥80%</span>
        <span class="dot yellow"></span><span class="legend-txt">60–79%</span>
        <span class="dot red"></span><span class="legend-txt">&lt;60%</span>
      </div>
    </div>

    <!-- MAIN PREVIEW -->
    <main class="preview-main">
      <div v-if="loading" class="loading-state">
        <span class="spinner lg"></span>
        <span>Memuat data...</span>
      </div>

      <div v-else class="preview-scaler">
        <div id="pdf-content">

          <!-- HALAMAN 1 -->
          <div class="pdf-page">
            <div class="kop">
              <div class="kop-logo">LOGO</div>
              <div class="kop-center">
                <div class="kop-instansi">PEMERINTAH DAERAH KABUPATEN BANDUNG BARAT</div>
                <div class="kop-instansi">DINAS PENDIDIKAN DAN KEBUDAYAAN</div>
                <div class="kop-sekolah">SMKN 1 CISARUA</div>
                <div class="kop-alamat">Jl. Kolonel Masturi No.KM. 4, Kertawangi, Kec. Cisarua, Kabupaten Bandung Barat, Jawa Barat 40551</div>
                <div class="kop-alamat">Telp. (022) 2787xxxx &nbsp;|&nbsp; Email: smkn1cisarua@disdik.jabarprov.go.id</div>
              </div>
              <div style="width:72px"></div>
            </div>

            <div class="doc-title-block">
              <div class="doc-title">LAPORAN STATISTIK PRESENSI GURU</div>
              <div class="doc-subtitle">{{ periodeLabel }}</div>
              <div v-if="selectedKelasName" class="doc-subtitle">Kelas: {{ selectedKelasName }}</div>
            </div>

            <div class="pdf-body">
              <div class="section">
                <div class="section-title">I. RINGKASAN EKSEKUTIF</div>
                <table class="stats-grid">
                  <tr>
                    <td class="stat-cell blue">
                      <div class="stat-label">Total Presensi</div>
                      <div class="stat-val">{{ staticStats.total }}</div>
                      <div class="stat-sub">jadwal tercatat</div>
                    </td>
                    <td class="stat-cell green">
                      <div class="stat-label">Tingkat Kehadiran</div>
                      <div class="stat-val">{{ staticStats.pct_hadir }}%</div>
                      <div class="stat-sub">dari total presensi</div>
                    </td>
                    <td class="stat-cell orange">
                      <div class="stat-label">TH + Tugas</div>
                      <div class="stat-val">{{ staticStats.total_th_tugas }}</div>
                      <div class="stat-sub">kali tidak hadir + tugas</div>
                    </td>
                    <td class="stat-cell red">
                      <div class="stat-label">Tidak Hadir</div>
                      <div class="stat-val">{{ staticStats.pct_tidak_hadir }}%</div>
                      <div class="stat-sub">dari total presensi</div>
                    </td>
                  </tr>
                </table>
              </div>

              <div class="section">
                <div class="section-title">II. PERFORMA KEHADIRAN PER GURU</div>
                <table class="data-table">
                  <thead>
                    <tr>
                      <th style="width:30px">No</th>
                      <th style="text-align:left">Nama Guru</th>
                      <th>Hadir</th><th>TH+Tugas</th><th>Tdk Hadir</th><th>Blm Presensi</th><th>% Hadir</th><th>Ket.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(g, i) in staticPerforma.slice(0, 18)" :key="g.nama_guru" :class="{ even: i % 2 === 0 }">
                      <td class="tc gray">{{ i + 1 }}</td>
                      <td class="bold-name">{{ g.nama_guru }}</td>
                      <td class="tc green-txt">{{ g.hadir }}</td>
                      <td class="tc orange-txt">{{ g.tidak_hadir_tugas }}</td>
                      <td class="tc red-txt">{{ g.tidak_hadir }}</td>
                      <td class="tc" :class="g.tidak_dipresensi > 0 ? 'orange-txt' : 'muted'">{{ g.tidak_dipresensi }}</td>
                      <td class="tc bold-pct" :style="pctColor(g.pct_hadir)">{{ g.pct_hadir }}%</td>
                      <td class="tc"><span class="badge" :class="badgeClass(g.pct_hadir)">{{ badgeLabel(g.pct_hadir) }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div class="pdf-footer">
              <span>SMKN 1 CISARUA — Laporan Statistik Presensi Guru</span>
              <span>Dicetak: {{ todayStr }}</span>
              <span>Halaman 1</span>
            </div>
          </div>

          <!-- HALAMAN 2 -->
          <div class="pdf-page">
            <div class="kop-mini">
              <span class="kop-mini-title">SMKN 1 CISARUA</span>
              <span class="kop-mini-sub">Laporan Statistik Presensi Guru — {{ periodeLabel }}</span>
            </div>

            <div class="pdf-body">
              <div v-if="staticPerforma.length > 18" class="section">
                <div class="section-title">II. PERFORMA KEHADIRAN PER GURU (LANJUTAN)</div>
                <table class="data-table">
                  <thead>
                    <tr>
                      <th style="width:30px">No</th>
                      <th style="text-align:left">Nama Guru</th>
                      <th>Hadir</th><th>TH+Tugas</th><th>Tdk Hadir</th><th>Blm Presensi</th><th>% Hadir</th><th>Ket.</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(g, i) in staticPerforma.slice(18)" :key="g.nama_guru" :class="{ even: i % 2 === 0 }">
                      <td class="tc gray">{{ i + 19 }}</td>
                      <td class="bold-name">{{ g.nama_guru }}</td>
                      <td class="tc green-txt">{{ g.hadir }}</td>
                      <td class="tc orange-txt">{{ g.tidak_hadir_tugas }}</td>
                      <td class="tc red-txt">{{ g.tidak_hadir }}</td>
                      <td class="tc" :class="g.tidak_dipresensi > 0 ? 'orange-txt' : 'muted'">{{ g.tidak_dipresensi }}</td>
                      <td class="tc bold-pct" :style="pctColor(g.pct_hadir)">{{ g.pct_hadir }}%</td>
                      <td class="tc"><span class="badge" :class="badgeClass(g.pct_hadir)">{{ badgeLabel(g.pct_hadir) }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="top-grid">
                <div class="section">
                  <div class="section-title green-title">III. TOP 10 KEHADIRAN</div>
                  <table class="rank-table">
                    <thead><tr><th>#</th><th>Nama Guru</th><th>%</th></tr></thead>
                    <tbody>
                      <tr v-for="g in staticTopHadir" :key="g.nama_guru">
                        <td class="tc gray">{{ g.rank }}</td>
                        <td>{{ g.nama_guru }}</td>
                        <td class="tc green-txt bold-pct">{{ g.persen }}%</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <div class="section">
                  <div class="section-title red-title">IV. TOP 10 KETIDAKHADIRAN</div>
                  <table class="rank-table">
                    <thead><tr><th>#</th><th>Nama Guru</th><th>Jml</th></tr></thead>
                    <tbody>
                      <tr v-for="g in staticTopTidakHadir" :key="g.nama_guru">
                        <td class="tc gray">{{ g.rank }}</td>
                        <td>{{ g.nama_guru }}</td>
                        <td class="tc red-txt bold-pct">{{ g.total_tidak_hadir }}x</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              <div class="notes-block">
                <div class="notes-title">Catatan:</div>
                <div>• <b>Hadir</b>: Guru hadir sesuai jadwal mengajar</div>
                <div>• <b>TH + Tugas</b>: Tidak hadir namun memberikan tugas kepada siswa</div>
                <div>• <b>Tidak Hadir</b>: Tidak hadir tanpa keterangan / murni absen</div>
                <div>• <b>Blm Dipresensi</b>: Slot jadwal yang belum dicatat kehadirannya</div>
                <div>• <b>Keterangan BAIK</b> ≥ 80%, <b>CUKUP</b> 60–79%, <b>KURANG</b> &lt; 60%</div>
              </div>

              <div class="ttd-grid">
                <div class="ttd-block">
                  <div>Dibuat oleh,</div>
                  <div class="ttd-space"></div>
                  <div class="ttd-line">( _________________ )</div>
                  <div class="ttd-role">Operator / Tata Usaha</div>
                </div>
                <div class="ttd-block">
                  <div>Diketahui oleh,</div>
                  <div class="ttd-space"></div>
                  <div class="ttd-line">( _________________ )</div>
                  <div class="ttd-role">Wakil Kepala Sekolah</div>
                </div>
                <div class="ttd-block">
                  <div>Cisarua, {{ todayStr }}</div>
                  <div>Mengetahui,</div>
                  <div class="ttd-space sm"></div>
                  <div class="ttd-line">( _________________ )</div>
                  <div class="ttd-name">Kepala Sekolah</div>
                  <div class="ttd-role">NIP. __________________</div>
                </div>
              </div>
            </div>

            <div class="pdf-footer">
              <span>SMKN 1 CISARUA — Laporan Statistik Presensi Guru</span>
              <span>Dicetak: {{ todayStr }}</span>
              <span>Halaman 2</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { ArrowLeft, ChevronDown, Download, RefreshCw, FileText } from 'lucide-vue-next'

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

const staticStats = { total: 248, pct_hadir: 84, pct_tidak_hadir: 16, total_th_tugas: 21 }

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
  return { minggu: 'Periode: Minggu Ini', bulan: 'Periode: Bulan Ini', tahun: 'Periode: Tahun Ini', custom: 'Periode: Rentang Tanggal' }[selectedPeriode.value] ?? ''
})

const filteredKelas = computed(() =>
  !kelasSearch.value ? STATIC_KELAS : STATIC_KELAS.filter(k => k.name.toLowerCase().includes(kelasSearch.value.toLowerCase()))
)

// Helpers
const pctColor = p => ({ color: p >= 80 ? '#16a34a' : p >= 60 ? '#d97706' : '#dc2626' })
const badgeClass = p => p >= 80 ? 'badge-green' : p >= 60 ? 'badge-yellow' : 'badge-red'
const badgeLabel = p => p >= 80 ? 'BAIK' : p >= 60 ? 'CUKUP' : 'KURANG'

const selectPeriode = (p) => { selectedPeriode.value = p.value; periodeOpen.value = false }
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
      margin: 0, filename,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
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
onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
/* ===== BASE ===== */
.app-shell { min-height: 100vh; background: #f1f5f9; display: flex; flex-direction: column; font-family: 'Segoe UI', sans-serif; }
.icon-sm { width: 15px; height: 15px; flex-shrink: 0; }
.icon-xs { width: 13px; height: 13px; flex-shrink: 0; }

/* ===== TOPBAR ===== */
.topbar {
  background: #fff; border-bottom: 1px solid #e2e8f0;
  padding: 0 20px; height: 52px;
  display: flex; align-items: center; justify-content: space-between;
  box-shadow: 0 1px 3px rgba(0,0,0,.06); position: sticky; top: 0; z-index: 50;
}
.topbar-left { display: flex; align-items: center; gap: 10px; }
.topbar-title { display: flex; align-items: center; gap: 6px; font-size: 13px; color: #334155; font-weight: 600; }
.btn-icon { display: flex; align-items: center; padding: 6px; border-radius: 6px; background: none; border: none; cursor: pointer; color: #64748b; transition: background .15s; }
.btn-icon:hover { background: #f1f5f9; color: #1e293b; }
.btn-download {
  display: flex; align-items: center; gap: 7px; padding: 7px 16px;
  font-size: 13px; font-weight: 600; background: #1d4ed8; color: #fff;
  border: none; border-radius: 7px; cursor: pointer; transition: background .15s;
  box-shadow: 0 1px 4px rgba(29,78,216,.25);
}
.btn-download:hover { background: #1e40af; }
.btn-download:disabled { background: #93c5fd; cursor: not-allowed; }

/* ===== FILTER BAR (replaces sidebar) ===== */
.filter-bar {
  background: #fff; border-bottom: 1px solid #e2e8f0;
  padding: 0 20px; height: 48px;
  display: flex; align-items: center; gap: 16px;
  position: sticky; top: 52px; z-index: 40;
  box-shadow: 0 1px 3px rgba(0,0,0,.04);
  overflow-x: visible; flex-shrink: 0;
}
.filter-scroll {
  display: flex; align-items: center; gap: 12px;
  overflow-x: auto; flex: 1; padding: 0 2px;
}
.filter-scroll::-webkit-scrollbar { height: 0; }
.filter-bar::-webkit-scrollbar { height: 0; }

/* Filter item (label + control) */
.filter-item { display: flex; align-items: center; gap: 7px; position: relative; flex-shrink: 0; }
.filter-label { font-size: 11px; font-weight: 600; color: #94a3b8; white-space: nowrap; }

/* Select button */
.filter-select {
  display: flex; align-items: center; gap: 6px; padding: 5px 10px;
  font-size: 12px; color: #334155; background: #f8fafc;
  border: 1.5px solid #e2e8f0; border-radius: 6px; cursor: pointer;
  white-space: nowrap; transition: border-color .15s;
}
.filter-select:hover, .filter-select.active { border-color: #3b82f6; background: #eff6ff; color: #1d4ed8; }
.chevron { transition: transform .2s; }
.rotated { transform: rotate(180deg); }

/* Date range */
.filter-dates { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.input-date { padding: 5px 8px; font-size: 12px; border: 1.5px solid #e2e8f0; border-radius: 6px; background: #f8fafc; color: #334155; outline: none; }
.input-date:focus { border-color: #3b82f6; }
.date-sep { font-size: 11px; color: #94a3b8; }

/* Kelas search */
.filter-search-wrap {
  display: flex; align-items: center; border: 1.5px solid #e2e8f0; border-radius: 6px;
  background: #f8fafc; overflow: hidden; transition: border-color .15s; width: 140px;
}
.filter-search-wrap:hover, .filter-search-wrap.active { border-color: #3b82f6; background: #fff; }
.filter-search { flex: 1; padding: 5px 8px; font-size: 12px; border: none; outline: none; background: transparent; color: #334155; min-width: 0; }
.filter-search::placeholder { color: #94a3b8; }
.chevron-btn { padding: 5px 6px; background: none; border: none; cursor: pointer; color: #94a3b8; display: flex; }

/* Dropdown */
.dropdown {
  position: absolute; top: calc(100% + 6px); left: 0; z-index: 200; min-width: 160px;
  background: #fff; border: 1.5px solid #e2e8f0; border-radius: 8px;
  box-shadow: 0 8px 24px rgba(0,0,0,.1); list-style: none; padding: 4px 0; margin: 0;
}
.dropdown-item { padding: 7px 12px; font-size: 12px; cursor: pointer; color: #475569; transition: background .1s; white-space: nowrap; }
.dropdown-item:hover { background: #f1f5f9; }
.dropdown-item.selected { background: #eff6ff; color: #1d4ed8; font-weight: 600; }
.dropdown-item.divider-top { border-top: 1px solid #f1f5f9; }

/* Filter actions */
.filter-actions { display: flex; align-items: center; gap: 6px; flex-shrink: 0; }
.btn-reset { font-size: 11px; color: #ef4444; background: none; border: none; cursor: pointer; padding: 5px 8px; border-radius: 5px; }
.btn-reset:hover { background: #fef2f2; }
.btn-refresh {
  display: flex; align-items: center; gap: 5px; padding: 5px 12px;
  font-size: 12px; font-weight: 600; background: #1e293b; color: #fff;
  border: none; border-radius: 6px; cursor: pointer; transition: background .15s; white-space: nowrap;
}
.btn-refresh:hover { background: #0f172a; }
.btn-refresh:disabled { background: #94a3b8; cursor: not-allowed; }
.spinning { animation: spin .7s linear infinite; }

/* Legend */
.legend { display: flex; align-items: center; gap: 6px; margin-left: auto; flex-shrink: 0; padding-left: 12px; border-left: 1px solid #f1f5f9; }
.dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
.dot.green { background: #16a34a; }
.dot.yellow { background: #d97706; }
.dot.red { background: #dc2626; }
.legend-txt { font-size: 10px; color: #94a3b8; margin-right: 4px; }

/* ===== MAIN PREVIEW ===== */
.preview-main { flex: 1; overflow: auto; padding: 24px 20px; display: flex; flex-direction: column; align-items: center; background: #f1f5f9; }
.loading-state { display: flex; flex-direction: column; align-items: center; gap: 12px; padding: 80px 0; color: #94a3b8; font-size: 14px; }

/* Responsive scaler */
.preview-scaler { transform-origin: top center; }
@media (min-width: 1200px) { .preview-scaler { transform: scale(1); } }
@media (max-width: 1199px) and (min-width: 900px) { .preview-scaler { transform: scale(0.78); margin-bottom: -240px; } }
@media (max-width: 899px) and (min-width: 640px) { .preview-scaler { transform: scale(0.6); margin-bottom: -440px; } }
@media (max-width: 639px) { .preview-scaler { transform: scale(0.44); margin-bottom: -630px; } }

/* ===== PDF PAGE (unchanged) ===== */
.pdf-page {
  width: 794px; min-height: 1123px;
  font-family: 'Times New Roman', Times, serif;
  background: #fff; margin-bottom: 28px;
  box-shadow: 0 4px 24px rgba(0,0,0,.15);
  display: flex; flex-direction: column;
}
.kop { border-bottom: 3px solid #1e3a5f; padding: 18px 40px 14px; display: flex; align-items: center; gap: 18px; }
.kop-logo { width: 70px; height: 70px; border-radius: 50%; border: 2px solid #1e3a5f; display: flex; align-items: center; justify-content: center; font-size: 10px; font-weight: bold; color: #1e3a5f; text-align: center; flex-shrink: 0; }
.kop-center { flex: 1; text-align: center; }
.kop-instansi { font-size: 11px; color: #374151; }
.kop-sekolah { font-size: 18px; font-weight: bold; color: #1e3a5f; margin: 2px 0; }
.kop-alamat { font-size: 10px; color: #6b7280; }
.kop-mini { border-bottom: 2px solid #1e3a5f; padding: 10px 40px; display: flex; align-items: center; justify-content: space-between; }
.kop-mini-title { font-size: 13px; font-weight: bold; color: #1e3a5f; }
.kop-mini-sub { font-size: 10px; color: #6b7280; }
.doc-title-block { text-align: center; padding: 14px 40px 12px; border-bottom: 1px solid #d1d5db; }
.doc-title { font-size: 14px; font-weight: bold; text-transform: uppercase; letter-spacing: 1px; color: #111827; }
.doc-subtitle { font-size: 11px; color: #6b7280; margin-top: 3px; }
.pdf-body { padding: 20px 40px; flex: 1; }
.pdf-footer { border-top: 1px solid #e5e7eb; padding: 7px 40px; display: flex; justify-content: space-between; font-size: 9px; color: #9ca3af; margin-top: auto; }

/* Sections */
.section { margin-bottom: 18px; }
.section-title { font-size: 10.5px; font-weight: bold; text-transform: uppercase; letter-spacing: .7px; color: #1e3a5f; border-bottom: 1px solid #e5e7eb; padding-bottom: 4px; margin-bottom: 10px; }
.green-title { color: #15803d; }
.red-title { color: #b91c1c; }

/* Stats grid */
.stats-grid { width: 100%; border-collapse: collapse; }
.stat-cell { width: 25%; padding: 10px 14px; border: 1px solid; }
.stat-cell.blue { background: #f0f4ff; border-color: #c7d2fe; }
.stat-cell.green { background: #f0fdf4; border-color: #bbf7d0; border-left: none; }
.stat-cell.orange { background: #fff7ed; border-color: #fed7aa; border-left: none; }
.stat-cell.red { background: #fff1f2; border-color: #fecdd3; border-left: none; }
.stat-label { font-size: 9px; text-transform: uppercase; letter-spacing: .5px; }
.stat-cell.blue .stat-label { color: #6366f1; }
.stat-cell.green .stat-label { color: #16a34a; }
.stat-cell.orange .stat-label { color: #ea580c; }
.stat-cell.red .stat-label { color: #e11d48; }
.stat-val { font-size: 22px; font-weight: bold; line-height: 1.2; }
.stat-cell.blue .stat-val { color: #1e293b; }
.stat-cell.green .stat-val { color: #15803d; }
.stat-cell.orange .stat-val { color: #c2410c; }
.stat-cell.red .stat-val { color: #be123c; }
.stat-sub { font-size: 9px; color: #94a3b8; }

/* Tables */
.data-table { width: 100%; border-collapse: collapse; font-size: 10px; }
.data-table thead tr { background: #1e3a5f; color: #fff; }
.data-table th { padding: 7px 9px; font-weight: 600; text-align: center; }
.data-table tbody tr.even { background: #f8fafc; }
.data-table tbody tr { background: #fff; }
.data-table td { padding: 5.5px 9px; border-bottom: 1px solid #f1f5f9; }
.rank-table { width: 100%; border-collapse: collapse; font-size: 10px; }
.rank-table thead tr { background: #f8fafc; }
.rank-table th { padding: 5px 8px; text-align: center; color: #374151; font-weight: 600; border-bottom: 1px solid #e5e7eb; }
.rank-table td { padding: 5px 8px; border-bottom: 1px solid #f1f5f9; }
.top-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 18px; margin-bottom: 18px; }

/* Utilities */
.tc { text-align: center; }
.gray { color: #6b7280; }
.muted { color: #d1d5db; }
.green-txt { color: #16a34a; }
.orange-txt { color: #d97706; }
.red-txt { color: #dc2626; }
.bold-name { font-weight: 500; color: #111827; }
.bold-pct { font-weight: 700; }
.badge { font-size: 9px; font-weight: 600; padding: 2px 6px; border-radius: 3px; }
.badge-green { background: #dcfce7; color: #15803d; }
.badge-yellow { background: #fef9c3; color: #a16207; }
.badge-red { background: #fee2e2; color: #b91c1c; }

/* Notes & TTD */
.notes-block { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 4px; padding: 10px 14px; margin-bottom: 20px; font-size: 10px; color: #475569; line-height: 1.7; }
.notes-title { font-weight: 600; margin-bottom: 2px; }
.ttd-grid { display: grid; grid-template-columns: 1fr 1fr 1fr; }
.ttd-block { text-align: center; font-size: 10px; color: #374151; }
.ttd-space { height: 56px; }
.ttd-space.sm { height: 44px; }
.ttd-line { border-top: 1px solid #374151; padding-top: 4px; margin: 0 20px; }
.ttd-name { font-weight: 600; color: #111827; }
.ttd-role { color: #6b7280; }

/* Spinner */
.spinner { display: inline-block; width: 14px; height: 14px; border: 2px solid rgba(255,255,255,.4); border-top-color: #fff; border-radius: 50%; animation: spin .7s linear infinite; }
.spinner.lg { width: 36px; height: 36px; border: 3px solid #e2e8f0; border-top-color: #3b82f6; }
@keyframes spin { to { transform: rotate(360deg); } }

/* Transitions */
.fade-enter-active, .fade-leave-active { transition: opacity .15s, transform .15s; }
.fade-enter-from, .fade-leave-to { opacity: 0; transform: translateX(-4px); }
.dl-label { /* teks label tombol */
  display: inline;
}
@media (max-width: 600px) {
  .btn-download .dl-label { display: none; }
  .btn-download { padding: 7px 10px; }
  .topbar { padding: 0 10px; }
}
/* ===== RESPONSIVE: mobile filter bar wraps ===== */
@media (max-width: 639px) {
  .filter-bar { height: auto; padding: 10px 14px; flex-wrap: wrap; gap: 10px; top: 52px; }
  .filter-item { flex: 1 1 auto; min-width: 120px; }
  .filter-search-wrap { width: 100%; }
  .filter-actions { flex: 0 0 auto; }
  .legend { display: none; }
  .preview-main { padding: 16px 8px; }
}
</style>