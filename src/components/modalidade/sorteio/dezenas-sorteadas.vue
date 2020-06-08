<template>
  <v-card>    
  

  </v-card>
</template>
<script>
  export default {
    name: 'component.modalidade.sorteio.dezenas-sorteio',
    data(){
      return {
        model: null,
        data: [],
        search: null,
        isLoading: false,
        createData: false
      }
    },
    props: {
      sorteios: Array, 
      multiple: {
        type: Boolean,
        default: false
      },
    },
    watch:{
      
    },
    methods:{
      
    },
    mounted(){
    },
    created() {
      this.model = this.value;
      this.sorteios = [{
        resultado: [
            18,
            3,
            9,
            22,
            1,
            20,
            24,
            13,
            14,
            10,
            19,
            15,
            7,
            17,
            11
        ],
        resultado2: [],
        concurso: 1976,
        modalidadeId: {
            style: {
                corTitulo: '#930089',
                corBGDezena: '#930089',
                corTxtDezena: '#ffffff',
                corDefaulBGDezena: '',
                corDefaulTxtDezena: ''
            },
            codigo: 'LOTOFACIL',
            titulo: 'Lotofácil',
            valorApostaMinima: 2.5
        },
        apuracao: '2020-06-05T03:00:00.000Z',
        proximoConcurso: 19761,
        proximaApuracao: '2020-06-08T03:00:00.000Z',
        valorPrevisto: 2.5,
        premiacao: [{
                faixa: 1,
                dezenas: 15,
                ganhadores: 7,
                valor: 255447.27
            }, {
                faixa: 2,
                dezenas: 14,
                ganhadores: 965,
                valor: 814.49
            }, {
                faixa: 3,
                dezenas: 13,
                ganhadores: 28155,
                valor: 25
            }, {
                faixa: 4,
                dezenas: 12,
                ganhadores: 270902,
                valor: 10
            }, {
                faixa: 5,
                dezenas: 11,
                ganhadores: 1212649,
                valor: 5
            }
        ]
    }
]
    },
    computed: {
    }
  }

</script>

<style scoped>

</style>
