/* eslint-disable no-console */
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
// eslint-disable-next-line no-undef
importScripts('https://cdnjs.cloudflare.com/ajax/libs/axios/0.19.2/axios.min.js');
/*
const requestFetch = async (url, method, data = {}, headers = {}) => {  
  var myHeaders = new Headers(headers);

  var options = { 
    method: method,
    headers: myHeaders
  };
  if  (options.method === 'POST' ||  options.method ===  'PUT') {
    options.body = JSON.stringify(data);
  }

  fetch(url, options).then(function(response) {
    return response.blob();
  }).then(function(myBlob) {
    var data = URL.createObjectURL(myBlob);
    myImage.src = data;
  });
}
const requestHTTP = async (url, method, data, headers) => {  
  var myHeaders = new Headers();

  var options = { method: method,
                headers: myHeaders,
                mode: 'cors',
                cache: 'default' };

  fetch(url,options).then(function(response) {
    return response.blob();
  }).then(function(myBlob) {
    var objectURL = URL.createObjectURL(myBlob);
    myImage.src = objectURL;
  });
}

const api = {
  get: async (url, query = {}, options = {}) =>{
    if(self.fetch) {
        // execute minha solicitação do fetch aqui
    } else {
        // faça alguma coisa com XMLHttpRequest?
    }
  },
  post: async (url, data, options = {}) =>{

  },
  put: async (url, data, options = {}) =>{

  },
  delete: async (url, options = {}) =>{

  },
}

*/

//import firebase from 'firebase'
const config = {
    messagingSenderId: "404903209425"
};
// eslint-disable-next-line no-undef
const app = firebase.initializeApp(config);
const messaging = app.messaging();
// const axios = self.axios;

const handlerNotification = async function (payload) {  
  // console.log('[firebase-messaging-sw.js] Received background message ', payload, JSON.stringify(payload));
  const contextImages = '/img/icons/';
  const defaultIcon = 'favicon-32x32.png'
  /** 
   * notification: {
   *   title: 'New message',
   *   boby: 'Text message',
   *   icon: 'info.png',
   *   url: 'http://yourapp.com/', // URL action when clicking on the message
   *   actions: [
   *    {
          action: 'view-profile',
          urlAction: 'http://yourapp.com/profile',
          title: 'View your profile',
          icon: 'action-view-profile-128x128.png'
        },
   *   ]
   * }
   */
  // Customize notification here
  if (payload.data){
    var icon = payload.data.icon ? `${contextImages}${payload.data.icon}` : `${contextImages}${defaultIcon}`;
    var notificationTitle = (payload.data.title ? payload.data.title : 'Nova Mensagem!');
    var notificationOptions = {
      body: payload.data.body,
      icon: icon,
      badge: icon
    };
    notificationOptions.data = {}
    notificationOptions.data.action = {}
    if (payload.data.url){
      notificationOptions.data.url = payload.data.url
    } 
    
    if (payload.data.actions ){
      const actions = JSON.parse(payload.data.actions)
      actions.forEach(el => {
        if (el.actionURL){
          notificationOptions.data.action[el.action] = el.actionURL
        }        
      });
      notificationOptions.actions = actions

      /** Ver a documentação baixo para implementar multiplas ações:
       *  https://web-push-book.gauntface.com/chapter-05/02-display-a-notification/
       * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
       */
      //
    }

    console.log('new message: ', notificationOptions)

    self.registration.showNotification(notificationTitle, notificationOptions);

    
  }
}

self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Android needs explicit close.
  
  console.log('notificationClick event: ', event);
  /**Para Implementação de multiplas ações:
   * https://stackoverflow.com/a/50853078
   * https://web-push-book.gauntface.com/chapter-05/02-display-a-notification/
   * 
   */
  if (event.action){
    switch (event.action) {
      case 'IGNORAR_SORTEIO':
        if (event.notification.data.action[event.action]){
          console.log('Action - url - parameter',event.action , event.notification.data.action[event.action])
        }        
        console.log('IGNORAR_SORTEIO');
        break;
      case 'APOSTAR':
        console.log('APOSTAR');
        break;
      default:
        console.log(`Unknown action clicked: '${event.action}'`);
        break;
    }

  }

  // documentação: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
  if (!event.action && event.notification && event.notification.data && event.notification.data.url ) {
    event.waitUntil(
      self.clients.matchAll({type: 'window'}).then( function(windowClients) {
            // Check if there is already a window/tab open with the target URL
            for (var i = 0; i < windowClients.length; i++) {
                var client = windowClients[i];
                // If so, just focus it.
                if (client.url === event.notification.data.url && 'focus' in client) {
                    return client.focus();
                }
            }
            // If not, then open the target URL in a new window/tab.
            if (self.clients.openWindow) {
                return self.clients.openWindow(event.notification.data.url); 
            }
        })
    );
    }
});

messaging.setBackgroundMessageHandler(async function(payload) {
  // console.log('[firebase-messaging-sw.js] Received background message ', payload, JSON.stringify(payload));
  await handlerNotification(payload);
});