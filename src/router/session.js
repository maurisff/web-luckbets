  import lazyLoading from '@/util/lazyLoading'

  export default [
    {
      path: '/acesso/entrar',
      meta: {
          codigo: 'AUT001',
          title: 'Login',
          isPublic: true
      },
      component: lazyLoading('acesso/Entrar')
  }, {
      path: '/acesso/registrar',
      meta: {
          codigo: 'AUT002',
          title: 'Registre-se',
          isPublic: true
      },
      component: lazyLoading('acesso/Registre-se')
  }, {
    path: '/acesso/finalizar',
    meta: {
        codigo: 'AUT003',
        title: 'Finalizar',
        isPublic: true
    },
    component: lazyLoading('acesso/Finalizar')
  }, {
      path: '/acesso/logout',
      meta: {
          codigo: 'AUT004',
          title: 'Logout'
      },
      component: lazyLoading('acesso/Logout')
  }, {
      path: '/acesso/senha',
      meta: {
          codigo: 'AUT005',
          title: 'Senha'
      },
      component: lazyLoading('acesso/Senha')
  }, {
      path: '/acesso/senha/:id',
      meta: {
        codigo: 'AUT006',
        title: 'Nova Senha'
      },
      component: lazyLoading('acesso/Senha')
  }
]