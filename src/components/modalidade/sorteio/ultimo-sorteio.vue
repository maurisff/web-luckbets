<template>
  <v-container>    
    <v-row>
      <v-col v-for="(item, i) in data"
      cols="12" md="6" 
      :key="i" >
        <v-card >           
          <div class="sorteio"> 
            <div class="containerHeader">
              <div class="iconHeader" >
                <v-icon x-large v-bind:color="item.modalidadeId.style.corTitulo" >mdi-clover</v-icon>
              </div>
              <div 
                v-bind:style="{'color': item.modalidadeId.style.corTitulo}"
                class="tituloHeader"
                >
                {{item.modalidadeId.titulo}}</div>
              <div class="concursoHeader">
                Concurso: 
                <div class="dataConcurso">{{ item.concurso }}</div> - 
                <div class="dataConcurso">{{ moment(item.apuracao).format('L')}}</div>
              </div>
            </div>
            <div class="conteinerDezenas">
              <div
                v-bind:style="{'background': item.modalidadeId.style.corBGDezena, 'color': item.modalidadeId.style.corTxtDezena}"
                class="dezenas"
                v-for="(d, i) in (item.resultado)"
                :key="i"
                >
                {{d}}
              </div>
            </div>
            <div v-if="item.resultado2 && item.resultado2.length > 0"  class="conteinerDezenas" >
              <div 
                v-bind:style="{'background': item.modalidadeId.style.corBGDezena, 'color': item.modalidadeId.style.corTxtDezena}"
                class="dezenas"
                v-for="(d, i) in item.resultado2"
                :key="i"
                >
                {{d}}
              </div>
            </div>
            <div class="concursoHeader">          
              <div>
                Próximo concurso:
                <div class="dataConcurso">{{ item.proximoConcurso }}</div> - 
                <div class="dataConcurso">{{ moment(item.proximaApuracao).format('L')}}</div>
              </div>          
              <div>
                Estimativa de Prêmio:
                <div class="estimativaPremio">
                  <span>R$ {{ Number(item.valorPrevisto).toStringPrice()}}</span>
                </div> 
              </div>
            </div>
            <v-expansion-panels accordion flat>
              <v-expansion-panel >
                <v-expansion-panel-header v-bind:color="item.premiado ? 'green': ''" >{{item.premiado ? 'Premiação - Parabéns você foi premiado!': 'Premiação'}}</v-expansion-panel-header>
                <v-expansion-panel-content>
                  <v-data-table 
                    :headers="headersPremiacao" 
                    calculate-widths dense
                    :items="item.premiacao"
                    item-key="faixa" sort-by="faixa" 
                    hide-default-footer> 
                    <template v-slot:item.ganhadores="{ item }">
                      <span >{{Number(item.ganhadores).toStringPrice(0)}}</span>
                    </template>
                    <template v-slot:item.valor="{ item }">
                      <span >{{Number(item.valor).toStringPrice()}} R$</span>
                    </template>
                  </v-data-table>  
                </v-expansion-panel-content>
              </v-expansion-panel>
            </v-expansion-panels>

          </div>
        </v-card>  
      </v-col>
    </v-row>
  </v-container>
</template>
<script>
  export default {
    name: 'component.modalidade.sorteio.ultimo-sorteio',
    data(){
      return {
        data: [],
        headersPremiacao: [
        {
          text: 'Faixa',
          align: 'center',
          class: 'text-center',
          value: 'faixa',
          sortable: false,
          filterable: false
        },
        {
          text: 'Acertos',
          align: 'center',
          class: 'text-center',
          value: 'dezenas',
          sortable: false,
          filterable: false
        },
        {
          text: 'Ganhadores',
          align: 'right',
          class: 'text-right',
          value: 'ganhadores',
          sortable: false,
          filterable: false
        },
        {
          text: 'Prêmio',
          align: 'right',
          class: 'text-right',
          value: 'valor',
          sortable: false,
          filterable: false
        },
      ],
      }
    },
    props: {
      value: Array, 
      multiple: {
        type: Boolean,
        default: false
      },
    },
    watch:{
      value(){
        console.log('ULTIMO: ', this.value)
        this.data = this.value ? this.value : [];
        this.data = this.data.slice().sort((a,b) => new Date(b.apuracao) - new Date(a.apuracao)  )
      }
    },
    methods:{
      
    },
    async mounted(){
    },
    async created() {
      /*
      this.data = [{
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
      }]
      */
      console.log(this.data)
    },
    computed: {
      
    }
  }

</script>

<style scoped>
  .sorteio {
    padding: 10px;
  }
  .containerHeader {

  }
  .iconHeader{
    float: left;
    width: 10%;
    margin-top: 08px;
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: center;
  }
  .tituloHeader {
    display: block;
    font-size: 20px;
    font-weight: bold;
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }
  .concursoHeader {
    margin-left: 3px;
    font-family:  Roboto, Arial, Helvetica, sans-serif;
  }
  .dataConcurso {
    display: inline-block;
    color: #4c556c;
    font-weight: bold;
    font-family:  Roboto, Arial, Helvetica, sans-serif;
  }
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

.estimativaPremio {
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  color: #4c556c;
  font-family: Roboto, Arial, Helvetica, sans-serif;
}

</style>
