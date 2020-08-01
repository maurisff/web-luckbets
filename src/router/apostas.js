  import lazyLoading from '@/util/lazyLoading'
  
  const menuGroup = {
    groupOrder: 2,
    groupTitle: 'Minhas Apostas',
    groupIcon: 'mdi-clover',
    groupColorIcon: null
  }
  
  export default [
    {
    path: '/aposta/megasena',
    meta: {   
      modalidade : {
        titulo: 'Megasena',
        codigo: 'MEGASENA'
      },
      codigo: 'APT001',
      isMenu: true,
      order: 1,
      title: 'Megasena',
      icon: 'mdi-clover',
      colorIcon: '#209869',
      ...menuGroup
    },
    component: lazyLoading('aposta/Apostas')
  }
]