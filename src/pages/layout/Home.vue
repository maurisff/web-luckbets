<template>
<v-container>
  <div>Bem Vindo!!</div>
  <div>Router: {{ $route.path }}</div><!--
  <v-card v-if="(auth && auth.admin)">
  <div>
    <inputPessoa v-model="pessoa" ></inputPessoa> 
    <pre>
      Usuario: {{ (auth && auth.admin ? auth : 'Pagina inicial' )}}
    </pre>
  </div>
  </v-card> -->
</v-container>
  <!-- <v-parallax src="/static/img/maxpig_fundo.png">
  </v-parallax> -->
</template>
<script>
  
// import inputPessoa from '@/components/cadastro/Pessoa/inputPessoa'
export default {
  name: 'Home',
  components: {
    // inputPessoa,
  },
  data(){
    return {
      pessoa: null,
      currentRouter: null,
    }
  },
  watch:{
    $route () {
        this.currentRouter = this.$route.path
      }
  },
  methods:{
    getFullPach: function () {
      return (this.$route.path)
    }
  },
  mounted(){
  },
  created() {
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
