<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height justify-center>
        <v-layout align-center justify-center v-if="!isLoading && user">
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-dialog v-model="isLoginAction">
                <v-progress-circular class="progressLogin" indeterminate :size="sizeProgress" color="primary">{{txtLogando}}</v-progress-circular>
              </v-dialog>
              <v-toolbar dark color="primary">
                <v-toolbar-title >Finalizar Cadastro</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <div>
                  <v-form @submit.prevent="finalizar">
                    <v-text-field label="Nome" type="text" v-model="nome"
                        :error-messages="errors.collect('nome')" v-validate="'required'" data-vv-name="nome" ></v-text-field>
                    <v-text-field label="Email" type="text" v-model="email"
                        :error-messages="errors.collect('email')" v-validate="'required'" data-vv-name="email" ></v-text-field>
                    <v-btn block dark class="ma-2" color="primary" type="submit">
                      <v-icon dark left>check_circle</v-icon>Confirmar
                    </v-btn>
                    <v-btn block dark class="ma-2" color="primary" left @click.stop="goBack">
                      <v-icon dark left>how_to_reg</v-icon>Cancelar
                    </v-btn>
                  </v-form>
                </div>
              </v-card-text>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
// import app from '@/services/app'

export default {
  name: 'Acesso.Finalizar',
  data: () => ({
    nome: null,
    email: null,
    senha: null,
    uid: null,
    redirect: null,
    sizeProgress: 85,
    txtLogando: 'Entrando...',
    dictionary : {
      custom: {
        nome: {
          required: () =>  'Informe seu nome!'
        },
        login: {
          required: () =>  'Informe seu email de acesso!'
        }
      }
    }
  }),
  props: {
    source: String
  },
  watch: {
    user (value) {
      this.postLogin(value);
    }

  },
  computed:{
    isLoading: function () {
      return (this.$store.getters['app/isLoading'])
    },
    isLoginAction: function () {
      return (this.$store.getters['authentication/isLoggingIn'])
    },
    user(){
      return (this.$store.getters['authentication/user'])
    }
  },
  async created() {
    if (!this.user){
      this.$router.push({ path: '/' }).catch(() => { });
      return;
    }
    if (this.$route.query.redirect){
        this.redirect = this.$route.query.redirect;
    }
    
    await this.postLogin(this.user);
    // uid, displayName, email, emailVerified, providerData
    if (this.user){
      this.nome = this.user.displayName;
      this.email = this.user.email;
      this.senha = this.user.senha;
      this.uid = this.user.uid;
    }
  },
  mounted() {
    this.$validator.localize('en', this.dictionary);
  },
  methods:{
    async goBack (){
      this.$router.push({ path: '/' }).catch(() => { });
    },
    postLogin: function(userLogado){
      if (!userLogado){
        this.$router.push({ path: '/' }).catch(() => { });
        return;
      }
      if (userLogado && userLogado._id) {
        if (this.redirect){
          this.$router.push({ path: this.redirect }).catch(() => { });
        }else{
          this.$router.push({ path: '/' }).catch(() => { });
        }
      }
    },
    async finalizar(){
      var vm = this
      this.$validator.validateAll().then(async success =>{
        if (success){
          ///  uid, email, nome, senha 
          await vm.$store.dispatch('authentication/registrerAction', {
            uid: vm.uid, 
            nome: vm.nome, 
            email: vm.email, 
            senha: vm.senha, 
          }, { root: true })
        }
      })
    }
  }
}
</script>

<style >
</style>
