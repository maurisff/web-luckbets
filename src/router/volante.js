  import lazyLoading from '@/util/lazyLoading'
  
  const menuGroup = {
    groupOrder: 1,
    groupTitle: 'Aportar',
    groupIcon: 'mdi-clover',
    groupColorIcon: null
  }
  
  export default [
    {
    path: '/volante/megasena/apostar',
    meta: {   
      modalidade : {
        titulo: 'Megasena',
        codigo: 'MEGASENA'
      },
      codigo: 'VOL001',
      isMenu: true,
      order: 1,
      title: 'Megasena',
      icon: 'mdi-clover',
      colorIcon: '#209869',
      ...menuGroup
    },
    component: lazyLoading('aposta/Volante')
  }, {
    path: '/volante/lotofacil/apostar',
    meta: {   
      modalidade : {
        titulo: 'Lotofácil',
        codigo: 'LOTOFACIL'
      },
      codigo: 'VOL002',
      isMenu: true,
      order: 2,
      title: 'Lotofácil',
      icon: 'mdi-clover',
      colorIcon: '#930089',
      ...menuGroup
    },
    component: lazyLoading('aposta/Volante')
  }, {
    path: '/volante/quina/apostar',
    meta: {
      modalidade : {
        titulo: 'Quina',
        codigo: 'QUINA'
      },
      codigo: 'VOL003',
      isMenu: true,
      order: 3,
      title: 'Quina',
      icon: 'mdi-clover',
      colorIcon: '#260085',
      ...menuGroup
    },
    component: lazyLoading('aposta/Volante')
  }, {
    path: '/volante/diadesorte/apostar',
    meta: { 
      modalidade : {
        titulo: 'Dia de Sorte',
        codigo: 'DIADESORTE'
      },  
      codigo: 'VOL004',
      isMenu: true,
      order: 4,
      title: 'Dia de Sorte',
      icon: 'mdi-clover',
      colorIcon: '#cb852b',
      ...menuGroup
    },
    component: lazyLoading('aposta/Volante')
  }, {
    path: '/volante/lotomania/apostar',
    meta: {   
      modalidade : {
        titulo: 'Lotomania',
        codigo: 'LOTOMANIA'
      },
      codigo: 'VOL005',
      isMenu: true,
      order: 5,
      title: 'Lotomania',
      icon: 'mdi-clover',
      colorIcon: '#f78100',
      ...menuGroup
    },
    component: lazyLoading('aposta/Volante')
  }
]