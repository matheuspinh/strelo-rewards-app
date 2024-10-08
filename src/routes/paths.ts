// ----------------------------------------------------------------------

const ROOTS = {
  AUTH: '/auth',
  DASHBOARD: '/dashboard',
  USER: '/user'
};

// ----------------------------------------------------------------------

export const paths = {
  minimalUI: 'https://mui.com/store/items/minimal-dashboard/',
  // AUTH
  auth: {
    jwt: {
      login: `${ROOTS.AUTH}/jwt/login`,
      register: `${ROOTS.AUTH}/jwt/register`,
    },
  },
  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    users: `${ROOTS.DASHBOARD}/users`,
    missions: `${ROOTS.DASHBOARD}/missions`,
    badges: `${ROOTS.DASHBOARD}/badges`,
    privileges: `${ROOTS.DASHBOARD}/privileges`,
    levels: `${ROOTS.DASHBOARD}/levels`,
    group: {
      root: `${ROOTS.DASHBOARD}/group`,
      five: `${ROOTS.DASHBOARD}/group/five`,
      six: `${ROOTS.DASHBOARD}/group/six`,
    },
  },
  // USER
  user: {
    root: ROOTS.USER
  }
};
