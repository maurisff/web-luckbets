<template>
  <v-container class="conteinerDezenas" dense>    
    <!-- <v-tooltip bottom> //implementar ordenação
      <template v-slot:activator="{ on: tooltip }">            
        <div v-on="{ ...tooltip }" @click="sorted = !sorted"
          v-bind:style="{'background': backgroundColor, 'color': color}"
          class="dezenas"
          v-for="(d, i) in (dezenas)"
          :key="i"
          >
          {{d}}
        </div>
      </template>
      <span>Click para {{sorted ? 'ordenar pelo sorteio': 'ordenar'}}</span>
    </v-tooltip>-->
    <div v-bind:style="{'background': backgroundColor, 'color': color}"
      class="dezenas"
      v-for="(d, i) in (dezenas)"
      :key="i"
      >
      {{d}}
    </div>
  </v-container>
</template>
<script>
  export default {
    name: 'component.modalidade.sorteio.dezenas',
    components: {
    },
    data(){
      return {
        sorted: false
      }
    },
    props: {
      value: Array,
      backgroundColor: String,
      color: String
    },
    watch:{
      dezenas(){
        
      },
      sorted(){
        
      }
    },
    methods:{      
    },
    async mounted(){
    },
    async created() {
    },
    computed: {
      dezenas(){
        return Array.isArray(this.value) ? this.value : []
      }
    }
  }

</script>

<style scoped>
  
.dezenas {
  display: inline-block;
  border-radius: 50%;
  width: 36px;
  height: 36px;
  padding: 1%;
  font-size: 14px;
  text-align: center;
  margin-right: 4px;
  margin-bottom: 4px;
  font-family:Roboto, Arial, Helvetica, sans-serif;
}
</style>
