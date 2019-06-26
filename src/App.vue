<template>
	<div id="app" class="d-flex flex-column h-100" > 
    <!-- Navbar -->
    <div class="container-fluid">
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <header v-if="isPromo" class="bg-white">
            <nav class="navbar navbar-expand-lg" >
              <a class="navbar-brand mr-auto" href="/">SMALL ARCHIVES</a>
              <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
                <span class="navbar-toggler-icon"><font-awesome-icon icon="bars" size="1x" /></span>
              </button>
              <div class="collapse navbar-collapse" id="navbarText">
                <div class="mr-auto"><a class="nav-link" href="/about">About</a></div>
                <ul class="navbar-nav">
                  <li class="nav-item">
                    <a class="nav-link btn btn-sm btn-primary" href="/login" v-if="!user">Sign in</a>
                  </li>                          
                </ul>
                <a class="nav-link btn btn-primary" href="/admin/archives" v-if="user">Dashboard</a>
              </div>
            </nav>      
          </header> 
        </div>
      </div>
    </div>
    <!-- Main content -->
    <div class="container-fluid wrapper flex-shrink-0 h-100" v-cloak>      
      <div class="row h-100" v-if="isAdmin || confirmOwner != false">
        <AdminSidebar v-bind:menuVisible="this.menuVisible" v-on:toggleMenu="toggleMenu" />
        <div class="main mx-3">  
          <div class="user-menu-button">
            <button class=" btn btn-primary mt-4 user-menu-button" @click="toggleMenu()">Menu</button>
          </div>            
          <router-view/>  
        </div>
      </div>
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
    logout: function() {
      firebase.auth().signOut().then(() => {
        this.setUser()
        this.$router.push({
          name: 'login'
        })        
      })
    },
    async getConfirmOwner() {
      this.confirmOwner = await sa.confirmOwner(this.$route.params.archive_id)
    },    
    toggleMenu: function() {
      this.menuVisible = !this.menuVisible
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
