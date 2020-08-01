<template>
  <v-container v-if="!isLoading" fluid grid-list-lg>
    <v-data-table
      :search="search"  
      v-model="selected"
      :headers="headers" 
      calculate-widths
      :items="data"
      item-key="_id"
      sort-by="nome" class="elevation-1"
      hide-default-footer
      :page.sync="pagination.page"
      :items-per-page="rowsPerPage"
      @page-count="pagination.pageCount = $event" >
      <template v-slot:top>
        <v-toolbar flat color="white">
          <v-text-field
            v-model="search"
            append-icon="search"
            label="Pesquisa"
            single-line
            hide-details
          ></v-text-field>
          <div class="flex-grow-1"></div>
          <v-dialog v-model="dialog" persistent  max-width="90%" >
            <v-card>
              <v-card-title>
                <span class="headline">{{ (model._id ? 'Editando' : 'Novo') }}</span>
              </v-card-title>
              <v-card-text>
                <v-container>
                  <v-row>
                    <v-col cols="12" sm="8" md="8">
                      <v-text-field readonly v-model="model.codigo" label="Código" v-validate="'required'"
                        data-vv-name="model.codigo" :error-messages="errors.collect('model.codigo')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field v-model="model.valorApostaMinima" label="Preço" v-validate="'required'"
                        data-vv-name="model.valorApostaMinima" :error-messages="errors.collect('model.valorApostaMinima')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="4" md="4">
                      <v-text-field v-model="model.titulo" label="Modalidade" v-validate="'required'"
                        data-vv-name="model.titulo" :error-messages="errors.collect('model.titulo')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                    <v-col cols="12" sm="12" md="12">
                      <v-text-field rows="2" v-model="model.url" label="URL" v-validate="'required'"
                        data-vv-name="model.url" :error-messages="errors.collect('model.url')" data-vv-scope="model" ></v-text-field>
                    </v-col>
                  </v-row>
                </v-container>
                <v-card>
                  <v-card-title>
                    <span class="headline">Sorteios</span>
                  </v-card-title>
                  <v-card-text>
                    <v-row>
                      <v-col cols="12" sm="1" md="1">
                        <v-text-field v-model="model.ultimoConcurso" label="Concurso" type="number" v-validate="'required'"
                          data-vv-name="model.Concurso" :error-messages="errors.collect('model.Concurso')" data-vv-scope="model" ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3" lg="3">
                        <v-text-field v-model="model.ultimaApuracao" label="Apuração" v-validate="'required'"
                          data-vv-name="model.ultimaApuracao" :error-messages="errors.collect('model.ultimaApuracao')" data-vv-scope="model" ></v-text-field>
                      </v-col>
                    </v-row>
                    <v-row>
                      <v-col cols="12" sm="1" md="1">
                        <v-text-field v-model="model.proximoConcurso" type="number" label="Próximo" v-validate="'required'"
                          data-vv-name="model.proximoConcurso" :error-messages="errors.collect('model.proximoConcurso')" data-vv-scope="model" ></v-text-field>
                      </v-col>
                      <v-col cols="12" sm="3" md="3">
                        <v-text-field  rows="2" v-model="model.proximaApuracao" label="Próxima Apuração" v-validate="'required'"
                          data-vv-name="model.proximaApuracao" :error-messages="errors.collect('model.proximaApuracao')" data-vv-scope="model" ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-card-text>

                </v-card>
              </v-card-text>
              <v-card-actions>
                <div class="flex-grow-1"></div>
                <v-btn color="blue darken-1" text @click="close">Voltar</v-btn>
                <v-btn color="blue darken-1" text @click="save">Salvar</v-btn>
              </v-card-actions>
            </v-card>
          </v-dialog>
        </v-toolbar>
      </template>      
      <template v-slot:item.proximaApuracao="{ item }">
        <span>{{moment(item.proximaApuracao).format('L')}}</span>
      </template>
      <template v-slot:item.valorApostaMinima="{ item }">
        <span>{{Number(item.valorApostaMinima).toStringPrice()}}</span>
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
    <div class="text-xs-center pt-2">
      <v-pagination v-model="pagination.page" :length="pagination.pageCount" ></v-pagination>
    </div>
  </v-container>
</template>
<script>  
import app from '@/services/app'
export default {
  name: 'pages.administracao.Modalidade',
  data(){
    return {
      constSizeHeader: 270,
      constSizeRow: 48,
      itensPerPage: 10,
      search: null,        
      pagination: {page: 1, pageCount: 0, itemsPerPage: 10},
      selected: [],
      data: [],
      model: {},
      defaulModel: {endereco:{}},
      dialog: false,
      configHeaders: [
        {
          text: 'Codigo',
          align: 'left',
          class: 'longText',
          value: 'codigo',
        },
        {
          text: 'Modalidade',
          align: 'left',
          class: 'longText',
          value: 'titulo',
        },
        {
          text: 'Preço',
          align: 'left',
          value: 'valorApostaMinima',
          notDisplay: ['xs','sm']
        },
        {
          text: 'Próximo',
          align: 'left',
          value: 'proximoConcurso',
          notDisplay: ['xs','sm']
        },
        {
          text: 'Próximo Data',
          align: 'left',
          value: 'proximaApuracao',
          notDisplay: ['xs','sm']
        },
        { 
          text: 'Ações', 
          align: 'right',
          value: 'action', 
          sortable: false },
      ],
    }
  },
  methods:{
    async fetchData (){
      var vm = this;        
      vm.$store.dispatch('app/setLoading', true, { root: true })
      await app.get('api/modalidade').then(async (response) => {
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
    async editItem (item) {
      var vm = this;
      vm.$store.dispatch('app/setProcessing', 'Carregando...', { root: true })      
      this.model = item
      this.dialog = true        
      vm.$store.dispatch('app/setProcessing', null, { root: true });
    },
    async close (refreshData = false) {
      this.dialog = false
      setTimeout(() => {
        this.model = this.defaulModel;
      }, 300);
      
      if (refreshData === true){
        await this.fetchData()
      }
    },
    async save () {
      var vm = this;
      try {
        await vm.$validator.validateAll('model').then(async (success) => {
          vm.$store.dispatch('app/setProcessing', 'Salvando...', { root: true });
          if (success) {
            if (vm.model._id) {
              vm.model.updatedAt = Date.now
              await app.put('api/administracao/modalidade/'+vm.model._id, vm.model).then(async (response) => {
                if (response.status === 200 && response.data && response.data.success){
                  vm.$store.dispatch('app/setMessage',{ type: 'info', message: 'Registro atualizado com sucesso!' }, { root: true });
                  vm.$store.dispatch('app/setProcessing', null, { root: true });
                  vm.close(true)
                } else {
                  vm.$store.dispatch('app/setMessage',{ type: 'error', message: response.data.data }, { root: true });
                  vm.$store.dispatch('app/setProcessing', null, { root: true });
                }
              }).catch(error => {
                vm.$store.dispatch('app/setMessage',{ type: 'error', message: error }, { root: true });
                vm.$store.dispatch('app/setProcessing', null, { root: true });
              });
            }
          } else {
            vm.$store.dispatch('app/setProcessing', null, { root: true });
          }
        });
      } catch (error) {
        vm.$store.dispatch('app/setProcessing', null, { root: true });
        vm.$store.dispatch('app/setMessage',{type: 'error',
                                                  message: 'Erro ao Salvar Dados. Erro: '+error
                                                  }, { root: true });
      }
    }
  },
  mounted(){
  },
  created() {
    this.fetchData();
  },
  computed: {
    user(){
      return this.$store.getters.getters['authentication/user']
    },
    isLoading: function () {
      return this.$store.getters['app/isLoading']
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
  }
}
</script>
<style scoped>
</style>
