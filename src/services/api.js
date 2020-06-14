import axios from 'axios';
import firebase from 'firebase/app'
import 'firebase/auth'
const statusAccept = [400, 401, 403]
// console.log('API-Config: ', global.App, (sessionStorage.getItem('utoken') || localStorage.getItem('utoken')) )
const instance =  axios.create({ baseURL: (process.env.VUE_APP_ROOT_API ? process.env.VUE_APP_ROOT_API :  '/') })

// Add a request interceptor
instance.interceptors.request.use(async function (config) {
  // console.log('axios.instance.interceptors.request: ', config)
  // config.headers['authtoken'] = (sessionStorage.getItem('utoken') || localStorage.getItem('utoken'))
  // console.log('interceptors.request-currentUser: ', firebase.auth().currentUser)
  const token = await (firebase.auth().currentUser ? firebase.auth().currentUser.getIdToken(true): null);

  // console.log('interceptors.request-token: ', token)
  config.headers['authtoken'] = token;
  // console.log('axios.instance.interceptors.request2: ', config)
  // Do something before request is sent
  return config;
}, function (error) {
  // Do something with request error
  return Promise.reject(error);
});

// Add a response interceptor
instance.interceptors.response.use(function (response) {
  //console.log('instance.interceptors.response.use - response: ',response)
  // Do something with response data
  //console.log('axios.instance.interceptors.response: ', response)
  return response;
}, function (error) {
  // Do something with response error
  // console.log('instance.interceptors.response.use - error.response: ',error.response)
  // console.log('instance.interceptors.response.use - error: ',error)
  if (statusAccept.indexOf( error.response.status ) > -1 ) {
    return error.response
  }else {
    return Promise.reject(error);
  }
});
export default instance
