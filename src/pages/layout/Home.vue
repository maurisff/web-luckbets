<template>
  <v-container>
    <ultimoSorteio v-model="sorteios"/>
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
        console.error('Error get ultimosresultados: ', error)        
      }  
      vm.$store.dispatch('app/setLoading', false, { root: true });      
    },
    getFullPach: function () {
      return (this.$route.path)
    }
  },
  async mounted(){
    
    await this.fetchData();
    console.log('HOME: ', this.sorteios)
  },
  async created() {

    this.currentRouter = this.$route.path
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
