import firebase from "firebase/app";
import "firebase/database"; // If using Firebase database
import "firebase/storage"; // If using Firebase storage
import "firebase/auth"; // If using Firebase auth

import Vue from "vue";
import { store } from "./store/store";

import App from "./App.vue";
import router from "./router";

import "./registerServiceWorker";
// ----------------
// Font awesome
import { library } from "@fortawesome/fontawesome-svg-core";
import {
  faFile,
  faTimes,
  faQuestionCircle,
  faTh,
  faThList,
  faFolder,
  faFilter,
  faMapMarkerAlt,
  faUniversity,
  faFileImage,
  faArchive,
  faBars,
  faPlus,
  faSort,
  faEllipsisV,
  faTachometerAlt,
  faUserCircle,
  faSignOutAlt,
  faHome,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faCog
} from "@fortawesome/free-solid-svg-icons";
// import { faFile } from "@fortawesome/free-regular-svg-icons";
import { faTwitter } from "@fortawesome/free-brands-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";
library.add(
  faFile,
  faTimes,
  faQuestionCircle,
  faTh,
  faThList,
  faFilter,
  faMapMarkerAlt,
  faTwitter,
  faUniversity,
  faFileImage,
  faArchive,
  faFolder,
  faBars,
  faPlus,
  faSort,
  faEllipsisV,
  faTachometerAlt,
  faUserCircle,
  faSignOutAlt,
  faHome,
  faLongArrowAltLeft,
  faLongArrowAltRight,
  faCog
);
Vue.component("font-awesome-icon", FontAwesomeIcon);
// ----------------
// Vue leaftlet
import { L } from "vue2-leaflet";
import "leaflet/dist/leaflet.css";
// ----------------
// this part resolve an issue where the markers would not appear
delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});
// End vue leaftlet

// Vue papaparse
import VuePapaParse from "vue-papa-parse";
Vue.use(VuePapaParse);

// End papaparse

// Vue.config.productionTip = false;

firebase.database.enableLogging(true);

let app = "";


// console.log(process.env)

const firebaseConfig = {
  apiKey: process.env.VUE_APP_API_KEY,
  authDomain: process.env.VUE_APP_AUTH_DOMAIN,
  databaseURL: process.env.VUE_APP_DATABASE_URL,
  projectId: process.env.VUE_APP_PROJECT_ID,
  storageBucket: process.env.VUE_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.VUE_APP_MESSAGING_SENDER_ID
};


// uncomment whichever you want to use

// console.log("***************************************************");
// console.log("****************** PRODUCTION DB *******************");
// console.log("***** Make sure to use `firebase use default` *****");
// console.log("***************************************************");



// console.log("***********************************************");
// console.log("**************** DEVELOPMENT DB ****************");
// console.log("***** Make sure to use `firebase use dev` *****");
// console.log("***********************************************");


firebase.initializeApp(firebaseConfig);


var storage = firebase.storage();

firebase.auth().onAuthStateChanged(() => {
  if (!app) {
    /* eslint-disable no-new */
    app = new Vue({
      router: router,
      store: store,
      render: h => h(App)
    }).$mount("#app");
  }
});

import "./assets/styles/styles.scss";
import "bootstrap";
