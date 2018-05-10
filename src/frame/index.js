export default {
  l18n:{
    cn: require('./l18n/cn'),  },
  models:{
    app: require('./models/app'),
    menu: require('./models/menu'),
    page: require('./models/page'),
    source: require('./models/source'),
    ws: require('./models/ws'),
  },
  pages:[{
    path: '/dashboard',
    component: () => import('./pages/dashboard/'),
  },{
    path: '/login',
    component: () => import('./pages/login/'),
  }],
  resources:{

  }
}
