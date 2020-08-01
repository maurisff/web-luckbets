<template>
  <v-container>
    <v-dezena v-for="(d, i) in ofDezenas" :key="i" :dezena="d" :color="color" :selectedColor="selectedColor" @selected="onSelected"/>
    <div>{{ dezenasSelected }}</div>
  </v-container>
</template>
<script>
  import dezena from '@/components/modalidade/volante/dezena'
  export default {
    name: 'component.modalidade.volante.volante',
    components: {
      'v-dezena': dezena
    },
    props: {
      value: {
        type: Array      
      }, 
      dezenas: {
        type: Number,
      },
      color: {
        type: String,
        default: 'lightgray'
      },
      selectedColor: {
        type: String,
        default: 'gray'
      }
    },
    data(){
      return {
        data: []
      }
    },
    async mounted(){
    },
    async created() {
      this.selected = this.value === this.dezena;
    },
    methods:{
      async onModel(d){
        if (this.data.indexOf(d) === -1){
          return true
        } else {
          return false
        }
      },
      async onSelected(e){
        const idx = this.data.indexOf(e.dezena)
        if (e.selected && idx === -1){
          this.data.push(e.dezena);
        } else if (!e.selected && idx > -1) {
          this.data.splice(idx, 1);
        }
        this.data = (this.data.sort((a,b) => Number(a) - Number(b)))
        this.$emit('input', this.data )
      }
    },
    computed: {
      ofDezenas() {
        return Array.from({length:(this.dezenas || 0)},(a,b)=> b+1)
      },
      dezenasSelected (){
        return this.data.join("-")
      }
    },
    watch:{
      value( asNew=[], asOld=[]){
        if (JSON.stringify(asNew) !== JSON.stringify(asOld)){
          this.data = asNew;
          this.$emit('input', this.data)
        }
      }
    }
  }

</script>

<style scoped>
    
  .dezena {
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

  
@media only screen and (min-width: 599px) {
  .dezena {	
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
  .dezena {	
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
