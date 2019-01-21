import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null 
  },
  getters: {
    getUser: state => {
      return state.user;
    }  
  },
  mutations: {
    setUser: state => {
      state.user = firebase.auth().currentUser;
    }  
  },
  actions: {
    setUser: context => {
      context.commit('setUser');
    }
  }
});