<template>
	<div id="app" class="d-flex flex-column h-100" > 
      <header v-if="!isArchive">
        <nav class="navbar navbar-expand-lg " >
          <a class="navbar-brand" href="/">SMALL ARCHIVES</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"><font-awesome-icon icon="bars" size="1x" /></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto">
              <li class="nav-item" v-if="user">
                <a class="nav-link"  href="/admin/archives">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/about">About</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="/login" v-if="!user">Login</a>
              </li>                
              <li class="nav-item" v-if="user"><a class="nav-link" href="" @click="logout()">Logout</a></li>            
            </ul>
          </div>
        </nav>      
      </header> 	
  		<div class="container-fluid wrapper flex-shrink-0" v-cloak> 
  			<router-view/>       
  		</div>  
 <!-- <footer class="footer py-3">
        <div class="container-fluid">

            <a href="/Contact">Contact</a>.
        </div>
      </footer>          -->

  </div>
</template>

<script>
import firebase from 'firebase' 
import { truncate } from 'fs';

export default {
  name: "App",
  computed: {
    user() {
    	return this.$store.getters.getUser;
    },
    displayName: function() {
		  return this.$store.getters.getUser.email;
    },
    isArchive: function() {
      if(this.$route.name == 'PublicArchive') {
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
  },
  created() {
    // when the app is created run the set user method
    // this uses Vuex to check if a user is signed in
    // check out mutations in the store.js file
    this.setUser();
  }
}
</script>


<style lang="scss">




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
