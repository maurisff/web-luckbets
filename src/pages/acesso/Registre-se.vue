<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height justify-center>
        <v-layout align-center justify-center v-if="!isLoading && !user">
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-dialog v-model="isLoginAction">
                <v-progress-circular class="progressLogin" indeterminate :size="sizeProgress" color="primary">{{txtLogando}}</v-progress-circular>
              </v-dialog>
              <v-toolbar dark color="primary">
                <v-toolbar-title >Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <div>
                  <v-form @submit.prevent="register">
                    <div v-if="isProvider('PASSWORD')">
                      <v-text-field prepend-icon="person" label="Login" type="text" v-model="login"
                          :error-messages="errors.collect('login')" v-validate="'required'" data-vv-name="login" ></v-text-field>
                      <v-text-field prepend-icon="lock" label="Senha"  type="password" v-model="senha"
                          :error-messages="errors.collect('senha')" v-validate="'required|min:6'" data-vv-name="senha" ></v-text-field>
                      <v-text-field prepend-icon="lock" label="Confirma senha"  type="password" v-model="senha2"
                          :error-messages="errors.collect('senha2')" v-validate="'required|min:6'" data-vv-name="senha2" ></v-text-field>
                      <div>
                        <v-btn block dark class="ma-2" color="primary" type="submit">
                          <v-icon dark left>check_circle</v-icon>Confirmar
                        </v-btn>
                        <v-btn block dark class="ma-2" color="primary" left @click.stop="goLogin">
                          <v-icon dark left>how_to_reg</v-icon>Entrar com Email e Senha
                        </v-btn>
                      </div>                  
                      <div v-if="(providerAuthSize > 1)" class="separator"> ou </div>
                    </div>
                    <v-btn outlined block class="ma-2" color="error" @click.stop="authProvider('GOOGLE')" v-if="isProvider('GOOGLE')">
                      <v-icon dark left>mdi-google-plus</v-icon>Google
                    </v-btn>
                    <v-btn outlined block class="ma-2" color="#4464a2"  left @click.stop="authProvider('FACEBOOK')" v-if="isProvider('FACEBOOK')">
                      <v-icon dark left>mdi-facebook</v-icon>Facebook
                    </v-btn>
                    <v-btn outlined block class="ma-2" color="#60b5f0" left @click.stop="authProvider('TWITTER')" v-if="isProvider('TWITTER')">
                      <v-icon dark left>mdi-twitter</v-icon>Twitter
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
  export default {
    name: 'Acesso.Registre-se',
    data: () => ({
      login: null,
      senha: null,
      senha2: null,
      redirect: null,
      sizeProgress: 85,
      txtLogando: 'Entrando...',
      dictionary : {
        custom: {
          login: {
            required: () =>  'Informe seu login de acesso!'
          },
          senha2: {
            required: () =>  'Informe a senha de confirmação!',
            min: () => 'O campo de senha deve ter pelo menos 6 caracteres!'
          },
          senha: {
            required: () =>  'Informe sua senha de acesso!',
            min: () => 'O campo de senha deve ter pelo menos 6 caracteres!'
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
      providerAuth () {        
        if (process.env.VUE_APP_AUTH_PROVIDER && Array.isArray(JSON.parse(process.env.VUE_APP_AUTH_PROVIDER))){
          return JSON.parse(process.env.VUE_APP_AUTH_PROVIDER)
        } else {
          return ['PASSWORD']
        }
      },
      providerAuthSize: function () {
        return this.providerAuth.length;
      },
      isLoading: function () {
        return (this.$store.getters['app/isLoading'])
      },
      isLoginAction: function () {
        return (this.$store.getters['authentication/isLoggingIn'])
      },
      user(){
        return (this.$store.getters['authentication/user'])
      },
      userLogado(){
        return this.$store.getters['authentication/user']
      }
    },
    created() {
      if (this.$route.query.redirect){
        this.redirect = this.$route.query.redirect;
      }if (this.$route.query.alterar){
        this.alterarEntidade = true;
      }
      this.postLogin(this.user);
    },
    mounted() {
      this.$validator.localize('en', this.dictionary);
    },
    methods:{
      async goLogin (){
        this.$router.push({ path: '/acesso/entrar' }).catch(() => { });
      },
      postLogin: function(userLogado){
        if (userLogado) {
          if (this.redirect){
            this.$router.push({ path: this.redirect }).catch(() => { });
          }else{
            this.$router.push({ path: '/' }).catch(() => { });
          }
        }
      },
      async register(){
        var vm = this
        this.$validator.validateAll().then(async success =>{
          if (success){
            if (vm.senha !== vm.senha2) {                
              await vm.$store.dispatch('app/setMessage', { type: 'info', message: 'O senhas não são iguais. Verififique!' }, { root: true });
            } else {
              await vm.$store.dispatch('authentication/setUsuario', { email: vm.login,  senha: vm.senha }, { root: true });
            }
          }
        })
      },
      isProvider (providerName){
        return this.providerAuth.indexOf(providerName)>=0
      },
      async authProvider(idProvider){
        await this.$store.dispatch('authentication/loginAction', {idProvider}, { root: true })
      }
    }
  }
</script>

<style >
</style>
