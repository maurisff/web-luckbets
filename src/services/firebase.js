import app from '@/services/app'
import firebase from 'firebase/app';
//import firebase from 'firebase';
import 'firebase/auth';
import 'firebase/messaging';
import firebaseConfig from '@/config/firabaseConfig';

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
/*var vm = this;
async () => {
  const registration = await navigator.serviceWorker.register(`firebase-messaging-sw.js?messagingSenderId=${firebaseConfig.messagingSenderId}`)
  vm.messaging.useServiceWorker(registration);
}
*/
 if (process.env.NODE_ENV === 'production') {
  
  const messaging = firebase.messaging();  
  Notification.requestPermission().then(async function (permission) {
    if (permission === "granted") {  
      messaging.onTokenRefresh(async ()=>{
        try {  
          if (auth.currentUser){    
            const refreshedToken = await messaging.getToken();
            await app.post(`/api/messagingtoken`, {token : refreshedToken});
          }
        } catch (error) {null}    
      }); 
    }
  });

  messaging.onMessage(payload => {
    console.log('firebase.messaging().onMessage: ', payload);
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


} // if (process.env.NODE_ENV === 'production') {


export default firebase;