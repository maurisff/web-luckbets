<template>
  <v-container v-if="!isLoading" fluid grid-list-lg>    
    <v-toolbar dense   >
        <v-toolbar-title class="d-none d-sm-flex headline">{{tituloModalidade}}</v-toolbar-title>
        <v-spacer class="d-none d-sm-flex"></v-spacer>
        <v-text-field
          class=""
          dense
          rounded
          outlined
          single-line
          hide-details
          append-icon="search"
          v-model="search"
          :label="`Pesquisa`"
        ></v-text-field>
        
        <v-menu
          v-model="options.menuFilter"
          :close-on-content-click="false"
          :nudge-width="200"
          offset-x
        >
          <template v-slot:activator="{ on, attrs }">
            <v-btn class="" icon
              v-bind="attrs"
              v-on="on">
              <v-icon>mdi-filter-menu</v-icon>
            </v-btn>
          </template>
          <v-card>
            <v-list class="pa-0">
              <v-list-item class="px-2 px-0">
                <v-list-item-content class="px-2">
                  <v-list-item-title>Opções de Filtro</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
            <v-divider></v-divider>
            <v-list>
              <v-list-item>
                <v-list-item-action>
                  <v-switch v-model="options.expectedOnly1" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Apenas Previstos</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-switch v-model="options.awardedOnly1" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Apenas Premiados</v-list-item-title>
              </v-list-item>
              <v-list-item>
                <v-list-item-action>
                  <v-switch v-model="options.groupsOnly1" color="purple"></v-switch>
                </v-list-item-action>
                <v-list-item-title>Apostas em Grupo</v-list-item-title>
              </v-list-item>
            </v-list>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn text @click="closeOptions">Cancela</v-btn>
              <v-btn color="primary" text @click="filterData">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-menu>
        <v-btn class="" icon @click="apostar">
          <v-icon dark>mdi-plus</v-icon>
        </v-btn>
    </v-toolbar>
    <!--<div v-if="$vuetify.breakpoint.xsOnly">-->
      <div>
        <v-list two-line elevation="6">
          <template v-if="!resultData || resultData.length === 0">
            <v-list-item dense class="pa-0" v-bind:style="{'background': ((defaultData && defaultData.length > 0) ? 'red': 'yellow')}" >
              <v-list-item-content class="pa-1" >                
                <v-list-item-title class="d-flex d-block justify-center px-1"  >
                  {{(defaultData && defaultData.length > 0) ? 'Filtro não retornou dados!': 'Voçê não possui apostas!'}}
                </v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </template>
          <template v-else v-for="(item, index) in resultData">
            <v-list-item :key="index" dense class="pa-0" v-bind:style="{'background': (item.premiado ? 'limegreen': ''), 'max-width': '100%'}">
              <v-list-item-content class="pa-1" >                
                <v-list-item-title class="d-flex d-block justify-center px-1">
                  <div> Concurso: {{item.concurso}} - {{item.apuracao ? moment(item.apuracao).format('L') === moment().format('L') ? 'HOJE' : (moment(item.apuracao).format('L') === moment().add(1, 'days').format('L') ? 'AMANHÃ' : moment(item.apuracao).format('ddd DD/MM/YYYY')) : 'Sem Previsão'}} </div>
                </v-list-item-title>
                <v-list-item-subtitle class="d-flex d-block justify-center">
                  <div class="d-flex d-block">
                    <div>{{item.jogos.length}} {{item.jogos.length === 1 ? 'Jogo' : 'Jogos' }} - {{item.conferido ? 'Prêmio': 'Prêmio Previsto'}} {{Number( item.conferido ? item.vlPremiado : (item.premioPrevisto || 0) ).toStringPrice()}}</div>
                  </div>
                </v-list-item-subtitle>
                
                <v-list-item-subtitle class="d-flex d-block justify-center">
                  <span>
                    <div v-if="!item.conferido">Aguardando Sorteio, Cruse os dedos!</div>
                    <div v-if="item.conferido && item.premiado">Sua aposta foi premiada. Parabéns!</div>
                    <div v-if="item.conferido && !item.premiado">Não foi dessa vez, Boa sorte na próxima!</div>
                  </span>
                </v-list-item-subtitle>
              </v-list-item-content>

              <v-list-item-action class="justify-center align-center ma-1">
                <v-menu bottom left>
                  <template v-slot:activator="{ on, attrs }">
                    <v-btn dark icon fab small
                      color="primary" 
                      v-bind="attrs"
                      v-on="on">
                      <v-icon >mdi-dots-vertical</v-icon>
                    </v-btn>
                  </template>

                  <v-list dense>
                    <v-list-item flat @click="openDetail(item)">
                      <v-list-item-icon>
                        <v-icon color="green">mdi-table-eye</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Detalhes</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item v-if="false" @click="duplicarAposta(item)">
                      <v-list-item-icon>
                        <v-icon color="blue">mdi-open-in-new</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Duplicar</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                    <v-list-item @click="excluirAposta(item)">
                      <v-list-item-icon>
                        <v-icon color="red">mdi-delete</v-icon>
                      </v-list-item-icon>
                      <v-list-item-content>
                        <v-list-item-title>Excluir</v-list-item-title>
                      </v-list-item-content>
                    </v-list-item>
                  </v-list>
                </v-menu>
              </v-list-item-action>
            </v-list-item>
            <v-divider v-if="index + 1 < resultData.length"
              :key="`div${index}`"></v-divider>
          </template>          
        </v-list>
        <v-dialog v-model="dialogDetalhes" persistent max-width="80%">
          <v-card>
            <v-card-title class="headline justify-center">Concurso {{apostaSelected.concurso}}</v-card-title>
            <v-card-subtitle class="d-block justify-center pa-0 px-4">
              <div class="d-flex justify-center">Apuração: {{apostaSelected.apuracao ? moment(apostaSelected.apuracao).format('ddd DD/MM/YYYY') : 'Sem Previsão'}}</div>
              <div class="d-flex justify-center">Cadastrada: {{moment(apostaSelected.createdAt).format('DD/MM/YYYY HH:mm')}}</div>
            </v-card-subtitle>
            <v-card-text class="pa-0">
              <v-list two-line>
                <template v-for="(item, index) in apostaSelected.jogos">
                  <v-list-item :key="index" dense class="pa-0">
                    <v-list-item-content class="pa-1" >                
                      <v-list-item-title class="d-flex flex-wrap justify-center px-1">
                        <div v-for="(d, i) in (item.dezenas)" :key="i" 
                          v-bind:style="{ 'border': `1px solid ${apostaSelected.modalidadeId.style.corBGDezena}`, 'background': (item.dezenasConferidas.indexOf(d) > -1 ? apostaSelected.modalidadeId.style.corBGDezena : '')}"
                          class="dezenas" >
                          {{d}}
                        </div>
                      </v-list-item-title>
                      <v-list-item-subtitle class="d-flex d-block justify-center">
                        <div class="d-flex d-block">
                        <div> Cota {{item.cota}}/{{item.cotas}} - Custo: {{Number( item.valorCusto || 0).toStringPrice()}} {{ apostaSelected.conferido ? ` - ${(item.acertos || 0)} Acertos`: '' }}</div>
                        </div>
                      </v-list-item-subtitle>
                    </v-list-item-content>                    
                  </v-list-item>
                </template>   
              </v-list>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="green darken-1" text @click="dialogDetalhes = false">OK</v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
    </div>
    <!--
    <div v-else>
      Visão para desktop
    </div>
    -->
  </v-container>
</template>
<script>  
import app from '@/services/app'
// import dezenas from '@/components/modalidade/sorteio/dezenas'
export default {
  name: 'pages.sorteios.Sorteio',
  components: {
    // 'v-dezenas': dezenas,
  },
  data(){
    return {
      codigoModalidade: null,
      tituloModalidade: null,
      constSizeHeader: 270,
      constSizeRow: 65,
      itensPerPage: 10,
      viewSearch: false,
      search: null,
      options: {
        menuFilter: false,
        expectedOnly: true,
        expectedOnly1: true,
        awardedOnly:false,
        awardedOnly1:false,
        groupsOnly:false,
        groupsOnly1:false
      },
      dialogDetalhes: false,
      apostaSelected: {

      },
      pagination: {page: 1, pageCount: 0, itemsPerPage: 10},
      selected: [],
      defaultData: [],
      data: [],
      dialog: false,
      hTable: [
        {
          text: '',
          align: '',
          class: '',
          value: 'mobile',
          sortable: false
        },
        {
          text: 'Concurso',
          align: 'center',
          class: '',
          value: 'concurso',
          sortable: false,
        },
        {
          text: 'Apuração',
          align: 'Center',
          class: '',
          value: 'apuracao',
          sortable: false
        },
        {
          text: 'Dt. Aposta',
          align: 'center',
          class: '',
          value: 'createdAt',
          sortable: false
        },
        {
          text: 'Jogos',
          align: 'center',
          class: '',
          value: 'jogos',
          sortable: false
        },
        {
          text: 'Custo',
          align: 'right',
          class: '',
          value: 'vlCustoAposta',
          sortable: false
        },
        {
          text: 'Prêmio',
          align: 'right',
          class: '',
          value: 'vlPremiado',
          sortable: false
        },
        {
          text: 'Ações',
          align: 'center',
          class: '',
          value: 'action',
          sortable: false
        }
      ]
    }
  },
  methods:{
    async custonSearch(item){
      if (!item ){
        return false;
      }
      if (!this.search){
        return true;
      }
      return !!await Object.keys(item).filter( p => {
        if ( this.moment(item[p]).isValid() && this.moment(this.search).isValid()){
          return this.moment(item[p]).isSame(this.moment(this.search))
        } else if (!isNaN(item[p]) && !isNaN(this.search)) {
          return Number(item[p]) === Number(this.search)
        } else {
          return (item[p]||'').toString() === (this.search||'').toString()
        }
      })
    },    
    async apostar (){
      // console.log('Router', this.$route.path)
      // `/volante/${codigoModalidade.toString().toLowerCase()}/apostar`
      const parm = {
        redirect: this.$route.path,
      }
      const p = btoa(JSON.stringify(parm))      
      this.$router.push({ path: `/volante/${this.codigoModalidade.toString().toLowerCase()}/apostar?p=${p}` }).catch(() => { });
    },
    async duplicarAposta (item){


      //await this.$store.dispatch('app/setMessage', { type: 'warning', message: `Ainda não é possível Duplicar a aposta do concurso ${item.concurso}. Funcionalidade em desenvolvimento!` }, { root: true });

      // console.log('Router', this.$route.path)
      // `/volante/${codigoModalidade.toString().toLowerCase()}/apostar`
      const parm = {
        jogoId: item._id,
        redirect: this.$route.path,
      }
      const p = btoa(JSON.stringify(parm))      
      this.$router.push({ path: `/volante/${this.codigoModalidade.toString().toLowerCase()}/apostar?p=${p}` }).catch(() => { });

    },
    async excluirAposta (item){
      const deletedIdx = this.defaultData.findIndex(f=> f._id === item._id )
      this.$dialog.confirm(`Deseja excluir a aposta no concurso ${item.concurso} da ${item.modalidadeId.titulo} ?`, { loader: true}).then(async (dialog) => {
        await app.delete(`api/aposta/${item._id}`).then(async (response) => {
          if (response.status === 200 && response.data && response.data.success){
            await this.defaultData.splice(deletedIdx, 1);
          }
          await this.filterData();
        }).catch(error => {
          console.error('Error get pessoa: ', error)
        });
        dialog.close();
      }).catch(() => {})      
    },
    async openDetail (item){
      if (item){
        this.apostaSelected = item;
        this.dialogDetalhes = true;
      }
    },
    async closeOptions (){      
      this.options.expectedOnly1 = this.options.expectedOnly;
      this.options.awardedOnly1 = this.options.awardedOnly;
      this.options.groupsOnly1 = this.options.groupsOnly;
      this.options.menuFilter = false
    },
    async filterData (){
      
      this.options.expectedOnly = this.options.expectedOnly1;
      this.options.awardedOnly = this.options.awardedOnly1;
      this.options.groupsOnly = this.options.groupsOnly1;

      this.data = [];
      const aux = await this.defaultData.filter( f => (this.options.expectedOnly && !!f.apuracao)|| !this.options.expectedOnly)
                                       .filter( f => (this.options.awardedOnly && f.premiado)|| !this.options.awardedOnly)
                                       .filter( f => (this.options.groupsOnly && !!f.bolaoId)|| !this.options.groupsOnly)
      if (aux && aux.length > 0){        
        this.data = aux;
      }

      this.options.menuFilter = false
    },
    async onChageModalidade (){
      this.$store.dispatch('app/setLoading', true, { root: true })
      
      this.codigoModalidade = this.$route.meta && this.$route.meta.modalidade ? this.$route.meta.modalidade.codigo : null
      this.tituloModalidade = this.$route.meta && this.$route.meta.modalidade ? this.$route.meta.modalidade.titulo : null
      await app.get(`api/aposta/${this.codigoModalidade}/resultado`).then(async (response) => {
        this.defaultData = [];
        if (response.status === 200 && response.data && response.data.success){
          const { data = [] } = response.data
          this.defaultData = data;          
        }
        await this.filterData();  
        // console.log('Meus jogos: ', this.defaultData)
      }).catch(error => {
        console.error('Error get pessoa: ', error)
      });      
      this.$store.dispatch('app/setLoading', false, { root: true });      
    }
  },
  computed: {
    user(){
      return this.$store.getters.getters['authentication/user']
    },
    isLoading: function () {
      return this.$store.getters['app/isLoading']
    },
    resultData(){
      const aux = this.data.filter( (f) => this.custonSearch(f)) || [];
      // console.log(`resultData${this.search}: `, aux)
      return aux || []
    }
  },
  mounted(){

  },
  created() {
      this.onChageModalidade();
      // console.log('resultData: ', this.resultData)
  },
  watch:{
    $route(current, old){
      if (current !== old){
        this.onChageModalidade();
      }
    }
  }
}
</script>
<style scoped>

.dezenas {
  display: inline-block;
  border-radius: 50%;
  width: 26px;
  height: 26px;
  padding: 5px 0px;
  font-size: 16px;
  text-align: center;
  margin-right: 1px;
  margin-bottom: 1px;
  font-family:Roboto, Arial, Helvetica, sans-serif;
  /* Não permite selecionar o texto da dezena*/
  -webkit-touch-callout: none;  /* iPhone OS, Safari */
  -webkit-user-select: none;    /* Chrome, Safari 3 */
  -khtml-user-select: none;     /* Safari 2 */
  -moz-user-select: none;       /* Firefox */
  -ms-user-select: none;        /* IE10+ */
  user-select: none;            /* Possível implementação no futuro */
  /* cursor: default; */
}


@media only screen and (min-width: 450px) {
  .dezenas {	
    width: 36px;
    height: 36px;
    padding: 8px 6px;
    font-size: 18px;
    text-align: center;
    margin-right: 1px;
    margin-bottom: 1px;
	}
}

@media only screen and (min-width: 600px) {
  .dezenas {	
    width: 40px;
    height: 40px;
    padding: 10px 6px;
    font-size: 20px;
    text-align: center;
    margin-right: 1px;
    margin-bottom: 1px;
	}
}











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
