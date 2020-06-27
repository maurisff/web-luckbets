<template>
  <v-container  v-if="!isLoading" fluid grid-list-lg>
    <v-layout row wrap>
      <v-flex xs12 sm12 md10 offset-md1>
        <form @submit.prevent="saveProfile">
          <v-text-field label="Name" v-model="profile.nome" :counter="60" :error-messages="errors.collect('nome')"
                        v-validate="'required|max:60'" data-vv-name="nome" required ></v-text-field>
          <v-text-field readonly label="Email" v-model="profile.email" :counter="60" :error-messages="errors.collect('email')"
                        v-validate="'required|max:60'" data-vv-name="email" disabled ></v-text-field>
          <!-- <v-checkbox label="Receber Email de resumo Semanal" v-model="profile.stNotificaEmailSemanal"></v-checkbox> -->
          <v-select :items="modalidades" item-text="titulo" item-value="codigo" v-model="profile.notificaSorteio" label="Me lembrar de apostar nas Loteria(s):" multiple
                    chips hint="Notifica o usuário quando tiver um sorteio e o mesmo não tem aposta cadastrada." autocomplete
                    :error-messages="errors.collect('notificaSorteio')" data-vv-name="notificaSorteio"></v-select>          
          <v-btn type="submit" color="success">Salvar</v-btn>
        </form>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
  import app from '@/services/app'
  export default {
    name: 'Profile',
    data () {
      return {
        modalidades: [],
        profile: {
          nome : null,
          email : null,
          notificaSorteio: []
        },     
        dictionary : {
          custom: {
            email: {
              required: () =>  'Email deve ser informado',
              max: 'O email não deve ter mais que 60 caracteres'
            },
            nome: {
              required: () =>  'Nome de Usuário deve ser informado!',
              max: 'Nome de Usuário não deve ter mais que 60 caracteres'
            }
          }
        }
      }
    },
    created(){
      this.fetchData();
    },
    mounted(){
      this.$validator.localize('en', this.dictionary);
      this.fetchData();
    },
    computed:{
      isLoading () {
        return this.$store.getters['app/isLoading']
      },
      userLogado () {
        return this.$store.getters.user;
      },  
      toUpperCase(value){
        return value.toUpperCase();
      }
    },
    methods: {      
      async fetchData (){
        var vm = this;        
        vm.$store.dispatch('app/setLoading', true, { root: true })  
        await app.get('api/usuariologado/usuario').then(async (response) => {
          if (response.status === 200 && response.data && response.data.success){
            const { data = vm.profile } = response.data
            vm.profile = data
          }
        }).catch(error => {
          console.error('Error get usuariologado/usuario: ', error)
        });
        await app.get('api/modalidade').then(async (response) => {
          vm.modalidades = [];
          if (response.status === 200 && response.data && response.data.success){
            const { data = [] } = response.data
            vm.modalidades = data.map(el => ({codigo: el.codigo, titulo: el.titulo}))
          }
        }).catch(error => {
          console.error('Error get modalidade: ', error)
        });
        vm.$store.dispatch('app/setLoading', false, { root: true });
      },
      saveProfile(){
        this.$validator.validateAll().then(async (success) =>{
          if (success){
            this.$store.dispatch('app/setProcessing', 'Processando...', { root: true });
            await app.put('api/usuariologado/usuario', this.profile).then(async (response) => {
              if (response.status === 200 && response.data && response.data.success){
                this.$store.dispatch('app/setMessage',{
                  type: 'success',
                  message: 'Perfil atualizado com sucesso!',
                  }, { root: true });
              } else if (response.data && !response.data.success){
                this.$store.dispatch('app/setMessage',{
                  type: 'error',
                  message: response.data.data,
                  }, { root: true });
              }
            }).catch(error => {
              this.$store.dispatch('app/setMessage',{
                  type: 'error',
                  message: error,
                  }, { root: true });
            });
            this.$store.dispatch('app/setProcessing', null, { root: true });
          }
        });
      },
    }
  }
</script>

<style lang="css">
  emailUpperCase {
      text-transform: uppercase;
  }
</style>