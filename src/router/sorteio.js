  import lazyLoading from '@/util/lazyLoading'
  const menuGroup = {
    groupOrder: 2,
    groupTitle: 'Sorteios',
    groupIcon: 'mdi-clover',
    groupColorIcon: null
  }
  export default [
  {
    path: '/sorteio/megasena',
    meta: {
      modalidade : {
        titulo: 'Megasena',
        codigo: 'MEGASENA'
      },
      codigo: 'MOD001',
      isMenu: true,
      order: 1,
      title: 'Megasena',
      icon: 'mdi-clover',
      colorIcon: '#209869',
      ...menuGroup
    },
    component: lazyLoading('sorteios/Sorteio')
  }, {
    path: '/sorteio/lotofacil',
    meta: {
      modalidade : {
        titulo: 'Lotofácil',
        codigo: 'LOTOFACIL'
      },
      codigo: 'MOD002',
      isMenu: true,
      order: 2,
      title: 'Lotofácil',
      icon: 'mdi-clover',
      colorIcon: '#930089',
      ...menuGroup
    },
    component: lazyLoading('sorteios/Sorteio')
  }, {
    path: '/sorteio/quina',
    meta: {
      modalidade : {
        titulo: 'Quina',
        codigo: 'QUINA'
      },
      codigo: 'MOD003',
      isMenu: true,
      order: 3,
      title: 'Quina',
      icon: 'mdi-clover',
      colorIcon: '#260085',
      ...menuGroup
    },
    component: lazyLoading('sorteios/Sorteio')
  }, {
    path: '/sorteio/diadesorte',
    meta: { 
      modalidade : {
        titulo: 'Dia de Sorte',
        codigo: 'DIADESORTE'
      },  
      codigo: 'MOD004',
      isMenu: true,
      order: 4,
      title: 'Dia de Sorte',
      icon: 'mdi-clover',
      colorIcon: '#cb852b',
      ...menuGroup
    },
    component: lazyLoading('sorteios/Sorteio')
  }, {
    path: '/sorteio/lotomania',
    meta: {   
      modalidade : {
        titulo: 'Lotomania',
        codigo: 'LOTOMANIA'
      },
      codigo: 'MOD005',
      isMenu: true,
      order: 5,
      title: 'Lotomania',
      icon: 'mdi-clover',
      colorIcon: '#f78100',
      ...menuGroup
    },
    component: lazyLoading('sorteios/Sorteio')
  }
]