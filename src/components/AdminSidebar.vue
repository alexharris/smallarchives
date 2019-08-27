<template>
    <div class="user-menu bg-primary" v-bind:class="{ menuVisible: showMenu, menuExpanded: !menuExpanded }">
        <div class="row">
          <div class="col-12">
              <button class=" btn btn-primary btn-sm m-4 float-right user-menu-button" @click="$emit('toggleMenu')"><font-awesome-icon icon="times" size="2x" /></button>
          </div>
          <div class="col-12">
            <!-- EXPANDED MENU -->
            <transition name="fade" v-if="menuExpanded">
              <ul class="list-group list-group-flush position-fixed bg-transparent">
                <li class="list-group-item bg-transparent list-group-item-action border-0">
                  <span @click="toggleMenuExpand" class="menu-expand-button p-md-2"><font-awesome-icon icon="long-arrow-alt-left" size="2x" /></span>
                </li>
                <li class="list-group-item bg-transparent list-group-item-action border-0">
                  <a href="/admin/" class="p-2"><font-awesome-icon class="mr-3" icon="tachometer-alt" size="1x" />Dashboard</a>
                </li>
                <li class="list-group-item bg-transparent list-group-item-action border-0">
                  <a href="/admin/account" class="p-2"><font-awesome-icon class="mr-3" icon="user-circle" size="1x" />Account</a>
                </li>
                <li class="list-group-item bg-transparent list-group-item-action border-0">
                  <a href="/" class="p-2"><font-awesome-icon class="mr-3" icon="home" size="1x" />Home</a>
                </li>
                <li class="list-group-item bg-transparent list-group-item-action border-0 fixed-bottom">
                  <a href="" @click="logout()" class="p-2"><font-awesome-icon class="mr-3" icon="sign-out-alt" size="1x" />Logout</a>
                </li>            
              </ul>
            </transition>
            <!-- NOT EXPANDED MENU -->
            <ul class="list-group list-group-flush position-fixed bg-transparent" v-else>
              <li class="list-group-item bg-transparent list-group-item-action border-0 text-center">
                <span class="menu-expand-button" @click="toggleMenuExpand"><font-awesome-icon icon="long-arrow-alt-right" size="2x" /></span>
              </li>
              <li class="list-group-item bg-transparent list-group-item-action border-0">
                <a href="/admin/" class="p-2"><font-awesome-icon icon="tachometer-alt" size="1x" /></a>
              </li>
              <li class="list-group-item bg-transparent list-group-item-action border-0">
                <a href="/admin/account" class="p-2"><font-awesome-icon icon="user-circle" size="1x" /></a>
              </li>

              <li class="list-group-item bg-transparent list-group-item-action border-0">
                <a href="/" class="p-2"><font-awesome-icon icon="home" size="1x" /></a>
              </li>
              <li class="list-group-item bg-transparent list-group-item-action border-0 fixed-bottom">
                <a href="" @click="logout()" class="p-2"><font-awesome-icon icon="sign-out-alt" size="1x" /></a>
              </li>              
            </ul>            
          </div>
        </div>
    </div>
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'

export default {
  name: 'AdminSidebar',
  props: ['menuVisible'],
  data () {
    return {
      showMenu: this.menuVisible
    }
  },
  created() {
    
  },
  watch: {
    menuVisible: function(newVal, oldVal) { // watch it
        this.showMenu = newVal
    }
  },
  computed: {
    menuExpanded: function() {
      return this.$store.getters.getMenuExpanded
    }
  },
  methods: {
    toggleMenuExpand: function() {
      this.$store.commit('setMenuExpanded');      
    },
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.setUser()
        this.$router.push({
          name: 'login'
        })        
      })
    },
  }
}
</script>



<style lang="scss" scoped>

.fade-enter-active, .fade-leave-active {
  transition: opacity .05s;
}

.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}

  .user-menu {
      width: 250px;
      transition: width .2s ease-in-out;
      &.menuExpanded {
        transition: width .2s ease-in-out;
        width: 80px;
      }
  }

  .menu-expand-button {
    cursor: pointer;
  }

  @media (max-width: 768px) {
    .user-menu {
        width: 100%;
        &.menuExpanded {
          width: 100%;
        }
        .menu-expand-button {
          display: none;
        }
    }
  }  
</style>
