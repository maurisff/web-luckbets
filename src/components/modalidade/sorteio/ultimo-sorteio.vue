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
                <v-tooltip bottom>
                  <template v-slot:activator="{ on: tooltip }" >
                    <v-btn v-if="isLogado" text  v-on="{ ...tooltip }" dark absolute fab top small right :color="item.modalidadeId.style.corTitulo" :to="`/volante/${item.modalidadeId.codigo.toString().toLowerCase()}/apostar`">
                      <v-icon>mdi-plus-circle</v-icon>
                    </v-btn>
                  </template>
                  <span>Apostar em {{item.modalidadeId.titulo}}!</span>
                </v-tooltip>
              </div>
            </div>
            <v-dezenas v-model="item.resultado" 
              :color="item.modalidadeId.style.corTxtDezena" :backgroundColor=" item.modalidadeId.style.corBGDezena"/>            
            <v-dezenas v-if="item.resultado2 && item.resultado2.size > 0"  v-model="item.resultado2" 
              :color="item.modalidadeId.style.corTxtDezena" :backgroundColor=" item.modalidadeId.style.corBGDezena"/>
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
                <v-expansion-panel-header v-bind:color="item.premiado ? 'green': ''" >{{item.premiado ? 'Premiação - Parabéns você possui apostas premiadas!': 'Premiação'}}</v-expansion-panel-header>
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
  import dezenas from '@/components/modalidade/sorteio/dezenas'
  export default {
    name: 'component.modalidade.sorteio.ultimo-sorteio',
    components: {
      'v-dezenas': dezenas,
    },
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
        this.data = this.value ? this.value : [];
        this.data = this.data.slice().sort((a,b) => new Date(b.apuracao) - new Date(a.apuracao)  )
      }
    },
    methods:{
      
    },
    async mounted(){
    },
    async created() {
    },
    computed: {
      isLogado:  function () {
        return (this.$store.getters['authentication/user'] !== null && this.$store.getters['authentication/user'] !== undefined);
      }      
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

  .estimativaPremio {
    display: inline-block;
    font-size: 16px;
    font-weight: bold;
    color: #4c556c;
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }

</style>
