<template>
  <v-app>
    <v-navigation-drawer v-if="!isAcessoOuErro"
      v-model="drawer" app >
      <v-list dense>
        <div v-for="(item, i) in menuItens" :key="i">
          <v-list-group
            v-if="(item.subItens && item.subItens.length > 0)"
            :value="activeMenu(item)"
            :key="`menu-${i}`"
            :prepend-icon="item.icon"
            no-action >
            <template v-slot:activator>
              <v-list-item-content>
                <v-list-item-title>{{ item.title }}</v-list-item-title>
              </v-list-item-content>
            </template>
            <v-list-item v-for="(subItem, y) in item.subItens" :key="`menu-${i}-subItem-${y}`" :to="{ path: subItem.link}" >
              <v-list-item-action>
                <v-icon v-if="subItem.icon" v-html="subItem.icon" v-bind:color="subItem.colorIcon"></v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title>{{ subItem.title }}</v-list-item-title>
              </v-list-item-content>
            </v-list-item>
          </v-list-group>          
          <v-list-item
            v-else
            :key="`menu-${i}`"
            :value="activeMenu(item)"
            :to="{path: item.link}" >
            <v-list-item-action>
              <v-icon v-if="item.icon" v-html="item.icon" color="subItem.colorIcon"></v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title v-text="item.title"></v-list-item-title>
            </v-list-item-content>
          </v-list-item>
        </div>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar v-if="!isAcessoOuErro" app dark >
        <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
        <v-toolbar-title>{{ appTitle }}</v-toolbar-title>
        <v-spacer></v-spacer>
        <v-toolbar-items>
          <v-btn text slot="activator" to="/acesso/entrar" v-if="!isLogado">
            Entrar
          </v-btn>
          <v-menu v-if="isLogado" offset-y >            
            <template v-slot:activator="{ on: menu }">
              <v-tooltip bottom>
                <template v-slot:activator="{ on: tooltip }">
                  <v-btn text  v-on="{ ...tooltip, ...menu }">
                        {{auth && auth.nome ? retornaPrimeiroNome(auth.nome) : auth.email }}
                  </v-btn>
                </template>
                <span>{{auth && auth.email ? auth.email : 'Usuário Logado' }}</span>
              </v-tooltip>
            </template>
            <v-list>
              <v-list-item @click.stop="senha">
                <v-list-item-avatar>
                  <v-icon >mdi-key-change</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>Alterar Senha</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click.stop="darkMode = !darkMode">
                <v-list-item-avatar>
                  <v-icon >mdi-theme-light-dark</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                  <v-list-item-title>{{ (darkMode ? 'Modo Claro' : 'Modo Escuro') }}</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
              <v-list-item @click.stop="logout">
                <v-list-item-avatar>
                  <v-icon >exit_to_app</v-icon>
                </v-list-item-avatar>
                <v-list-item-content>
                <v-list-item-title>Sair</v-list-item-title>
                </v-list-item-content>
              </v-list-item>
            </v-list>
          </v-menu>

        </v-toolbar-items>
    </v-app-bar>
    <v-content >
      <v-overlay :value="(isLoading || isProcessing)">
        <div class="divCenter" v-if="(isLoading || isProcessing)" >
          <v-progress-circular indeterminate :size="100" color="primary">{{getProcessingLabel}}</v-progress-circular>
        </div>
      </v-overlay>
      <router-view></router-view>
    </v-content>
    <v-footer :fixed="fixed" app v-if="!isAcessoOuErro">
      <span>&copy; 2018</span>
    </v-footer>
  </v-app>
</template>

<script>
  export default {
    name: 'LayoutApp',
    data () {
      return {
        drawer: false,
        fixed: false,
        menuProfile: true,
        miniVariant: false,
        right: true,
        rightDrawer: false,
        entidadeSelected: null,
        darkMode: this.$vuetify.theme.dark
      }
    },
    methods:{
      async logout (){
        this.$router.push({ path: '/acesso/logout' }).catch(() => { });
      },
      senha (){      
        this.$router.push({ path: '/acesso/senha' }).catch(() => { });
      },
      initAcessos: function(){
      },
      retornaPrimeiroNome(displayName){
        return displayName.substring(0, (displayName.indexOf(" ")>-1 ? displayName.indexOf(" ") : displayName.length ));
      },
      activeMenu: function(menu){
        if (!menu.subItens){
          return (menu.link && menu.link === this.$route.path)
        } else {
          return !!menu.subItens.find(f => f.link && f.link === this.$route.path)
        }
      },
    },
    computed: {
      appTitle (){
        return process.env.VUE_APP_TITLE
      },
      isLoading () {
        return this.$store.getters['app/isLoading']
      },
      isProcessing () {
        return this.$store.getters['app/isProcessing']
      },
      getProcessingLabel () {
        return this.$store.getters['app/getProcessingLabel']
      },
      isLogado:  function () {
        return (this.$store.getters['authentication/user'] !== null && this.$store.getters['authentication/user'] !== undefined);
      },
      isAutenticacao(){
        return this.$route.path.match('acesso')
      },
      isErro(){
        return this.$route.path.match('erro')
      },
      isAcessoOuErro(){
        return (this.$route.path.match('acesso') || this.$route.path.match('erro'))
      },
      auth: function(){
        return this.$store.getters['authentication/user'];
      },
      menuAccess : function(){
        const vm = this;
        return vm.$router.options.routes.filter(e => e.meta && !!e.meta.isMenu)
          .map(e => ({
            path: e.path,
            order: e.meta.order || 0,
            title: e.meta.title,
            icon:  e.meta.icon,
            colorIcon:  e.meta.colorIcon,
            isAdmin: !!e.meta.isAdmin,
            isPublic: !!e.meta.isPublic,
            groupOrder: e.meta.groupOrder || 0,
            groupTitle: e.meta.groupTitle,
            groupIcon:  e.meta.groupIcon,
            groupColorIcon:  e.meta.groupColorIcon,
          }))
          .filter(e => (e.isPublic || vm.auth))
          .filter(e => (!e.isAdmin || (vm.auth && vm.auth.admin)))
      },
      menuItens: function(){     
        if (this.menuAccess && this.menuAccess.length === 1){
          if (this.menuAccess[0].groupTitle){
                return [
                  {
                    order: this.menuAccess[0].groupOrder,
                    title: this.menuAccess[0].groupTitle,
                    icon: this.menuAccess[0].groupIcon,
                    colorIcon: this.menuAccess[0].groupColorIcon,
                    isAdmin: this.menuAccess[0].isAdmin,
                    isPublic: this.menuAccess[0].isPublic,
                    subItens: [{
                        order: this.menuAccess[0].order,
                        title: this.menuAccess[0].title,
                        icon: this.menuAccess[0].icon,
                        colorIcon: this.menuAccess[0].colorIcon,
                        link: this.menuAccess[0].path,
                        isAdmin: this.menuAccess[0].isAdmin,
                        isPublic: this.menuAccess[0].isPublic,                    
                      }
                    ]                   
                  }
                ]
              } else {
                return [
                  {
                    order: this.menuAccess[0].order,
                    title: this.menuAccess[0].title,
                    icon: this.menuAccess[0].icon,
                    colorIcon: this.menuAccess[0].colorIcon,
                    link: this.menuAccess[0].path,
                    isAdmin: this.menuAccess[0].isAdmin,
                    isPublic: this.menuAccess[0].isPublic,                    
                  }
                ]
              }
        } else if (this.menuAccess && this.menuAccess.length > 1){
          return this.menuAccess.reduce((accumulator, currentValue) => {
            if (!Array.isArray(accumulator)){
              if (accumulator.groupTitle){
                accumulator = [
                  {
                    order: accumulator.groupOrder,
                    title: accumulator.groupTitle,
                    icon: accumulator.groupIcon,
                    colorIcon: accumulator.groupColorIcon,
                    isAdmin: accumulator.isAdmin,
                    isPublic: accumulator.isPublic,
                    subItens: [{
                        order: accumulator.order,
                        title: accumulator.title,
                        icon: accumulator.icon,
                        colorIcon: accumulator.colorIcon,
                        link: accumulator.path,
                        isAdmin: accumulator.isAdmin,
                        isPublic: accumulator.isPublic,                    
                      }
                    ]                   
                  }
                ]
              } else {
                accumulator = [
                  {
                    order: accumulator.order,
                    title: accumulator.title,
                    icon: accumulator.icon,
                    colorIcon: accumulator.colorIcon,
                    link: accumulator.path,
                    isAdmin: accumulator.isAdmin,
                    isPublic: accumulator.isPublic,                    
                  }
                ]
              }
            }

            if (currentValue.groupTitle){
              const idxAcc = accumulator.map(a => a.title).indexOf(currentValue.groupTitle)
              if (idxAcc > -1){
                if (!(accumulator[idxAcc].isAdmin)){
                  accumulator[idxAcc].isAdmin = currentValue.isAdmin;
                }
                if (!(accumulator[idxAcc].isPublic)){
                  accumulator[idxAcc].isPublic = currentValue.isPublic;
                }
                accumulator[idxAcc].subItens.push({
                  order: currentValue.order,
                  title: currentValue.title,
                  icon: currentValue.icon,
                  colorIcon: currentValue.colorIcon,
                  link: currentValue.path,
                  isAdmin: currentValue.isAdmin,
                  isPublic: currentValue.isPublic,                    
                })
              } else {
                accumulator.push({
                    order: currentValue.groupOrder,
                    title: currentValue.groupTitle,
                    icon: currentValue.groupIcon,
                    colorIcon: currentValue.groupColorIcon,
                    isAdmin: currentValue.isAdmin,
                    isPublic: currentValue.isPublic,
                    subItens: [{
                        order: currentValue.order,
                        title: currentValue.title,
                        icon: currentValue.icon,
                        colorIcon: currentValue.colorIcon,
                        link: currentValue.path,
                        isAdmin: currentValue.isAdmin,
                        isPublic: currentValue.isPublic,                    
                      }
                    ]                   
                  })
              }
            } else {
              accumulator.push({
                order: currentValue.order,
                title: currentValue.title,
                icon: currentValue.icon,
                colorIcon: currentValue.colorIcon,
                link: currentValue.path,
                isAdmin: currentValue.isAdmin,
                isPublic: currentValue.isPublic,                    
              })
            }
            return accumulator
          })
        } else {
          return []
        }
      }
    },
    mounted(){
    },
    async created(){
      this.initAcessos();
    },
    watch:{
      darkMode(mode) {
        //theme.dark
        this.$vuetify.theme.dark = mode
        localStorage.setItem('appCurrentDarkMode', this.$vuetify.theme.dark)
      }
    }
  }
</script>

<style scoped>
.progressEntidade {
  top: 40%;
  left: 40%;
  position: absolute;
  text-align: center;
  margin: 2rem;
}

.divCenter{
    top: 50%;
    left: 50%;
    position: absolute;
    text-align: center;
}
.progress-circular{
  margin: 1rem
}
</style>
