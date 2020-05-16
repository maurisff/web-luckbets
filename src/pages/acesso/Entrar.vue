<template>
  <v-app>
    <v-content>
      <v-container fluid fill-height justify-center>
        <v-dialog v-model="isLoginAction">
          <v-progress-circular class="progressLogin" indeterminate :size="sizeProgress" color="primary">{{txtLogando}}</v-progress-circular>
        </v-dialog>
        <v-layout align-center justify-center v-if="!isLoading && !user && !isLoginAction">
          <v-flex xs12 sm8 md4>
            <v-card class="elevation-12">
              <v-toolbar dark color="primary">
                <v-toolbar-title >Login</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <div>
                  <v-form @submit.prevent="authLogin">
                    <div v-if="isProvider('PASSWORD')">
                      <v-text-field prepend-icon="person" label="Login" type="text" v-model="login"
                          :error-messages="errors.collect('login')" v-validate="'required'" data-vv-name="login" ></v-text-field>
                      <v-text-field prepend-icon="lock" label="Senha"  type="password" v-model="senha"
                          :error-messages="errors.collect('senha')" v-validate="'required|min:6'" data-vv-name="senha" ></v-text-field>
                      <div>
                        <v-btn block dark class="ma-2" color="primary" type="submit">
                          <v-icon dark left>check_circle</v-icon>Entrar
                        </v-btn>
                        <v-btn block dark class="ma-2" color="primary" left @click.stop="goRegister">
                          <v-icon dark left>how_to_reg</v-icon>Registre-se
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
    name: 'Acesso.Entrar',
    data: () => ({
      finalizarCadastro: false,
      isLogin: true,
      login: null,
      senha: null,
      redirect: null,
      dialog: false,
      sizeProgress: 85,
      txtLogando: 'Entrando...',
      dictionary : {
        custom: {
          login: {
            required: () =>  'Informe seu login de acesso!'
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
      user () {
        return this.$store.getters['authentication/user']
      },
      isLoginAction: function () {
        return (this.$store.getters['authentication/isLoggingIn'])
      },
      isDevelopment (){
        return (process.env.NODE_ENV === 'development')
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
      postLogin: function(userLogado){
        if (userLogado) {
          if (this.redirect){
            this.$router.push({ path: this.redirect }).catch(() => { });
          }else{
            this.$router.push({ path: '/' }).catch(() => { });
          }
        }
      },
      async goRegister (){
        this.$router.push({ path: '/acesso/registrar' }).catch(() => { });
      },
      async authLogin(){    
        await this.$store.dispatch('authentication/loginAction', { email: this.login, senha: this.senha}, { root: true });
      },
      isProvider (providerName){
        return this.providerAuth.indexOf(providerName)>=0
      },
      async authProvider(idProvider){
        await this.$store.dispatch('authentication/loginAction', {idProvider}, { root: true });
      },
      async errorFirebase (error) {
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
          return error.message;
        }
      }
    }
  }
</script>

<style >

.progressLogin {
  top: 40%;
  left: 40%;
  position: absolute;
  text-align: center;
  margin: 2rem;
}

.divButtonLogin{
    text-align: center;
    display: flex;
    justify-content: center;
}

.sign-in-onboard {
    text-align: center;
    display: flex;
    flex-direction: column;
}

.btn--facebook {
    background: #4065b4;    
    color: #fff;
    border-color: #fff;
}


.btn--google {
    background: transparent;
    color: #717171;
    border: 1px solid #dcdcdc;
}

.btn--twitter {
    background: transparent;
    color: #717171;
    border: 1px solid #dcdcdc;
}

.separator {
  display: flex;
  align-items: center;
  text-align: center;
}
.separator::before,
.separator::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgb(196, 196, 196);
}
.separator::before {
  margin-right: .25em;
}
.separator::after {
  margin-left: .25em;
}


.divCenter{
    text-align: center;
    display: flex;
    justify-content: center;
}

</style>
