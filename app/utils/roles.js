export const ROLES = {
  ADMIN: 'admin',
  KM: 'km',
  PIKET: 'piket',
  KS: 'ks'
}

export const ROLE_MENUS = {
  [ROLES.ADMIN]: [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { type: 'divider', label: 'Classroom Management' },
    { path: '/classroom', label: 'Data Kelas', icon: 'School' },
    { path: '/subjects', label: 'Mata Pelajaran', icon: 'BookOpen' },
    { path: '/schedule', label: 'Jadwal Pelajaran', icon: 'Calendar' },
    { type: 'divider', label: 'User Management' },
    { path: '/users', label: 'User', icon: 'Users' },
    { path: '/teacher', label: 'Guru', icon: 'Users' }
  ],

  [ROLES.KM]: [
    { path: '/presensi', label: 'Presensi', icon: 'ClipboardCheck' },
    { path: '/riwayat-presensi', label: 'Riwayat Presensi', icon: 'History' },
  ],

  [ROLES.PIKET]: [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { path: '/attendance', label: 'Absensi', icon: 'ClipboardCheck' }
  ],

  [ROLES.KS]: [
    { path: '/', label: 'Dashboard', icon: 'Home' },
    { type: 'divider', label: 'Reporting' },
    { path: '/reports', label: 'Laporan', icon: 'FileText' },
    { path: '/teacher', label: 'Guru', icon: 'Users' }
  ]
}

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: ['/', 'classroom', 'subjects', 'schedule', 'users', 'teacher', 'profile'],
  [ROLES.KM]: ['presensi', 'riwayat-presensi', 'profile'],
  [ROLES.PIKET]: ['/', 'attendance', 'profile'],
  [ROLES.KS]: ['/', 'reports', 'teacher', 'profile']
}

export const ROLE_DEFAULT_ROUTES = {
  [ROLES.ADMIN]: '/',
  [ROLES.KM]: '/presensi',
  [ROLES.PIKET]: '/',
  [ROLES.KS]: '/'
}

export const ROLE_LABELS = {
  [ROLES.ADMIN]: 'Administrator',
  [ROLES.KM]: 'Ketua Murid',
  [ROLES.PIKET]: 'Petugas Piket',
  [ROLES.KS]: 'Kepala Sekolah'
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