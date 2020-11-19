<template>
    <v-app>
      <div v-if="isLoaderStart" >
        <div class="loader">
          <div class="line one"></div>
          <div class="line two"></div>
          <div class="line three"></div>
          <div class="line four"></div>
          <div class="line five"></div>
        </div>
      </div>
      <layoutApp v-else ></layoutApp>
      <mensagemApp/>
    </v-app>
</template>


<script>
import firebase from 'firebase/app'
import 'firebase/messaging'
import mensagemApp from '@/components/default/Mensagem'
import layoutApp from '@/pages/layout/LayoutApp'
export default {
  name: 'App',
  components: {
    mensagemApp,
    layoutApp    
  },
  created() {
    this.onReceiverNotification();
  },
  methods:{
    onReceiverNotification: function(){      
      firebase.messaging().onMessage(function(payload) {
        // eslint-disable-next-line no-console
        console.log('messaging().onMessage: ', payload);
        /** payload:
         * notification: {
         *   title: 'New message',
         *   boby: 'Text message',
         *   icon: 'info.png',
         *   url: 'http://yourapp.com/', // URL action when clicking on the message
         *   actions: [
         *    {
         *      action: 'view-profile',
         *      urlAction: 'http://yourapp.com/profile',
         *      title: 'View your profile',
         *      icon: 'action-view-profile-128x128.png'
         *    },
         *  ]
         * }
         */

        var message = payload.notification.body;
        var options = { 
          type: 'primary',
          theme: 'bubble',
          position: 'bottom-right',
          duration: 10000,
          action : {
            text : 'X',
            onClick : (e, toastObject) => {
              toastObject.goAway(0);
            }
          }
        }
        this.$toasted.info(message, options);
      });
    }
  },
  computed: {
    isLoaderStart(){
      return this.$store.getters['app/isStartingApp'];
    }
  }
}
</script>
<style >
body {
  background: white;
}


.loader {
  width: 50px;
  height: 30px;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.loader:after {
  position: absolute;
  content: "loading";
  bottom: -40px;
  left: -2px;
  text-transform: uppercase;
  font-family: "Arial";
  font-weight: bold;
  font-size: 12px;
}

.loader > .line {
  background-color: #333;
  width: 6px;
  height: 100%;
  text-align: center;
  display: inline-block;

  animation: stretch 1.2s infinite ease-in-out;
}

.line.one {
  background-color: #99DBB4;
}

.line.two {
  animation-delay:  -1.1s;
  background-color:#3498db;
}
.line.three {
  animation-delay:  -1.0s;
  background-color:#9b59b6;
}
.line.four {
  animation-delay:  -0.9s;
   background-color: #e67e22;
}
.line.five {
  animation-delay:  -0.8s;
  background-color: #e74c3c;
}

@keyframes stretch {
  0%, 40%, 100% { transform: scaleY(0.4); }
  20% {transform: scaleY(1.0);}
}
</style>
