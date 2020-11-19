import app from '@/services/app'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/messaging';
export default {
  namespaced: true, 
  state: {
    loggingIn:false,
    user: null,
    isChangePasswordUser: null
  },
  mutations: {
    setLoggingIn (state, payload) {
      state.loggingIn = payload
    },
    setUsuario (state, payload) {
      state.user = payload
    },
    setIsChangePassword (state, payload) {
      state.isChangePasswordUser = payload
    }
  },
  actions: {
    async onAuth ({commit, dispatch}) {
      firebase.auth().onAuthStateChanged(async (currentUser) => {
        await dispatch('setUsuario', currentUser);
        if (firebase.auth().currentUser) {
          Notification.requestPermission().then(async function (permission) {
            if (permission === "granted") {
              firebase.messaging().getToken().then(async function (refreshedToken) {
                // await app.post(`/api/messagingtoken/${refreshedToken}`, {});
                await app.post(`/api/messagingtoken`, {token : refreshedToken});
              }).catch(function () { });
            }
          });
        }
        commit('setLoggingIn', false);
        dispatch('app/setStartingApp', false, { root: true });
      })
    },
    async loginAction ({commit, dispatch}, payload) {
      const { idProvider, email, senha } = payload;
      commit('setLoggingIn', true)    
      if (idProvider){
        await loginProvider(idProvider).catch(async error => {
          commit('setLoggingIn', false);
          const alert = await errorFirebase(error)
          if (alert){
            dispatch('app/setMessage', { message: alert }, { root: true })
          }
        });
      } else {
        await loginEmailSenha(email, senha).catch(async error => {
          commit('setLoggingIn', false);
          const alert = await errorFirebase(error)
          if (alert){
            dispatch('app/setMessage', { message: alert }, { root: true })
          }
        });
      }
    },
    async registrerAction ({commit, dispatch}, payload) {
      const { uid, email, nome, senha } = payload;
      var messagingToken = null;
      commit('setLoggingIn', true)  
      try {
        try {
          if (await Notification.requestPermission() === "granted"){
            messagingToken = await firebase.messaging().getToken();
          }
        } catch (error) {
          messagingToken = null
        }
        const response = await app.post('api/authentication/registration', { uid, email, nome, senha, messagingToken } );
        if (response.status === 200 && response.data && response.data.success){
          dispatch('app/setMessage', {
            type: 'success',
            message: `Usuário (${nome}) cadastrado com sucesso!`
          }, { root: true })   
          // commit('setUsuario', null); 
          
          await dispatch('setUsuario', firebase.auth().currentUser);
          commit('setLoggingIn', false)          
        } else if (response.status === 200 && response.data && !response.data.success){
          throw  new Error(response.data.message);
        } else {
          throw  response.data;
        }
      } catch (error) {
        commit('setLoggingIn', false)
        if (error && error.errorType && error.message ){
          dispatch('app/setMessage', {
            type: error.errorType,
            message: error.message
          }, { root: true })
        } else {
          dispatch('app/setMessage', {
            type: 'error',
            message: error
          }, { root: true })
        }
        
      }
    },
    async logout ({commit}) {
      firebase.auth().signOut();
      commit('setUsuario', null);
    },     
    async setLoggingIn ({commit}, payload) {
      commit('setLoggingIn', payload)
    },
    async setIsChangePassword ({commit}, payload) {
      commit('setIsChangePassword', payload)
    },
    async setUsuario ({commit}, payload) {  
      var currentAuth = null;
        if (payload) {
          var { uid, displayName, email, senha, emailVerified, providerData } = await payload;
          currentAuth = await { uid, displayName, email, senha,emailVerified, providerData: providerData ? providerData.map(e => e.providerId): null };
        }
      if (currentAuth) {
        try {
          const response = await app.get(`/api/usuariologado/usuario`);
          if (response.status === 200 && response.data && response.data.success) {
            let vData = response.data.data || {};
            currentAuth = Object.assign(vData, currentAuth);
          }
        } catch (error) {
          currentAuth = null;
          // console.error('app.get => /api/usuariologado/usuario - Error: ', error, error.code)
          logger.addLogger('error', ['app.get => /api/usuariologado/usuario - Error: ', error, error.code])
        }
      }
      
      if (!currentAuth && firebase.auth().currentUser){
        firebase.auth().signOut();
      }
      await commit('setUsuario', currentAuth);
    },
  },
  getters: {
    isLoggingIn (state) {
      return state.loggingIn
    },
    user (state) {
      return state.user
    },
    isChangePasswordUser (state) {
      return state.isChangePasswordUser
    }
  }
}


var errorFirebase = async (error) => {
  if (error.code === 'auth/email-already-in-use'){
    return 'Email ja possui uma conta cadastrada!';
  } else if (error.code === 'auth/invalid-email'){
    return 'Email não é válido!';
  } else if (error.code === 'auth/operation-not-allowed'){
    return 'A conta vinculada ao email está desativada!';
  } else if (error.code === 'auth/weak-password'){
    return 'A senha é fraca!';
  } else if (error.code === 'auth/user-disabled'){
    return 'Conta desativada.';
  } else if (error.code === 'auth/user-not-found'){
    return 'Usuário não cadastrado!';
  } else if (error.code === 'auth/wrong-password'){
    return 'A senha do usuário esta errada!';
  } else if (error.code === ''){
    return 'A senha é fraca!';
  }else{
    return null;
  }
}

var loginEmailSenha = async (email, senha) => {  
  await firebase.auth().signInWithEmailAndPassword(email,senha);
}

var loginProvider = async (idProvider) => {
  var provider = null;
  if (idProvider === 'GOOGLE'){
    provider = new firebase.auth.GoogleAuthProvider();
    provider.addScope('profile');
    provider.addScope('email');
  } else if (idProvider === 'FACEBOOK'){
    provider = new firebase.auth.FacebookAuthProvider();
    provider.addScope('name');
    provider.addScope('first_name');
    provider.addScope('last_name');
    provider.addScope('email');
  } else if (idProvider === 'TWITTER'){
    provider = new firebase.auth.TwitterAuthProvider();
  } else {    
    throw new Error(`ID do Provedor (${idProvider}) não encontrado!`);
  }
  if (!app.util.isMobile()){
    await firebase.auth().signInWithPopup(provider);
  }else{
    await firebase.auth().signInWithRedirect(provider);
  }  
  await firebase.auth().getRedirectResult()
}