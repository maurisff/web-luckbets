<template>
  <v-container>
    <v-card v-if="!isAuth">
      <v-card-title>
        <span>Bem vindo ao Luck Bets!</span>
      </v-card-title>
      <v-card-text>
        <p>
          A aplicação luck bets é uma ferramenta criada pensando em apostadores que realizam apostas diariamente nas loterias da caixa, e não querem ficar de fora de nenhum sorteio do seu jogo preferido.
          <br/>
          Ela também faz a conferencia automatica das apostas registrada, e realiza notificação em caso de Premiação.
          <br/>
          <br/>
          Cadastre-se e venha conhecer todas as funcionalidades!
        </p>
      </v-card-text>
    </v-card>
    <ultimoSorteio v-else v-model="sorteios"/>
  </v-container>
</template>
<script>
  
// import inputPessoa from '@/components/cadastro/Pessoa/inputPessoa'

import app from '@/services/app'
import ultimoSorteio from '@/components/modalidade/sorteio/ultimo-sorteio'
export default {
  name: 'Home',
  components: {
    ultimoSorteio,
  },
  data(){
    return {
      pessoa: null,
      currentRouter: null,
      sorteios: []
    }
  },
  watch:{
    $route () {
      this.currentRouter = this.$route.path
    },
    async auth (current, old){
      if (current && current !== old ){
        await this.fetchData();
      }
    }
  },
  methods:{
    async fetchData (){
      var vm = this;        
      vm.$store.dispatch('app/setLoading', true, { root: true })
      try {
        this.sorteios = [];
        const response = await app.get('api/sorteios/ultimosresultados');        
        if (response.status === 200 && response.data && response.data.success){
          const { data = [] } = response.data
          this.sorteios = data
        }
      } catch (error) {
        // eslint-disable-next-line no-console
        console.error('Error get ultimosresultados: ', error)        
      }  
      vm.$store.dispatch('app/setLoading', false, { root: true });      
    },
    getFullPach: function () {
      return (this.$route.path)
    }
  },
  async mounted(){    
  },
  async created() {
    this.currentRouter = this.$route.path
    if (this.auth ){
      await this.fetchData();
    }
  },
  computed: {
    auth(){
      return (this.$store.getters['authentication/user'] ? this.$store.getters['authentication/user'] : null)
    },
    isAuth () {
      return ((this.$store.getters['authentication/user'] !== null && this.$store.getters['authentication/user'] !== undefined))
    },
    isLoading: function () {
      return this.$store.getters['app/isLoading']
    },
    onResize (){  
      return this.$vuetify.breakpoint;
    }
  }
}

</script>

<style scoped>

.numberCircleMega {
  display: inline-block;
  border-radius: 50%;
  padding: 6px;
  background: #228B22;
  border: 0px solid #666;
  color: #ffffff;
  text-align: center;

  font: 16px Arial, sans-serif;
}
.numberCircleLoto {
  display: inline-block;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  padding: 6px;

  background: #9f00ad;
  border: 0px solid #666;
  color: #ffffff;
  text-align: center;

  font: 12px Arial, sans-serif;
}
.divCenter{
    text-align: center
}

.progress-circular{
  margin: 1rem
}
</style>
