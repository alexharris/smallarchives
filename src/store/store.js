import Vue from 'vue';
import Vuex from 'vuex';
import firebase from 'firebase';

Vue.use(Vuex);

export const store = new Vuex.Store({
  state: {
    user: null,
    assetCount: null 
  },
  getters: {
    getUser: state => {
      return state.user;
    }, 
    getAssetCount: state => {
      return state.assetCount;
    }  
  },
  mutations: {
    setUser: state => {
      state.user = firebase.auth().currentUser;
    },
    setAssetCount: (state, payload) => {
      console.log(payload)
      state.assetCount = payload
    }       
  },
  actions: {
    setUser: context => {
      context.commit('setUser');
    }
  }
});