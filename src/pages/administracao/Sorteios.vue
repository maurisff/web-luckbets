<template>
  <v-container v-if="!isLoading" fluid grid-list-lg>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="6" xl="6">
        <v-card>
          <v-card-title>Buscar concursos não listados</v-card-title>
          <v-card-text>
            <v-row align="center" >
              <v-col cols="12" xs="12" sm="10" lg="9" xl="10">
                <v-select
                  v-model="selectedGet"
                  :items="modalidades"
                  label="Modalidade"
                  v-validate="'required'"
                  data-vv-name="get.selectedGet" 
                  :error-messages="errors.collect('get.selectedGet')" 
                  data-vv-scope="get" >
                </v-select>
              </v-col>
              <v-col cols="12" xs="12" sm="2" lg="3" xl="2">
                <v-btn color="blue" block  outlined @click.stop="getSemResultado">Buscar</v-btn>                
              </v-col>
            </v-row>            
            <div v-if="dataGet">
              {{dataGet}}
            </div>
          </v-card-text>
        </v-card>
      </v-col>      
      <v-col cols="12" sm="12" md="12" lg="6" xl="6">
        <v-card>
          <v-card-title >Consultar sorteios na Caixa</v-card-title>
          <v-card-text>            
            <v-row align="center" >
              <v-col cols="12" xs="12" sm="10" lg="9" xl="10">
                <v-select
                  v-model="selectedPost"
                  :items="modalidades"
                  label="Modalidade"
                  v-validate="'required'"
                  data-vv-name="post.selectedPost" 
                  :error-messages="errors.collect('post.selectedPost')" 
                  data-vv-scope="post" >
                </v-select>
              </v-col>
              <v-col cols="12" xs="12" sm="2" lg="3" xl="2">
                <v-btn color="blue" block  outlined @click.stop="postBuscaResultado">Consultar</v-btn>
              </v-col>
            </v-row>   
            <v-row align="center" justify="space-around">
              <v-switch v-model="ignoreErrors" class="ma-2" label="Ignorar Erros"></v-switch>
              <v-switch v-model="forceUpdate" class="ma-2" label="Atualizar"></v-switch>     
            </v-row>
            <v-row align="center" justify="space-around">
              <v-col>
                <v-textarea
                  v-model="concursos"            
                  clearable outlined      
                  label="Concursos"
                  placeholder="1,3,4,5"
                  v-validate="'required|arrayOfNumber'"
                  data-vv-name="post.Concursos" 
                  :error-messages="errors.collect('post.Concursos')"
                  data-vv-scope="post" 
                ></v-textarea>
              </v-col>
            </v-row>
          </v-card-text>
        </v-card>
      </v-col>      
    </v-row>
  </v-container>
</template>
<script>  
/* eslint-disable no-console */
import app from '@/services/app'
export default {
  name: 'pages.administracao.Sorterios',
  data(){
    return {
      selectedGet: null,
      selectedPost: null,
      data: [],
      dataGet: null,
      ignoreErrors: false,
      forceUpdate: false,
      concursos: null
    }
  },
  methods:{
    async getSemResultado(){
      var vm = this; 
      vm.dataGet = null  
      try {
        await vm.$validator.validateAll('get').then(async (success) => {
          vm.$store.dispatch('app/setProcessing', 'Buscando...', { root: true });
          if (success) {
            await app.get(`api/administracao/sorteios/semresultado?codigo=${this.selectedGet}`).then(async (response) => {
              if (response.status === 200 && response.data && response.data.success){
                const { data = [] } = response.data
                vm.dataGet = data
              } else if (response.data && !response.data.success && response.data.data){
                vm.$store.dispatch('app/setMessage',{
                  type: 'error',
                  message: response.data.data,
                  }, { root: true });
              }
            }).catch(error => {
              console.error('Error get pessoa: ', error)
            });            
            vm.$store.dispatch('app/setProcessing', null, { root: true });
          } else {
            vm.$store.dispatch('app/setProcessing', null, { root: true });
          }
        });
        
      } catch (error) {
        vm.$store.dispatch('app/setProcessing', null, { root: true });
        vm.$store.dispatch('app/setMessage',{type: 'error',
                                                  message: 'Erro ao Salvar Dados. Erro: '+error
                                                  }, { root: true });
      }
    },
    async postBuscaResultado(){
      var vm = this; 
      try {
        await vm.$validator.validateAll('post').then(async (success) => {
          vm.$store.dispatch('app/setProcessing', 'Efetuando consulta...', { root: true });
          if (success) {
            const body = {
              codigoModalidade: vm.selectedPost,
              ignoreErrors: vm.ignoreErrors,
              forceUpdate: vm.forceUpdate,
              concurso: vm.concursos.split(',').filter(f => !isNaN(f)).map( m => Number(m)).sort()
            }
            await app.post(`api/administracao/sorteios/buscaresultado`, body).then(async (response) => {
              if (response.status === 200 && response.data && response.data.success){
                vm.$store.dispatch('app/setMessage',{
                  type: 'success',
                  message: 'Processo executado com sucesso!',
                  }, { root: true });
              } else if (response.data && !response.data.success && response.data.data){
                vm.$store.dispatch('app/setMessage',{
                  type: 'error',
                  message: response.data.data,
                  }, { root: true });
              }
            }).catch(error => {
              console.error('Error get pessoa: ', error)
            });            
            vm.$store.dispatch('app/setProcessing', null, { root: true });
          } else {
            vm.$store.dispatch('app/setProcessing', null, { root: true });
          }
        });        
      } catch (error) {
        vm.$store.dispatch('app/setProcessing', null, { root: true });
        vm.$store.dispatch('app/setMessage',{type: 'error',
                                                  message: 'Erro ao Salvar Dados. Erro: '+error
                                                  }, { root: true });
      }
    },
    async fetchData (){
      var vm = this;        
      vm.$store.dispatch('app/setLoading', true, { root: true })
      await app.get('api/modalidade').then(async (response) => {
        vm.data = [];
        if (response.status === 200 && response.data && response.data.success){
          const { data = [] } = response.data
          vm.data = data
        }
      }).catch(error => {
        console.error('Error get pessoa: ', error)
      });        
      vm.$store.dispatch('app/setLoading', false, { root: true });
    },
    async createdValidatorRules(){
      this.$validator.extend('arrayOfNumber', {
      getMessage: field => `Campo (${field}) não é uma lista de Númemos validos, separado por virgulas.`,
      validate: value => {
        try {          
          let arr = value.split(',')
            .map(el => {
              if (isNaN(el)){
                throw 'NAN'
              }
              return Number(el)
            })
          return Array.isArray(arr)
        } catch (error) {
          return false          
        }
      }
    })
    }
  },
  mounted(){
  },
  created() {
    this.createdValidatorRules();
    this.fetchData();
  },
  computed: {
    user(){
      return this.$store.getters.getters['authentication/user']
    },
    isLoading: function () {
      return this.$store.getters['app/isLoading']
    },
    modalidades(){
      return this.data.map(m => m.codigo)
    }
  }
}
</script>
<style scoped>
</style>
