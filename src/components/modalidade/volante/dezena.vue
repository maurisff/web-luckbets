<template>
  <div class="dezena" v-bind:style="{'background': (selected ? selectedColor : color)}" @click="selected = !selected">{{dezena}}</div>
</template>
<script>
  export default {
    name: 'component.modalidade.volante.dezena',
    props: {
      value: {
        type: Number      
      }, 
      dezena: {
        type: Number,
      },
      color: {
        type: String
      },
      selectedColor: {
        type: String
      }
    },
    data(){
      return {
        selected: false
      }
    },
    async mounted(){
    },
    async created() {
      this.selected = this.value === this.dezena;
    },
    methods:{
      
    },
    computed: {

    },
    watch:{
      selected(){
        if (this.selected){
          this.$emit('selected', {dezena: this.dezena, selected: true})
        } else {
          this.$emit('selected', {dezena: this.dezena, selected: false})
        }
      }
    }
  }

</script>

<style scoped>
  
  .dezena {
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
</style>
