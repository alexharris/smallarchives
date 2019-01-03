import firebase from 'firebase';
import Vue from "vue";

import App from "./App.vue";
import router from "./router";

import "./registerServiceWorker";

Vue.config.productionTip = false;

let app = '';

const config = {
    apiKey: "xxx",
    authDomain: "xxx",
    databaseURL: "xxx",
    projectId: "xxx",
    storageBucket: "xxx",
    messagingSenderId: "xxx"
};

firebase.initializeApp(config);


firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router,
      render: h => h(App)
    }).$mount('#app');
  }
});
