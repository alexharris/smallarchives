<template>
	<div id="app"> 
    <div>
  	  <b-navbar variant="faded" type="light" toggleable="sm" class="mb-5" v-if="user">
        <b-navbar-toggle target="nav_collapse" right></b-navbar-toggle>
      	<b-navbar-brand href="/">SMALL ARCHIVES</b-navbar-brand>
      	<b-collapse is-nav id="nav_collapse">
        	<b-navbar-nav class="ml-auto">
         		<b-nav-item-dropdown right v-if="user">
            		<!-- Using button-content slot -->
            		<template slot="button-content">
              			{{displayName}}
            		</template>
            		<b-dropdown-item href="/admin/archives">Dashboard</b-dropdown-item>
            		<b-dropdown-item href="/admin/profile">Profile</b-dropdown-item>
            		<b-dropdown-item @click="this.logout">Logout</b-dropdown-item>
          		</b-nav-item-dropdown>
              <b-nav-item right v-else>
                <b-link @click.stop="goToLogin">Login</b-link>
              </b-nav-item>              
        	</b-navbar-nav>     
        </b-collapse> 
      </b-navbar>  	
  		<b-container class="wrapper" v-cloak> 		
  			<router-view/>
  		</b-container>   
  	</div>
  </div>
</template>

<script>
import firebase from 'firebase' 

export default {
  name: "App",
  computed: {
    user() {
    	return this.$store.getters.getUser;
    },
    displayName: function() {
		  return this.$store.getters.getUser.email;
    }
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
   setUser: function() {
      this.$store.dispatch('setUser');
    },
    goToLogin: function() {
      this.$router.push({
        name: 'login'
      })      
    }  
  },
  created() {
    // when the app is created run the set user method
    // this uses Vuex to check if a user is signed in
    // check out mutations in the store.js file
    this.setUser();
  }
}
</script>


<style>

@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 400;
  src: url("./assets/Inter-Regular.woff2") format("woff2"),
       url("./assets/Inter-Regular.woff") format("woff");
}
@font-face {
  font-family: 'Inter';
  font-style:  normal;
  font-weight: 800;
  src: url("./assets/Inter-ExtraBold.woff2") format("woff2"),
       url("./assets/Inter-ExtraBold.woff") format("woff");
}
  h1,h2,h3,h4,h5, .navbar-brand {
    font-family: 'Inter', sans-serif !important;
  }
  body {
    font-family: 'Inter', sans-serif !important;
  }

  nav {
    border-bottom: 1px solid #000;
    margin-bottom: 10px;
  }

  .wrapper {
    padding-top: 100px;
  }

  img {
    max-width: 100%;
  }

  .dashed-top-border {
    border-top: 1px dashed #000;
  }

  a svg:hover {
    color: #474747;
  }
</style>
