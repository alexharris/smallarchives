import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    itemCount: null 
  },
  getters: {
    getUser: state => {
      return state.user;
    }, 
    getItemCount: state => {
      return state.itemCount;
    }  
  },
  mutations: {
    setUser: state => {
      state.user = firebase.auth().currentUser;
    },
    setItemCount: (state, payload) => {
      state.itemCount = payload
    }       
  },
  actions: {
    setUser: context => {
      context.commit('setUser');
    }
  }
});