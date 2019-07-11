<template>
    <div class="user-menu bg-primary px-3" v-bind:class="{ menuVisible: showMenu }">
        <div class="row">
        <div class="col-12">
            <button class=" btn btn-primary btn-sm mt-4 float-right user-menu-button" @click="$emit('toggleMenu')"><font-awesome-icon icon="times" size="2x" /></button>
        </div>
        <div class="col-12">
            <ul class="list-group list-group-flush position-fixed bg-transparent">
            <li class="list-group-item bg-transparent list-group-item-action"><a href="/admin/archives" class="p-2">Dashboard</a></li>
            <li class="list-group-item bg-transparent list-group-item-action"><a href="/admin/account" class="p-2">Account</a></li>
            <li class="list-group-item bg-transparent list-group-item-action"><a href="" @click="logout()" class="p-2">Logout</a></li>
            <li class="list-group-item bg-transparent list-group-item-action"><a href="/" class="p-2">Home</a></li>
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
    },
  },
  methods: {
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



<style scoped>
    .user-menu {
        width: 300px;
    }

    @media (max-width: 768px) {
        .user-menu {
            width: 100%;
        }
    }
</style>
