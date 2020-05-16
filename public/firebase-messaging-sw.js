// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js');
// eslint-disable-next-line no-undef
importScripts('https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js');
//import firebase from 'firebase'
const config = {
    messagingSenderId: "404903209425"
};
// eslint-disable-next-line no-undef
const app = firebase.initializeApp(config);
const messaging = app.messaging();

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
    var notificationTitle = '!!!'+(payload.data.title ? payload.data.title : 'Nova Mensagem!!');
    var notificationOptions = {
      body: payload.data.body,
      icon: icon
    };
    if (payload.data.url){
      // notificationOptions.actions = [{action: "open_url", title: "Acessar"}]
      notificationOptions.data = {
        url: payload.data.url
      }

    } else if (payload.data.actions ){
      /** Ver a documentação baixo para implementar multiplas ações:
       *  https://web-push-book.gauntface.com/chapter-05/02-display-a-notification/
       * https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
       */
      //
    }

    self.registration.showNotification(notificationTitle, notificationOptions);

    
  }
}


self.addEventListener('notificationclick', function(event) {
  event.notification.close(); // Android needs explicit close.
  
  /**Para Implementação de multiplas ações:
   * https://stackoverflow.com/a/50853078
   * https://web-push-book.gauntface.com/chapter-05/02-display-a-notification/
   * 
   */

  // documentação: https://developer.mozilla.org/en-US/docs/Web/API/ServiceWorkerGlobalScope/notificationclick_event
  if (event.notification && event.notification.data && event.notification.data.url) {
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