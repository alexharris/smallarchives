import Vue from "vue";
import Vuex from "vuex";
import firebase from "firebase/app";

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    menuExpanded: true
  },
  getters: {
    getUser: state => {
      return state.user;
    },
    getMenuExpanded: state => {
      return state.menuExpanded;
    }
  },
  mutations: {
    setUser: state => {
      state.user = firebase.auth().currentUser;
    },
    setMenuExpanded: state => {
      console.log(state.menuExpanded);
      state.menuExpanded = !state.menuExpanded;
    }
  },
  actions: {
    setUser: context => {
      context.commit("setUser");
    },
    setMenuExpanded: context => {
      context.commit("setMenuExpanded");
    }
  }
});
