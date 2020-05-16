/* eslint-disable no-console */

import app  from "@/services/app";

class ServerLogger {
  constructor(logServer, time) {
    this.postLogServer = !!logServer;
    this.timeSendToServer = time || 30000; // 30 seconds default
    this.arrayLogger = [];
    if (this.postLogServer){
      setInterval(async () => {
        if (this.arrayLogger && this.arrayLogger.length > 0 ){
          // sento to server 
          if (app.post) {
            try {             
              await app.post(`/api/logclientprovider/logger`, this.arrayLogger); 
            } catch (e) {
              null;
            }
          }
          this.arrayLogger = []; // finaly clear arraylogs
        }
        
      }, this.timeSendToServer);
    }
  }

  addLogger(type, log){
    this.arrayLogger.push({type, log});
  }

  getLogger(){    
    return this.arrayLogger;
  }
  clearLogger(){
    this.arrayLogger = [];
  }
}

if (window && !window['logger']){
  window.logger = new ServerLogger('logServer', 10000);
}