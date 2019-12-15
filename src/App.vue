<template>
	<div id="app"> 
    <!-- Navbar -->
    <div class="">
      <div class="row justify-content-center shadow-lg bg-white">
        <div class="container mx-auto">
          <header v-if="isPromo" class="flex flex-col md:flex-row justify-between items-start md:items-center p-4">
            <div class="flex flex-row justify-between w-full">
              <a href="/" class="navbar-brand text-xl">SMALL ARCHIVES</a>
              <button type="button" class="md:hidden" @click="menuVisible = !menuVisible">
                <span><font-awesome-icon icon="bars" size="1x" /></span>
              </button>             
            </div>
            <nav  :class="{hidden: menuVisible}" class="flex flex-col w-full md:flex-row md:justify-end md:items-center">

              <a class="nav-link md:pr-4" href="/about">About</a>
              <a class="btn-dark" href="/login" v-if="!user"><font-awesome-icon class="mr-2" icon="user-circle" size="1x" />Sign in</a>
              <a class="btn-dark" href="/admin/" v-if="user"><font-awesome-icon icon="cog" size="1x" /> Dashboard</a>
            </nav>      
          </header> 
        </div>
      </div>
    </div>
    <!-- Main content -->
    <div class="" v-bind:class="{'mt-5': isPromo, 'pt-5': isPromo}" v-cloak> 
      <!-- If this is person is logged in and owns this archive -->
      <div  class="md:flex flex-row" v-if="isAdmin || confirmOwner != false">
        <AdminSidebar v-bind:menuVisible="this.menuVisible" v-on:toggleMenu="toggleMenu" />
        <div class="">
          <div class="col-12 p-0 fixed-bottom">
            <div class="navbar navbar-light bg-light p-0" >
              <button class=" btn-dark md:hidden m-2" @click="toggleMenu()"><font-awesome-icon icon="cog" size="1x" /> Admin</button>
            </div>  
          </div>     
          <div class="mx-3">   
            <router-view/>  
          </div>
        </div>
      </div>
      <!-- This is if the person is not logged in -->
      <div class="row" v-else>
        <div class="col-12">  
          <router-view/>  
        </div>
      </div>  
    </div>      
  </div>
</template>

<script>
import firebase from 'firebase/app' 
import { truncate } from 'fs';
import sa from './sa'
import AdminSidebar from './components/AdminSidebar'

export default {
  name: "App",
  data() {
    return {
      confirmOwner: false,
      menuVisible: false
    }
  },
  components: {
    AdminSidebar
  },
  computed: {
    user() {
    	return this.$store.getters.getUser;
    },
    displayName: function() {
		  return this.$store.getters.getUser.email;
    },
    isPublic: function() {
      if(this.$route.name.includes('Public')) {
        return true;
      } else {
        return false;
      }
    },
    isAdmin: function() {
      if(this.$route.name.includes('Admin')) {
        return true;
      } else {
        return false;
      }
    },
    isPromo: function() {
      if(this.$route.name.includes('Promo')) {
        return true;
      } else {
        return false;
      }
    }           
  }, 
  methods: {
   setUser: function() {
      this.$store.dispatch('setUser');
    },
    goToLogin: function() {
      this.$router.push({
        name: 'login'
      })      
    },
    async getConfirmOwner() {
      this.confirmOwner = await sa.confirmOwner(this.$route.params.archive_id)
    },    
    toggleMenu: function() {
      this.menuVisible = !this.menuVisible
      this.$store.commit('setMenuExpanded', true);
    }  
  },
  created() {
    // when the app is created run the set user method
    // this uses Vuex to check if a user is signed in
    // check out mutations in the store.js file
    this.setUser();
    this.getConfirmOwner();
  },
  watch:{
    //check if the route changes to re-confirm owner
    $route (){
        this.getConfirmOwner()
    }
  } 

 
}
</script>


<style lang="scss">

.main {
  flex: 1;
}


  // a svg:hover {
  //   color: #474747;
  // }

  // .card {
  //   border: 1px solid $blue;
  //   background-color: transparent;
  //   & .card-header {
  //     background-color: $pink;
  //     border-bottom: 1px solid $blue;
  //     font-weight: 800;
  //   }
  //   & .card-footer {
  //     background-color: $pink;
  //     border-top: 1px solid $blue;
  //   }
  // }  

  // .card.border-danger {
  //   border: 1px solid $red;
  //   background-color: transparent;
  //   color: $red;
  //   & .card-header {
  //     background-color: transparent;
  //     border-bottom: 1px solid $red;
  //           font-weight: 800;
  //   }
  //   & .card-footer {
  //     background-color: $red;
  //     border-top: 1px solid $red;
  //   }
  // }  

  // .btn:hover {
  //   cursor: pointer;
  // }

  // .btn.btn-outline-danger {
  //     &:hover {
  //         color: white !important;
  //         border: 2px solid $red;
  //     }
  // }  

  // .btn-dark {
  //     background-color: $blue;
  //     color: $pink;
  //     border: 1px solid $blue;
  //     font-family: 'inter';
  //     &:hover {
  //         color: $blue;
  //         background-color: $pink;
  //         border: 1px solid $blue;
  //     }
  // }

  // .btn-outline-dark {
  //   color: $blue;
  //   border: 1px solid $blue;
  //   &:not(:disabled):not(.disabled).active {
  //     background-color: $blue;
  //     color: $pink;
  //   }
  //   &:hover {
  //       color: $pink;
  //       background-color: $blue;
  //       border: 1px solid $blue;
  //   }
  // }  

  // .btn-light {
  //     background-color: $pink;
  //     color: $blue;
  //     border: 1px solid $pink;
  //     font-family: 'inter';
  //     &:hover {
  //         color: $pink;
  //         background-color: $blue;
  //     }        
  // }   

  // .table {
  //   color: $blue;
  //   & thead th {
  //     border-bottom: 1px solid $blue;
  //     border-top: 1px solid $blue;
  //   }
  // }
 
 // header .nav-tabs {
 //    border-bottom: 1px solid $blue;
 //    .nav-link.active {
 //      color: $blue;
 //      border: 1px solid $blue;
 //      border-bottom: 0px;
 //      background-color: transparent;
 //    }
 //  }

  // footer {
  //   border-top: 1px solid #000;
  // }
</style>
