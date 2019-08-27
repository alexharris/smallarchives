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
    setMenuExpanded(state, payload) {
      if (!payload) {
        state.menuExpanded = !state.menuExpanded;
      } else {
        console.log(payload)
        state.menuExpanded = payload;
      }
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
