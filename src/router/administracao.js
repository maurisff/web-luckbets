  import lazyLoading from '@/util/lazyLoading'
  const menuGroup = {
    groupOrder: 2,
    groupTitle: 'Administração',
    groupIcon: 'mdi-tools',
    groupColorIcon: null,
  }

  export default [
  {
    path: '/administracao/modalidade',
    meta: {
      codigo: 'ADM001',
      isMenu: true,
      order: 1,
      title: 'Modalidade',
      icon: 'mdi-clover',
      colorIcon: null,
      ...menuGroup,
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
      ...menuGroup,
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
      ...menuGroup,
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
      ...menuGroup,
      isAdmin: true
    },
    component: lazyLoading('administracao/Sorteios')
  }
]