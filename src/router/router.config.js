  import lazyLoading from '@/util/lazyLoading'

  export default [
    {
      path: '//',
      meta: {
        codigo: 'PAG000',
        title: 'Home',
        isMenu: true,
        MenuTitle: '',
        pagePublic: true
      },
      component: lazyLoading('layout/Home')
    }, {
      path: '/erro/404',
      meta: {
        pagePublic: true
      },
      component: lazyLoading('erro/NotFound')
    }, {
      path: '/erro/ops',
      meta: {
            pagePublic: true
      },
      component: lazyLoading('erro/OtherErro')
    },
    {
      path: '/acesso/entrar',
      meta: {
          codigo: 'AUT001',
          title: 'Login',
          pagePublic: true
      },
      component: lazyLoading('acesso/Entrar')
  }, {
      path: '/acesso/registrar',
      meta: {
          codigo: 'AUT002',
          title: 'Registre-se',
          pagePublic: true
      },
      component: lazyLoading('acesso/Registre-se')
  }, {
    path: '/acesso/finalizar',
    meta: {
        codigo: 'AUT003',
        title: 'Finalizar',
        pagePublic: true
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
  }, {
    path: '/cadastro/pessoas',
    meta: {
      codigo: 'CAD001',
      title: 'Pessoas',
      MenuTitle: 'Cadastro',
      menuClassIcon: null,
      menuPathIcon: null,
      classIcon: null,
      pathIcon: null,
      isMenu: true
    },
    component: lazyLoading('cadastro/Pessoa')
  }

]