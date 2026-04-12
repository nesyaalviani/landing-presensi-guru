export const ROLES = {
  ADMIN: 'admin',
  KM: 'km',
  PIKET: 'piket',
  KS: 'ks',
  PENGAWAS: 'pengawas'
}

export const ROLE_MENUS = {
  [ROLES.ADMIN]: [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { type: 'divider', label: 'Presensi' },
    { path: '/approval', label: 'Presensi', icon: 'ClipboardCheck' },
    { path: '/statistics', label: 'Statistik', icon: 'ChartLine' },
    { path: '/kalender', label: 'Kalender Akademik', icon: 'CalendarCog' },
    { type: 'divider', label: 'Classroom Management' },
    { path: '/classroom', label: 'Data Kelas', icon: 'School' },
    { path: '/subjects', label: 'Mata Pelajaran', icon: 'BookOpen' },
    { path: '/schedule', label: 'Jadwal Pelajaran', icon: 'Calendar' },
    { type: 'divider', label: 'User Management' },
    { path: '/users', label: 'User', icon: 'User' },
    { path: '/teacher', label: 'Data Guru', icon: 'Users' },
    { type: 'divider', label: 'Pengaturan' },
    { path: '/settings', label: 'Pengaturan', icon: 'Settings' },

  ],

  [ROLES.KM]: [
    { path: '/presensi', label: 'Presensi', icon: 'ClipboardCheck' },
    { path: '/riwayat-presensi', label: 'Riwayat Presensi', icon: 'History' },
    { path: '/kalender', label: 'Kalender', icon: 'Calendar' },
  ],

  [ROLES.PIKET]: [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { path: '/approval', label: 'Presensi', icon: 'ClipboardCheck' }
  ],

  [ROLES.KS]: [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { type: 'divider', label: 'Reporting' },
    { path: '/statistics', label: 'Statistik Presensi', icon: 'ChartLine' },
    { path: '/kalender', label: 'Kalender', icon: 'Calendar' },
    
  ],

  [ROLES.PENGAWAS]: [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { type: 'divider', label: 'Reporting' },
    { path: '/statistics', label: 'Statistik Presensi', icon: 'ChartLine' },
    { path: '/kalender', label: 'Kalender', icon: 'Calendar' },
  ]
}

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['/', 'classroom', 'subjects', 'schedule', 'users', 'teacher', 'profile', 'statistics', 'kalender', 'approval', 'settings'],
  [ROLES.KM]: ['presensi', 'riwayat-presensi', 'profile', 'kalender'],
  [ROLES.PIKET]: ['/', 'approval', 'profile'],
  [ROLES.KS]: ['/', 'statistics', 'kalender', 'profile'],
  [ROLES.PENGAWAS]: ['/', 'statistics', 'kalender', 'profile']
}

export const ROLE_DEFAULT_ROUTES = {
  [ROLES.ADMIN]: '/',
  [ROLES.KM]: '/presensi',
  [ROLES.PIKET]: '/',
  [ROLES.KS]: '/',
  [ROLES.PENGAWAS]: '/'
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.KM]: 'Ketua Murid',
  [ROLES.PIKET]: 'Petugas Piket',
  [ROLES.KS]: 'Kepala Sekolah',
  [ROLES.PENGAWAS]: 'Pengawas'
}

export function getMenuByRole(role) {
  return ROLE_MENUS[role] || []
}

export function getRoleLabel(role) {
  return ROLE_LABELS[role] || 'User'
}

export function canAccessPage(role, page) {
  const permissions = ROLE_PERMISSIONS[role] || []
  return permissions.includes(page)
}

// Fungsi untuk mendapatkan default route berdasarkan role
export function getDefaultRoute(role) {
  return ROLE_DEFAULT_ROUTES[role] || '/'
}