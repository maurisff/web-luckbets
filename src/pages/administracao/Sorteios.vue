<template>
  <v-container v-if="!isLoading" fluid grid-list-lg>
    <v-row>
      <v-col cols="12" sm="12" md="12" lg="6" xl="6">
        <v-card>
          <v-card-title>List</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedGet"
              :items="modalidades"
              label="Modalidade">
            </v-select>
            <v-btn color="blue darken-1" text @click="close">Consultar</v-btn>
            <pre v-if="dataGet" >
              {{dataGet}}
            </pre>
          </v-card-text>
        </v-card>
      </v-col>      
      <v-col cols="12" sm="12" md="12" lg="6" xl="6">
        <v-card>
          <v-card-title>Post</v-card-title>
          <v-card-text>
            <v-select
              v-model="selectedPost"
              :items="modalidades"
              label="Modalidade">
            </v-select>
          </v-card-text>
        </v-card>
      </v-col>      
    </v-row>
  </v-container>
</template>
<script>  
import app from '@/services/app'
export default {
  name: 'pages.administracao.Sorterios',
  data(){
    return {
      selectedGet: null,
      selectedPost: null,
      data: [],
      dataGet: [],
      dataPost: [],
    }
  },
  methods:{
    async fetchData (){
      var vm = this;        
      vm.$store.dispatch('app/setLoading', true, { root: true })
      await app.get('api/modalidade').then(async (response) => {
        vm.data = [];
        if (response.status === 200 && response.data && response.data.success){
          const { data = [] } = response.data
          vm.data = data
          console.log('vm.data: ', vm.data);
        }
      }).catch(error => {
        console.error('Error get pessoa: ', error)
      });        
      vm.$store.dispatch('app/setLoading', false, { root: true });      
    },
    async save () {
      var vm = this;
      try {
        await vm.$validator.validateAll('model').then(async (success) => {
          vm.$store.dispatch('app/setProcessing', 'Salvando...', { root: true });
          if (success) {
            if (vm.model._id) {
              vm.model.updatedAt = Date.now
              await app.put('api/administracao/modalidade/'+vm.model._id, vm.model).then(async (response) => {
                if (response.status === 200 && response.data && response.data.success){
                  vm.$store.dispatch('app/setMessage',{ type: 'info', message: 'Registro atualizado com sucesso!' }, { root: true });
                  vm.$store.dispatch('app/setProcessing', null, { root: true });
                  vm.close(true)
                } else {
                  vm.$store.dispatch('app/setMessage',{ type: 'error', message: response.data.data }, { root: true });
                  vm.$store.dispatch('app/setProcessing', null, { root: true });
                }
              }).catch(error => {
                vm.$store.dispatch('app/setMessage',{ type: 'error', message: error }, { root: true });
                vm.$store.dispatch('app/setProcessing', null, { root: true });
              });
            }
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
    }
  },
  mounted(){
  },
  created() {
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
