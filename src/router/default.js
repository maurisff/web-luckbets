  import lazyLoading from '@/util/lazyLoading'

  export default [
    {
      path: '/',
      meta: {
        codigo: 'PAG000',
        isMenu: true,
        order: 0,
        title: 'Home',
        icon: 'home',
        colorIcon: null,
        isPublic: true
      },
      component: lazyLoading('layout/Home')
    }, {
      path: '/erro/404',
      meta: {
        isPublic: true
      },
      component: lazyLoading('erro/NotFound')
    }, {
      path: '/erro/ops',
      meta: {
            isPublic: true
      },
      component: lazyLoading('erro/OtherErro')
    },
    {
      path: '/perfil',
      meta: {
        codigo: 'ADM999',
        isMenu: true,
        order: 99,
        title: 'Perfil',
        icon: 'mdi-account-circle-outline',
        colorIcon: null
      },
      component: lazyLoading('layout/Profile')
    }
]