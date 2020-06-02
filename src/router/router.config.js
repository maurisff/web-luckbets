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
  }, {
    path: '/cadastro/pessoas',
    meta: {   
      codigo: 'CAD001',
      isMenu: true,
      order: 1,
      title: 'Pessoas',
      icon: 'people',
      groupOrder: 1,
      groupTitle: 'Cadastro',
      groupIcon: 'create'
    },
    component: lazyLoading('cadastro/Pessoa')
  }, {
    path: '/administracao/modalidade',
    meta: {
      codigo: 'ADM001',
      isMenu: true,
      order: 1,
      title: 'Modalidade',
      icon: 'mdi-clover',
      groupOrder: 2,
      groupTitle: 'Administração',
      groupIcon: 'mdi-tools',
      isAdmin: true
    },
    component: lazyLoading('layout/Home')
  }, {
    path: '/administracao/usuarios',
    meta: {
      codigo: 'ADM002',
      isMenu: true,
      order: 2,
      title: 'Usuarios',
      icon: 'mdi-account-details-outline',
      groupOrder: 2,
      groupTitle: 'Administração',
      groupIcon: 'mdi-tools',
      isAdmin: true
    },
    component: lazyLoading('layout/Home')
  }, {
    path: '/administracao/envioemail',
    meta: {
      codigo: 'ADM003',
      isMenu: true,
      order: 3,
      title: 'Config. Email',
      icon: 'mdi-email-send-outline',
      groupOrder: 2,
      groupTitle: 'Administração',
      groupIcon: 'mdi-tools',
      isAdmin: true
    },
    component: lazyLoading('layout/Home')
  },
  {
    path: '/usuario',
    meta: {
      codigo: 'ADM999',
      isMenu: true,
      order: 99,
      title: 'Perfil',
      icon: 'mdi-account-circle-outline'
    },
    component: lazyLoading('layout/Home')
  }

]