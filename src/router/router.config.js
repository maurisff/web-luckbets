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
      colorIcon: null,
      groupOrder: 1,
      groupTitle: 'Cadastro',
      groupIcon: 'create',
      groupColorIcon: null
    },
    component: lazyLoading('cadastro/Pessoa')
  }, {
    path: '/modalidade/megasena',
    meta: {   
      codigo: 'MOD001',
      isMenu: true,
      order: 1,
      title: 'Megasena',
      icon: 'mdi-clover',
      colorIcon: '#209869',
      groupOrder: 2,
      groupTitle: 'Sorteios',
      groupIcon: 'create',
      groupColorIcon: null
    },
    component: lazyLoading('layout/Home')
  }, {
    path: '/modalidade/lotofacil',
    meta: {   
      codigo: 'MOD002',
      isMenu: true,
      order: 2,
      title: 'Lotofácil',
      icon: 'mdi-clover',
      colorIcon: '#930089',
      groupOrder: 2,
      groupTitle: 'Sorteios',
      groupIcon: 'create',
      groupColorIcon: null
    },
    component: lazyLoading('layout/Home')
  }, {
    path: '/modalidade/quina',
    meta: {   
      codigo: 'MOD003',
      isMenu: true,
      order: 3,
      title: 'Quina',
      icon: 'mdi-clover',
      colorIcon: '#260085',
      groupOrder: 2,
      groupTitle: 'Sorteios',
      groupIcon: 'create',
      groupColorIcon: null
    },
    component: lazyLoading('layout/Home')
  }, {
    path: '/modalidade/diadesorte',
    meta: {   
      codigo: 'MOD004',
      isMenu: true,
      order: 4,
      title: 'Dia de Sorte',
      icon: 'mdi-clover',
      colorIcon: '#cb852b',
      groupOrder: 2,
      groupTitle: 'Sorteios',
      groupIcon: 'create',
      groupColorIcon: null
    },
    component: lazyLoading('layout/Home')
  }, {
    path: '/modalidade/lotomania',
    meta: {   
      codigo: 'MOD005',
      isMenu: true,
      order: 5,
      title: 'Lotomania',
      icon: 'mdi-clover',
      colorIcon: '#f78100',
      groupOrder: 2,
      groupTitle: 'Sorteios',
      groupIcon: 'create',
      groupColorIcon: null
    },
    component: lazyLoading('layout/Home')
  }, {
    path: '/administracao/modalidade',
    meta: {
      codigo: 'ADM001',
      isMenu: true,
      order: 1,
      title: 'Modalidade',
      icon: 'mdi-clover',
      colorIcon: null,
      groupOrder: 2,
      groupTitle: 'Administração',
      groupIcon: 'mdi-tools',
      groupColorIcon: null,
      isAdmin: true
    },
    component: lazyLoading('administracao/Modalidade')
  }, {
    path: '/administracao/usuarios',
    meta: {
      codigo: 'ADM002',
      isMenu: true,
      order: 2,
      title: 'Usuarios',
      icon: 'mdi-account-details-outline',
      colorIcon: null,
      groupOrder: 2,
      groupTitle: 'Administração',
      groupIcon: 'mdi-tools',
      groupColorIcon: null,
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
      colorIcon: null,
      groupOrder: 2,
      groupTitle: 'Administração',
      groupIcon: 'mdi-tools',
      groupColorIcon: null,
      isAdmin: true
    },
    component: lazyLoading('layout/Home')
  },{
    path: '/administracao/sorteios',
    meta: {
      codigo: 'ADM004',
      isMenu: true,
      order: 4,
      title: 'Sorteios',
      icon: 'mdi-cog-refresh',
      colorIcon: null,
      groupOrder: 2,
      groupTitle: 'Administração',
      groupIcon: 'mdi-tools',
      groupColorIcon: null,
      isAdmin: true
    },
    component: lazyLoading('administracao/Sorteios')
  }, {
    path: '/usuario',
    meta: {
      codigo: 'ADM999',
      isMenu: true,
      order: 99,
      title: 'Perfil',
      icon: 'mdi-account-circle-outline',
      colorIcon: null
    },
    component: lazyLoading('layout/Home')
  }

]