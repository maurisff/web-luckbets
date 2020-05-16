import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store/'
import configRouter from '@/router/router.config'

Vue.use(Router)

var INSTANCE_ROUTER = new Router({
  //mode: 'history', //com isso no FirebaseHosting se perde na hora de carregar a pagina pela URL
  routes: [{
      path: '*',
      redirect: '/erro/404'
    },
    ...configRouter
    //...generateRoutesFromMenu(store.getters['menu/getMenu'])
    //...generateRoutesFromMenu(configRouter)
  ]
})


INSTANCE_ROUTER.beforeEach(async (to, from, next) => {
  if (store.getters['authentication/user'] && !store.getters['authentication/user']._id && !to.fullPath.includes('/acesso/finalizar')){    
    next({
      path: '/acesso/finalizar',
      query: { redirect: to.fullPath }
    });
  } else if (store.getters['authentication/user'] && to.fullPath.includes('/acesso/entrar')){    
    next({
      path: '/',
      query: { redirect: to.fullPath }
    });
  } else if (!to.matched.some(record => record.meta.pagePublic)){    
    if (!store.getters['authentication/user']) {      
      next({
        path: '/acesso/entrar',
        query: { redirect: to.fullPath }
      });
    } else if(!store.getters['authentication/user']._id && !to.fullPath.includes('/acesso/finalizar')){ 
      store.dispatch('app/setErro', 'Você ainda não possui um perfil de usuario para acesso ao sistema.', { root: true });
      next({
        path: '/erro/ops'
      });
    } else if(to.matched.some(record => record.meta.requiresAdmin) && !store.getters['authentication/user'].admin ){ 
      store.dispatch('app/setErro', 'Acesso restrito a administração do Sistema!', { root: true });
      next({
        path: '/erro/ops'
      });
    } else{
      next();
    }
  } else {
    next();
  }
})

export default INSTANCE_ROUTER
