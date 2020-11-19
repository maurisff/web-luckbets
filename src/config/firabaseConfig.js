/* eslint-disable no-console */
let config = {}
try {
  if (process.env.VUE_APP_FIREBASE_JSON_CONFIG){
    config = JSON.parse(process.env.VUE_APP_FIREBASE_JSON_CONFIG);
  } else {
    console.error('env.VUE_APP_FIREBASE_JSON_CONFIG - The Firebase configuration is not defined in the startup variables')
  }
} catch (error) {
  console.error('env.VUE_APP_FIREBASE_JSON_CONFIG - The Firebase configuration are not in a valid JSON object format')
  config = {}
}
module.exports = config;
