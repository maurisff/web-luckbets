export default {
  namespaced: true,  
  state: {
    startingApp: false,       // variavel para controle de inicialização
    loading: false,           // variavel para controle de processamento ce carregamento de dados
    processing: false,        // variavel para controle processando de dados.
    processingLabel: null,    // variavel para controle processando de dados e exibição de texto de processamento.
    message: null,
    erro: null
  },
  mutations: {
    setStartingApp (state, payload) {
      state.startingApp = payload
    },    
    setLoading (state, payload) {
      state.loading = payload
    },     
    setProcessing (state, payload) {
      state.processing = payload
    }, 
    setProcessingLabel (state, payload) {
      state.processingLabel = payload
    },
    setMessage (state, payload) {
      state.message = payload
    },
    clearMessage (state) {
      state.message = null
    },
    setErro (state, payload) {
      state.erro = payload
    }
  },
  actions: {
    async initialize ({dispatch}, payload) {      
      await dispatch('authentication/onAuth', null, { root: true });
      console.log('Pages: ', payload)
      /*
      if (process.env.NODE_ENV !== 'development' && payload && Array.isArray(payload)){
        app.post('api/public/checkUpdateAll', payload).then((response) => {
          if (response.data && !response.data.status){
            console.log('checkPaginas not success response: ', response.data)
          }
        }).catch(error => {
          dispatch('app/setMessage', {
            type: 'error',
            message: 'Erro na inicialização da pagina:\n' + error
          }, { root: true })
        })

      }*/
      // dispatch('app/setStartingApp', false, { root: true })
    },
    setStartingApp ({commit}, payload) {
      commit('setStartingApp', payload)
    },
    setLoading ({commit}, payload) {
      commit('setLoading', payload)
    },       
    setProcessing ({commit}, payload) {
      commit('setProcessingLabel',null)
      if (!payload){
        commit('setProcessing',false)
      } else {
        commit('setProcessing',true)
        if (typeof payload === 'string'){
          commit('setProcessingLabel',payload)
        }
      }
    }, 
    setMessage ({commit}, payload) {
      commit('setMessage',payload)
    },
    clearMessage ({commit}) {
      commit('clearMessage')
    },
    setErro ({commit}, payload) {
      commit('setErro', payload)
    }
  },
  getters: {
    isStartingApp (state) {
      return state.startingApp
    },
    isLoading (state) {
      return state.loading
    },
    isProcessing (state) {
      return state.processing
    },
    getProcessingLabel (state) {
      return state.processingLabel
    },
    getMessage(state){
      return state.message
    },
    getErro(state){
      return state.erro
    }
  }
}
