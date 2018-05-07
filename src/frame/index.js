
export default (goshawk) => {
  goshawk.router({
    path: '/dashboard',
    component: () => import('./routes/dashboard/'),
  })
  goshawk.router({
    path: '/login',
    component: () => import('./routes/login/'),
  })
}
