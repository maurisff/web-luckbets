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
/*
.dezenasbkp {
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
*/
.dezenas {
  display: inline-block;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  padding: 2px 0px;
  font-size: 16px;
  text-align: center;
  margin-right: 1px;
  margin-bottom: 1px;
  font-family:Roboto, Arial, Helvetica, sans-serif;
}

/*
@media only screen and (min-width: 320px) {
  .dezenas {	
    width: 26px;
    height: 26px;
    padding: 1%;
    font-size: 13px;
    text-align: center;
    margin-right: 1px;
    margin-bottom: 1px;
	}
}
*/
@media only screen and (min-width: 599px) {
  .dezenas {	
    width: 32px;
    height: 32px;
    padding: 3px;
    font-size: 18px;
    text-align: center;
    margin-right: 1px;
    margin-bottom: 1px;
	}
}

@media only screen and (min-width: 959px) {
  .dezenas {	
    width: 40px;
    height: 40px;
    padding: 4px;
    font-size: 22px;
    text-align: center;
    margin-right: 1px;
    margin-bottom: 1px;
	}
}


</style>
