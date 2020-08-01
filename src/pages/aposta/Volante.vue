<template>
  <v-container v-if="!isLoading">
    <div class="d-flex justify-space-between align-start">
      <div>
        <v-btn v-if="goBack" class="mx-2" color="info" :to="goBack">
          <v-icon >mdi-arrow-left-bold-outline</v-icon>            
          {{$vuetify.breakpoint.xsOnly ? '': 'Voltar'}}
        </v-btn>
      </div>
      <div class="d-flex justify-space-around align-start align-content-center">
        <v-btn class="mx-2" color="success" @click="finalizarAposta()">
          <v-icon>mdi-content-save-outline</v-icon>            
          {{$vuetify.breakpoint.xsOnly ? '': 'Finalizar'}}
        </v-btn>
        <v-btn class="mx-2" color="red" @click="clearAll()">
          <v-icon>mdi-close</v-icon>            
          {{$vuetify.breakpoint.xsOnly ? '': 'Limpar'}}
        </v-btn>
      </div>
    </div>
    <div class="d-flex flex-sm-row flex-column">
      <v-card class="d-sm-inline align-self-start ma-2" :style="$vuetify.breakpoint.xsOnly ? 'max-width: 100%' : 'max-width: 40%' ">
        <v-card-title class="justify-center"  >
          <v-icon :color="modalidade.corTitulo" size="40">mdi-clover</v-icon>
          <span v-bind:style="{'color': modalidade.corTitulo}" class="tituloVolante">
          {{tituloModalidade}}
          </span>
        </v-card-title>
        <v-card-text class="dezenas" v-if="(volante && volante.length > 0)" >
          
          <div v-for="(d, i) in volante" :key="i" class="dezena" 
            v-bind:style="{'background': (d.selected ? modalidade.corBGDezena : modalidade.corDefaulBGDezena)}" @click="marcarDezena(d)">
            {{d.dezena}}
          </div>
          <br/>
          <div class="d-flex justify-space-between">
            <div class="d-inline-flex "><span>{{countSelecteds >0 ? `Selecionadas: ${countSelecteds}` : '' }}</span></div>
            <div class="d-inline-flex "><span>{{countSelecteds > 0 && modalidade.minDezenas > countSelecteds ? `Restante: ${(modalidade.minDezenas - countSelecteds)}` : '' }}</span></div>
          </div>
          <div>
            <div v-for="(d, i) in volanteSelecionado" :key="i" class="containerDezenaSelecionada" >
              <div v-if="i>0" class="containerDezenaSelecionada" >-</div>
              <div class="containerDezenaSelecionada numberOfDezena" 
                v-bind:style="{'color': modalidade.corBGDezena}">{{d.dezena}}</div>
            </div>
          </div>          
          <v-expansion-panels accordion flat>
            <v-expansion-panel >
              <v-expansion-panel-header>Cota de Bolão?</v-expansion-panel-header>
              <v-expansion-panel-content>
                <v-row  class="align-center justify-center ">
                  <v-col>
                    <div>Cota:</div>
                  </v-col>
                  <v-col>
                    <v-text-field 
                      v-model="cota"
                      type="Number"
                      :rules="[volanteMinCota, volanteMaxCota]"
                      label="Cota"
                      single-line
                    ></v-text-field>
                  </v-col>
                  <v-col>
                    <div>Cotas: </div>
                  </v-col>
                  <v-col>
                    <v-text-field 
                      v-model="cotas"
                      type="Number"
                      :rules="[volanteMinCotas]"
                      label="Total Cotas"
                      single-line
                    ></v-text-field>
                  </v-col>
                </v-row>
                <v-row class="align-center justify-center">                  
                  <v-col>
                    <div>Custo Bolão: </div>
                  </v-col>
                  <v-col>
                    <v-text-field 
                      v-model="custoVolante"
                      type="Number"
                      label="valor de custo"
                      single-line
                    ></v-text-field>
                  </v-col>
                </v-row>
              </v-expansion-panel-content>
            </v-expansion-panel>
          </v-expansion-panels>

        </v-card-text>
        <v-card-actions class="justify-center">
            <v-btn outlined color="success" @click="addBilhete()">
              <v-icon >mdi-check-bold</v-icon>            
              Incluir
            </v-btn>
            <v-btn outlined color="red" @click="limparBilhete()">
              <v-icon >mdi-close</v-icon>            
              Limpar
            </v-btn>
        </v-card-actions>
      </v-card>
      
      <v-card class="d-sm-inline flex-grow-1 align-self-start ma-2" :style="$vuetify.breakpoint.xsOnly ? 'max-width: 100%' : 'max-width: 60%' ">
        <v-card-title class="justify-center" >Jogos</v-card-title>
        <v-card-text class="dezenas" v-if="(volante && volante.length > 0)" >
          <div>            
            <div class="concurso cctxt">Concurso: </div>
            <div class="concurso ccValue">
              <v-edit-dialog
                :return-value="concurso" persistent large
                cancel-text="Voltar"
                save-text="OK"
                @save="changeConcurso">
                {{ concurso || 'inválido' }}
                <template v-slot:input>
                  <v-text-field 
                    v-model="concurso"
                    type="Number"
                    :rules="[concursoRequired]"
                    label="Concurso"
                    single-line
                  ></v-text-field>
                </template>
              </v-edit-dialog>
            </div>            
            <div class="concurso cctxt">-</div>
            <div class="concurso cctxt">{{ apuracao ? moment(apuracao).format('L') : 'Indefinida'}}</div>
          </div>  
          <v-select
            :items="ofTeimozinha"
            v-model="teimozinha"
            item-text="desc"
            item-value="code"
            label="Teimozinha"
            absolute
            hide-details
            class="pa-2"
          ></v-select>
          <div>
            <v-data-table 
              :headers="hJogos" 
              calculate-widths dense
              :items="jogos"
              item-key="id"
              no-data-text=""
              no-results-text=""
              hide-default-footer> 
              <template v-slot:item.dezenas="{ item }">
                <div class="containerDezenaSelecionada numberOfDezena d-flex justify-start" 
                        v-bind:style="{'color': modalidade.corBGDezena}">
                        {{ item.dezenas.join("-") }}
                      </div>  
              </template>
              <template v-slot:item.valorCusto="{ item }">
                <div class="d-flex justify-center">
                  <span>{{Number(item.valorCusto).toStringPrice()}} R$</span>
                </div>
              </template>
              <template v-slot:item.action="{ item }">
                <div class="d-flex justify-center">
                  <v-btn  x-small icon color="info" @click="editJogo(item.id, item)">
                    <v-icon >mdi-pencil</v-icon>
                  </v-btn>
                  <v-btn  x-small icon color="error" @click="deleteJogo(item.id)">
                    <v-icon >mdi-delete</v-icon>
                  </v-btn>
                </div>
              </template>
            </v-data-table>  

            <v-simple-table fixed-header dense mobile v-if="false">
              <template v-slot:default>
                <thead>
                  <tr>
                    <th class="text-left">Jogos</th>
                    <th class="text-rigth">Custo</th>
                    <th class="text-center">Ações</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="(j, i) in jogos" :key="i" >
                    <td class="d-flex align-center">
                      <div class="containerDezenaSelecionada numberOfDezena d-inline-block flex-nowrap" 
                        v-bind:style="{'color': modalidade.corBGDezena}">
                        {{ j.dezenas.join("-") }}
                      </div>                      
                    </td>
                    <td>{{ j.valorCusto }}</td>
                    <td  class="d-inline-block justify-center">                      
                      <v-btn  x-small icon color="info" @click="editJogo(j.id, j)">
                        <v-icon >mdi-pencil</v-icon>
                      </v-btn>
                      <v-btn  x-small icon color="error" @click="deleteJogo(j.id)">
                        <v-icon >mdi-delete</v-icon>
                      </v-btn>
                    </td>
                  </tr>
                </tbody>
              </template>
            </v-simple-table>
          </div>
        </v-card-text>
      </v-card>

      <div v-if="false" class="align-self-start flex-grow-1 d-none d-lg-flex participantes">
        <v-card >
          <v-card-title class="justify-center flex-grow-0" >Participantes</v-card-title>
          <v-card-text class="dezenas" v-if="(volante && volante.length > 0)" >
            <div v-for="(d, i) in volante" :key="i" >{{d.dezena}}ª Participante</div>
          </v-card-text>
        </v-card>
      </div>      

    </div>
  </v-container>
</template>
<script>  
import app from '@/services/app'
/*import volante from '@/components/modalidade/volante/volante'*/
export default {
  name: 'pages.aposta.Volante',
  components: {
    /*'v-volante': volante,*/
  },
  data(){
    return {
      codigoModalidade: null,
      tituloModalidade: null,
      modalidade: {
        dezenas: 0,
        minDezenas: 0,
        maxDezenas: 0,
        valorApostaMinima: 0,
        teimozinha: [],
        corTitulo: "#930089",
        corBGDezena: "#930089",
        corDefaulBGDezena: 'lightgray'
      },
      proximoConcurso: null,
      proximaApuracao: null,
      volante: [
        {
          selected: false,
          dezena: 0
        }
      ],
      cota: 1,
      cotas: 1,
      custoVolante: null,
      concurso: null,
      apuracao: null,
      teimozinha: 0,
      dezenas: [],
      jogos: [],
      EditedJogoId: null,
      bolao: {
        isBolao: false,
        participantes: []
      },
      goBack: null,      
      hJogos: [
        {
          text: 'Jogos',
          align: 'left',
          class: 'd-flex justify-start',
          value: 'dezenas',
          sortable: false,
          filterable: false
        },
        {
          text: 'Custo',
          align: 'right',
          class: 'justify-end',
          value: 'valorCusto',
          sortable: false,
          filterable: false
        },
        {
          text: 'Ações',
          align: 'center',
          class: 'justify-center',
          value: 'action',
          sortable: false,
          filterable: false
        }
      ],
      concursoRequired: v => (v && v > 0) || 'Concurso é obrigatório!',
      volanteMaxCota: v => (v && v <= this.cotas) || `A Cota deve ser menor ou igual a quantidade total de cotas ${this.cotas}!`,
      volanteMinCota: v => (v && v > 0) || 'A Cota deve ser mair que zero!',
      volanteMinCotas: v => (v && v >= this.cota) || `O total de Cotas deve ser maior que ${this.cota}!`,
    }
  },
  methods:{
    async fatorial(valor) {
        // para valores negativos
        if(valor<0) {
          return 1;
          // para valor = 0  ou igual a 1
        } else if ( (valor == 0) || (valor == 1) ) {
          return 1;
        } else {
          var acumula = 1;
          for(var x=valor;x>1;x--) {
            acumula = acumula * x;
          }
          return acumula;
        }
    },
    async valorCustoCombinacao(selecionados, dezenas, valor) {
      if (!isNaN(selecionados)  && !isNaN(dezenas) && !isNaN(valor) && selecionados > 0 && dezenas > 0 && valor > 0){
          var div = (await this.fatorial(dezenas) * await this.fatorial(selecionados-dezenas));
          if (div === 0){
              div = 1;
          }
          return (await this.fatorial(selecionados) / div) * valor
      }else{
          return 0
      }
    },
    async changeConcurso(){
      // console.log('changeConcurso: ', this.concurso, this.proximoConcurso, this.apuracao, this.proximaApuracao)
      const vConcurso = Number(this.concurso);
      const vproximoConcurso = Number(this.proximoConcurso);
      if (vConcurso !== vproximoConcurso) {
        if (vConcurso > vproximoConcurso) {
          this.apuracao = null
        } else {
          try {            
            let {status, data}  = await app.get(`api/sorteios/${this.codigoModalidade}/resultado`, { params: { concurso: vConcurso } })
            if (status === 200 && data.data && data.data.length > 0 ){
              let { apuracao } = data.data[0];
              this.apuracao = apuracao;
            } else {
              this.apuracao = null
            }
          } catch (error) {
            this.apuracao = null
          }
        }
      } else if (vConcurso === vproximoConcurso && ((!this.apuracao) || this.apuracao !== this.proximaApuracao )) {
        this.apuracao = this.proximaApuracao
      }
    },
    async onChageModalidade(){
      
      this.$store.dispatch('app/setLoading', true, { root: true })      
      this.clearAll();
      this.codigoModalidade = this.$route.meta && this.$route.meta.modalidade ? this.$route.meta.modalidade.codigo : null
      this.tituloModalidade = this.$route.meta && this.$route.meta.modalidade ? this.$route.meta.modalidade.titulo : null
      const { p } = this.$route.query
      let parm = {}
      if (p){
        try {
          parm = await JSON.parse(atob(p))
        } catch (e) {
          parm = {}
        }
      }
      try {
        let {status, data}  = await app.get('api/modalidade', { params: { codigo: this.codigoModalidade } })
        if (status === 200){
          if (data.data && data.data[0]){
            let { dezenas, minDezenas, maxDezenas, valorApostaMinima, teimozinha, style } = data.data[0];
            let { corTitulo, corBGDezena, corDefaulBGDezena = "lightgray" } = style
            
            if (!teimozinha || teimozinha.indexOf(0) === -1 ){
              teimozinha = [0, ...teimozinha]
            }            
            corBGDezena = corBGDezena ? corBGDezena : 'darkgray'
            corDefaulBGDezena = corDefaulBGDezena ? corDefaulBGDezena : 'lightgray'

            this.modalidade = { dezenas, minDezenas, maxDezenas, valorApostaMinima, teimozinha, corTitulo, corBGDezena, corDefaulBGDezena }
          } else {
            throw 'Opss!! Algo de errado esta acontecendo. Tente novamente mais tarde!'
          }
        } else {          
          throw 'Opss!! Algo de errado esta acontecendo. Tente novamente mais tarde!'
        }
      } catch (error) {
        console.error('get->api/modalidade: ', error.message)
      }     

      try {
        let {status, data}  = await app.get(`api/sorteios/ultimoresultado/${this.codigoModalidade}`)
        if (status === 200 && data.data){
          let { proximoConcurso, proximaApuracao/*, valorPrevisto*/ } = data.data;            
          this.proximoConcurso = proximoConcurso;
          this.proximaApuracao = proximaApuracao;
          
          this.concurso = parm.concurso || this.proximoConcurso;          
          this.changeConcurso();
          //this.apuracao = this.proximaApuracao;
        } else {          
          throw 'Opss!! Algo de errado esta acontecendo. Tente novamente mais tarde!'
        }
      } catch (error) {
        console.error('get->api/ultimoresultado: ', error.message)
      }

      const arr = await Array.from({length:(this.modalidade.dezenas || 0)},(a,b)=> b+1)
      this.volante = arr.map(d => ({selected: false, dezena: d}))
      
      if (parm && parm.redirect && this.$router.options.routes.some(v=> v.path === parm.redirect)){
        this.goBack = parm.redirect;
      }

      this.$store.dispatch('app/setLoading', false, { root: true })
    },
    async marcarDezena (d){
      const eventDezena = {
        selected: !d.selected,
        dezena: d.dezena
      }
      if (!d.selected && this.countSelecteds >= this.modalidade.maxDezenas){
        await this.$store.dispatch('app/setMessage', { type: 'info', message: `Não é possível selecionar mais do que ${this.modalidade.maxDezenas} dezenas!` }, { root: true });
      } else {
        this.volante = this.volante.map( v => (v.dezena === eventDezena.dezena ? eventDezena: v) )
      }
    },
    async addJogos(){
      const valorCusto = this.custoVolante && this.custoVolante > 0 ? Number(this.custoVolante) : await this.valorCustoCombinacao(this.countSelecteds, this.modalidade.minDezenas , this.modalidade.valorApostaMinima)
      const jogo = {
          id: this.EditedJogoId || this.$uuid.v1(),
          dezenas: this.volanteSelecionado.map(p=> p.dezena),
          cota: this.cota,
          cotas: this.cotas,
          valorCusto,
          isCustoBolao: this.custoVolante && this.custoVolante> 0
        }
      const editedIndex = await this.jogos.findIndex(f=> f.id === this.EditedJogoId )
      if (editedIndex > -1){
        this.jogos.splice(editedIndex, 1, jogo);
      } else {
        await this.jogos.push(jogo)
      }
      this.limparBilhete()
    },
    
    async editJogo(id, jogo){
      this.EditedJogoId = id;
      this.cota = jogo.cota;
      this.cotas = jogo.cotas;
      this.custoVolante = jogo.isCustoBolao ? jogo.valorCusto: null;
      this.volante = this.volante.map( v => ({selected: jogo.dezenas.findIndex(f=> f === v.dezena ) != -1, dezena:v.dezena}) )

    },    
    async deleteJogo(id){
      const deletedIdx = this.jogos.findIndex(f=> f.id === id )
      if (deletedIdx > -1){      
        const jogo = this.jogos[deletedIdx]
        this.$dialog.confirm(`Deseja remover o jogo com as Dezenas: \n"${jogo.dezenas}" ?`, { loader: true}).then(async (dialog) => {
            await this.jogos.splice(deletedIdx, 1);
            dialog.close();
          }).catch(() => {})
      }
    },
    async addBilhete(){
      if (this.countSelecteds < this.modalidade.minDezenas){
        await this.$store.dispatch('app/setMessage', { type: 'info', message: `É necessario selecionar pelo menos ${this.modalidade.minDezenas} dezenas!` }, { root: true });
      } else if (!this.cota || isNaN(this.cota) || Number(this.cota) <= 0){
        await this.$store.dispatch('app/setMessage', { type: 'info', message: `A quantidade de cotas (${this.cota}) não é válida. Deve ser um numero maior que zero!` }, { root: true });
      } else if (!this.cotas || isNaN(this.cotas) || Number(this.cotas) <= 0){
        await this.$store.dispatch('app/setMessage', { type: 'info', message: `A quantidade total de cotas (${this.cotas}) não é válida. Deve ser um numero maior que zero!` }, { root: true });
      } else if (Number(this.cota) > Number(this.cotas)){
        await this.$store.dispatch('app/setMessage', { type: 'info', message: `A quantidade de cotas (${this.cota}) não deve ser maior que a quantidade total das cotas (${this.cotas})` }, { root: true });
      } else if (this.custoVolante && (isNaN(this.custoVolante) || Number(this.custoVolante) <= 0)){
        await this.$store.dispatch('app/setMessage', { type: 'info', message: `O Valor de Custo do volante (${this.custoVolante}) Deve ser um numero maior que zero, ou deixe em branco para que o sistema calcule o valor automaticamente.` }, { root: true });
      } else {
        if (this.jogos.find(f => f.dezenas.join("-") === this.volanteSelecionado.map(p=> p.dezena).join("-") && f.id !== this.EditedJogoId)){
          this.$dialog.confirm('Dezenas já foram lançadas, deseja continuar?', { loader: true}).then(async (dialog) => {
            this.addJogos();
            dialog.close();
          }).catch(() => {})
        } else {
          this.addJogos();
        }
      }      
    },
    async limparBilhete(){
      this.EditedJogoId = null;
      this.cota = 1;
      this.cotas = 1;
      this.custoVolante = null;
      this.volante = this.volante.map( v => ({selected: false, dezena:v.dezena}) )
    },
    async limparJogos(){
      this.teimozinha = 0;            
      this.concurso = this.proximoConcurso,
      this.apuracao = this.proximaApuracao,
      this.jogos = []
    },
    async limparBolao(){
      this.bolao = {
        isBolao: false,
        participantes: []
      }
    },      
    clearAll (){
      this.limparBilhete();
      this.limparJogos();
      this.limparBolao();
    },
    async finalizarAposta(){
      if (!this.concurso || isNaN(this.concurso) || this.concurso < 1) {
        await this.$store.dispatch('app/setMessage', { type: 'info', message: `Informe um número de concurso válido!` }, { root: true });        
        return;
      }
      if (this.jogos.length === 0) {
        await this.$store.dispatch('app/setMessage', { type: 'info', message: `Informe ao menos 1 jogo para prosseguir!` }, { root: true });
        return;
      }
      const aposta = {
        modalidade: this.codigoModalidade,
        concurso: this.concurso,
        teimosinha: this.teimozinha,
        jogos: this.jogos.map (m=> ({ 
          dezenas: m.dezenas,
          cota: m.cota,
          cotas: m.cotas, 
          valorCusto: m.valorCusto
        })),
        bolao: []
      }
      this.$dialog.confirm('Finalizar Aposta?', { loader: true}).then(async (dialog) => {
        await app.post('api/aposta', aposta).then(async (response) => {
          if (response.status === 200 && response.data && response.data.success){
            this.$store.dispatch('app/setMessage',{ type: 'success', message: 'Aposta registrada com com sucesso!' }, { root: true });
            this.clearAll()
          } else {
            this.$store.dispatch('app/setMessage',{ type: 'error', message: response.data.data }, { root: true });
          }
          dialog.close();
        }).catch(error => {
          this.$store.dispatch('app/setMessage',{ type: 'error', message: error }, { root: true });
          dialog.close();
        });
      }).catch(() => {})
      
    }
  },
  computed: {
    user(){
      return this.$store.getters.getters['authentication/user']
    },
    isLoading: function () {
      return this.$store.getters['app/isLoading']
    },
    countSelecteds(){
      return this.volante && this.volante.length>0 ? (this.volante.filter(f => f.selected) || []).length : 0
    },
    volanteSelecionado(){
      return this.volante && this.volante.length > 0 ? (this.volante.filter(f => f.selected) || []) : 0
    },
    ofTeimozinha(){
      return this.modalidade && this.modalidade.teimozinha ? this.modalidade.teimozinha.map(e => ({code: e, desc: e===0 ? 'Nenhum' : `${e} Concursos`}) ): [{code: 0, desc: `Nenhum`}]
    },
    
  },
  async mounted(){

    await this.onChageModalidade()
  },
  async created() {
  },
  watch:{
    $route(current, old){
      if (current !== old){
        this.onChageModalidade()
      }
    }
  }
}
</script>
<style scoped>

.blockInline {  
  display: inline-block;
}

.concurso {
  display: inline-block;
  font-size: 16px;
  font-weight: bold;
  font-family: Roboto, Arial, Helvetica, sans-serif;
  padding: 0px 5px 8px 0px;
}
.ccValue {
  font-weight: bold;
  color: steelblue;
  font-size: 20px;

}

.tituloVolante {
  display: block;
  padding: 0px 10px;
  font-size: 35px;
  font-weight: bold;
  font-family: Roboto, Arial, Helvetica, sans-serif;
}

.containerDezenaSelecionada {
  display: inline-block;
  padding: 0;
}
.numberOfDezena {
  font-size: 18px;
  font-weight: bold;
  font-family: Roboto, Arial, Helvetica, sans-serif;
  
}

.dezena {
  display: inline-block;
  border-radius: 50%;
  width: 28px;
  height: 28px;
  padding: 2px 0px;
  font-size: 20px;
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
/*
.cards {
  display: inline-block;
  align-content: center;
  align-items: center;
  max-width: 100%;
  margin: 10px;
}
*/


@media only screen and (min-width: 500px) {
  .dezena {	
    width: 32px;
    height: 32px;
    padding: 3px;
    font-size: 20px;
    text-align: center;
    margin-right: 1px;
    margin-bottom: 1px;
	}
}
@media only screen and (min-width: 1300px) {
  .dezena {	
    width: 40px;
    height: 40px;
    padding: 6px;
    font-size: 24px;
    text-align: center;
    margin-right: 1px;
    margin-bottom: 1px;
	}

}

</style>
