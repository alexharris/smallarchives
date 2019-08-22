<template>
    <div class="user-menu bg-primary px-3" v-bind:class="{ menuVisible: showMenu, menuExpanded: menuExpanded }">
        <div class="row">
          <div class="col-12">
              <button class=" btn btn-primary btn-sm mt-4 float-right user-menu-button" @click="$emit('toggleMenu')"><font-awesome-icon icon="times" size="2x" /></button>
          </div>
          <div class="col-12">
            <!-- EXPANDED MENU -->
            <ul class="list-group list-group-flush position-fixed bg-transparent" v-if="!menuExpanded">
            <li class="list-group-item bg-transparent list-group-item-action border-0">
              <span @click="toggleMenuExpand" class="menu-expand-button"><font-awesome-icon icon="long-arrow-alt-left" size="2x" /></span>
            </li>
            <li class="list-group-item bg-transparent list-group-item-action border-0">
              <a href="/admin/" class="p-2"><font-awesome-icon class="mr-3" icon="tachometer-alt" size="1x" />Dashboard</a>
            </li>
            <li class="list-group-item bg-transparent list-group-item-action border-0">
              <a href="/admin/account" class="p-2"><font-awesome-icon class="mr-3" icon="user-circle" size="1x" />Account</a>
            </li>
            <li class="list-group-item bg-transparent list-group-item-action border-0">
              <a href="" @click="logout()" class="p-2"><font-awesome-icon class="mr-3" icon="sign-out-alt" size="1x" />Logout</a>
            </li>
            <li class="list-group-item bg-transparent list-group-item-action border-0">
              <a href="/" class="p-2"><font-awesome-icon class="mr-3" icon="home" size="1x" />Home</a>
            </li>
            </ul>
            <!-- NOT EXPANDED MENU -->
            <ul class="list-group list-group-flush position-fixed bg-transparent" v-else>
              <li class="list-group-item bg-transparent list-group-item-action border-0">
                <span class="menu-expand-button" @click="toggleMenuExpand"><font-awesome-icon icon="long-arrow-alt-right" size="2x" /></span>
              </li>
              <li class="list-group-item bg-transparent list-group-item-action border-0">
                <a href="/admin/" class="p-2"><font-awesome-icon icon="tachometer-alt" size="1x" /></a>
              </li>
              <li class="list-group-item bg-transparent list-group-item-action border-0">
                <a href="/admin/account" class="p-2"><font-awesome-icon icon="user-circle" size="1x" /></a>
              </li>
              <li class="list-group-item bg-transparent list-group-item-action border-0">
                <a href="" @click="logout()" class="p-2"><font-awesome-icon icon="sign-out-alt" size="1x" /></a>
              </li>
              <li class="list-group-item bg-transparent list-group-item-action border-0">
                <a href="/" class="p-2"><font-awesome-icon icon="home" size="1x" /></a>
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
      this.$store.dispatch('setMenuExpanded');      
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
  .user-menu {
      width: 300px;
      transition: width .1s ease-in-out;
      &.menuExpanded {
        transition: width .1s ease-in-out;
        width: 100px;
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
    }
  }  
</style>
