
export default (goshawk) => {
  goshawk.router({
    path: '/dashboard',
    component: () => import('./pages/dashboard/'),
  })
  goshawk.router({
    path: '/login',
    component: () => import('./pages/login/'),
  })
}
