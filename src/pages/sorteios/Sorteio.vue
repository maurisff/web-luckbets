<template>
  <v-container v-if="!isLoading" fluid grid-list-lg v-resize="onResize">    
    <v-data-table
      :search="search"  
      v-model="selected"
      :headers="headers" 
      calculate-widths
      :items="data"
      dense
      item-key="_id"
      mobile-breakpoint="0"
      class="elevation-1"
      :items-per-page="rowsPerPage"
      :footer-props="{
        showFirstLastPage: true,
        'items-per-page-options': [rowsPerPage, (rowsPerPage*2), (rowsPerPage*3), (rowsPerPage*4), (rowsPerPage*5)],/*
        firstIcon: 'mdi-arrow-collapse-left',
        lastIcon: 'mdi-arrow-collapse-right',
        prevIcon: 'mdi-chevron-left',
        nextIcon: 'mdi-skip-nex'*/
      }" >
      <template v-slot:top>
        <v-toolbar flat >          
          <v-toolbar-title>
            <span class="headline">{{tituloModalidade}}</span>
          </v-toolbar-title>
          <v-divider
            class="mx-4"
            inset
            vertical
          ></v-divider>
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Pesquisa"
            single-line
            hide-details
          ></v-text-field>
          <div class="flex-grow-1"></div>
          <v-dialog v-model="dialog" persistent  max-width="60%" >
            <v-card>
              <v-card-title>
                <span class="headline"> {{tituloModalidade}} - Concurso {{sorteio.concurso}} - {{moment(sorteio.apuracao).format('L')}}</span>
              </v-card-title>
              <v-card-text>                
                <v-data-table 
                  :headers="headersPremiacao" 
                  calculate-widths dense
                  :items="sorteio.premiacao"
                  item-key="faixa" sort-by="faixa" 
                  hide-default-footer> 
                  <template v-slot:item.ganhadores="{ item }">
                    <span >{{Number(item.ganhadores).toStringPrice(0)}}</span>
                  </template>
                  <template v-slot:item.valor="{ item }">
                    <span >{{Number(item.valor).toStringPrice()}} R$</span>
                  </template>
                </v-data-table>  
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="close">Voltar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>        
      <template v-slot:item.mobile="{ item }">
        <div class="containerMobile">
          <div class="sorteio">
            <div class="divConcurso">Concurso:</div> 
            <div class="divSorteio">{{item.concurso}} - {{moment(item.apuracao).format('L')}}</div>
          </div>
          <div class="sorteio">
            <div class="divConcurso">Premiação</div>
            <div><span @dblclick="detalhes(item)">{{Number(item.premiacao.find(f => f.faixa = 1)['valor']).toStringPrice()}}</span></div>
          </div>
          <div>
            <v-dezenas v-model="item.resultado"
              :color="item.modalidadeId.style.corTxtDezena" :backgroundColor=" item.modalidadeId.style.corBGDezena"/>
            <v-dezenas v-if="item.resultado2 && item.resultado2.size > 0"  v-model="item.resultado2"
              :color="item.modalidadeId.style.corTxtDezena" :backgroundColor=" item.modalidadeId.style.corBGDezena"/>  
          </div>
          <div class="sorteio">
            <div class="divConcurso">Próximo</div>
            <div class="divSorteio">{{item.proximoConcurso}} - {{moment(item.proximaApuracao).format('L')}}</div>
          </div>
          
        </div>
      </template>      
      <template v-slot:item.apuracao="{ item }">
        <span>{{moment(item.apuracao).format('L')}}</span>
      </template>       
      <template v-slot:item.resultado="{ item }">
        <v-dezenas v-model="item.resultado"
          :color="item.modalidadeId.style.corTxtDezena" :backgroundColor=" item.modalidadeId.style.corBGDezena"/>
        <v-dezenas v-if="item.resultado2 && item.resultado2.size > 0"  v-model="item.resultado2"
          :color="item.modalidadeId.style.corTxtDezena" :backgroundColor=" item.modalidadeId.style.corBGDezena"/>        
      </template>  
      <template v-slot:item.premiacao="{ item }">
        <v-tooltip bottom>
          <template v-slot:activator="{ on: tooltip }">            
            <span class="premiacao" v-on="{ ...tooltip }" @dblclick="detalhes(item)">{{Number(item.premiacao.find(f => f.faixa = 1)['valor']).toStringPrice()}}</span>
          </template>
          <span>Duplo click para mais detalhes</span>
        </v-tooltip>
      </template>
      <template v-slot:item.proximaApuracao="{ item }">
        <span>{{moment(item.proximaApuracao).format('L') === moment().format('L') ? 'HOJE' : (moment(item.proximaApuracao).format('L') === moment().add(1, 'days').format('L') ? 'AMANHÃ' : moment(item.proximaApuracao).format('L'))}}</span>
      </template>
      <template v-slot:item.valorPrevisto="{ item }">
        <span>{{Number(item.valorPrevisto).toStringPrice()}}</span>
      </template>
      <template v-slot:item.action="{ item }">
        <v-icon class="mr-2"  @click="editItem(item)" >
          edit
        </v-icon>
      </template>
        <template v-slot:no-data>
          <v-alert :value="true" color="error" icon="warning">
            Não ha dados cadastrados
          </v-alert>
        </template>
        <template v-slot:no-results>
          <v-alert :value="true" color="error" icon="warning">
            A pesquisa não retornou dados.
          </v-alert>
        </template>
    </v-data-table>
  </v-container>
</template>
<script>  
import app from '@/services/app'
import dezenas from '@/components/modalidade/sorteio/dezenas'
export default {
  name: 'pages.sorteios.Sorteio',
  components: {
    'v-dezenas': dezenas,
  },
  data(){
    return {
      codigoModalidade: null,
      tituloModalidade: null,
      constSizeHeader: 270,
      constSizeRow: 65,
      itensPerPage: 10,
      search: null,
      pagination: {page: 1, pageCount: 0, itemsPerPage: 10},
      selected: [],
      data: [],
      windowSize: {
        x : 0,
        y: 0
      },
      sorteio:{
        premiacao: []
      },
      defaulModel: {
        premiacao: []
      },
      dialog: false,
      configHeaders: [
        {
          text: '',
          align: '',
          class: '',
          value: 'mobile',
          sortable: false,
          notDisplay: ['sm','md', 'lg', 'xl']
        },
        {
          text: 'Concurso',
          align: 'center',
          class: 'longText',
          value: 'concurso',
          sortable: false,
          notDisplay: ['xs']
        },
        {
          text: 'Data',
          align: 'Center',
          class: 'longText',
          value: 'apuracao',
          sortable: false,
          notDisplay: ['xs']
        },
        {
          text: 'Dezenas',
          align: 'center',
          value: 'resultado',
          sortable: false,
          notDisplay: ['xs']
        },
        {
          text: 'Prêmio',
          align: 'right',
          value: 'premiacao',
          sortable: false,
          notDisplay: ['xs','sm']
        },
        {
          text: 'Próximo',
          align: 'center',
          value: 'proximoConcurso',
          sortable: false,
          notDisplay: ['xs']
        },
        {
          text: 'Próximo Data',
          align: 'center',
          value: 'proximaApuracao',
          sortable: false,
          notDisplay: ['xs']
        },
        {
          text: 'Estimativa',
          align: 'right',
          value: 'valorPrevisto',
          sortable: false,
          notDisplay: ['xs','sm']
        }
      ],
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
  methods:{
    async fetchData (){
      var vm = this;        
      vm.$store.dispatch('app/setLoading', true, { root: true })
      await app.get(`api/sorteios/${this.codigoModalidade}/resultado`).then(async (response) => {
        vm.data = [];
        if (response.status === 200 && response.data && response.data.success){
          const { data = [] } = response.data
          vm.data = data;
        }
      }).catch(error => {
        console.error('Error get pessoa: ', error)
      });        
      vm.$store.dispatch('app/setLoading', false, { root: true });      
    },
    detalhes(value) {    
      this.sorteio = value
      this.dialog = true
    },
    async close (refreshData = false) {
      this.dialog = false
      setTimeout(() => {
        this.sorteio = this.defaulModel;
      }, 300);
      
      if (refreshData === true){
        await this.fetchData()
      }
    },
    onResize(){
      setTimeout(() => {
        if (this.windowSize.x !== window.innerWidth || this.windowSize.y !== window.innerHeight ){
          this.windowSize.x = window.innerWidth;
          this.windowSize.y = window.innerHeight
        }
      }, 500);
      
    }
  },
  computed: {
    user(){
      return this.$store.getters.getters['authentication/user']
    },
    isLoading: function () {
      return this.$store.getters['app/isLoading']
    },
    conputedData(){
      return null
    },
    headers(){
      var headers = this.configHeaders
      Object.keys(headers).map(e=> {
        if (headers[e] && Array.isArray(headers[e].notDisplay) && headers[e].notDisplay.indexOf(this.$vuetify.breakpoint.name) > -1) {
          delete headers[e];
        }
      })
      return headers;
    },
    rowsPerPage () {
      const itemSize = (window.innerWidth < 600 ?  (Object.keys(this.headers).length * this.constSizeRow ):  this.constSizeRow);
      const headerSize = (window.innerWidth < 600 ?  (this.constSizeHeader + 56):  this.constSizeHeader);
      const sizeDispe = window.innerHeight - headerSize;
      const itensPorPage = Math.floor(sizeDispe / itemSize);
      return itensPorPage 
    }
  },
  mounted(){
    this.onResize();
  },
  created() {
      this.codigoModalidade = this.$route.meta && this.$route.meta.modalidade ? this.$route.meta.modalidade.codigo : null
      this.tituloModalidade = this.$route.meta && this.$route.meta.modalidade ? this.$route.meta.modalidade.titulo : null
      this.fetchData();
  },
  watch:{
    $route(current, old){
      if (current !== old){
        this.codigoModalidade = this.$route.meta && this.$route.meta.modalidade ? this.$route.meta.modalidade.codigo : null
        this.tituloModalidade = this.$route.meta && this.$route.meta.modalidade ? this.$route.meta.modalidade.titulo : null
        this.fetchData();
      }
    }
  }
}
</script>
<style scoped>
  .containerMobile {
    justify-content: initial;
  }
  .sorteio {
    display: flex;
    align-items: center;  
  }
  .divConcurso {
    padding: 2px 5px;
    font-weight: bold;
    font-family: Roboto, Arial, Helvetica, sans-serif;
  }
  .premiacao {
    color: grey;
    font-weight: bold;

  }


</style>
