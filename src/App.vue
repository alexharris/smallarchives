<template>
	<div id="app" class="d-flex flex-column h-100"> 
      <header>
        <nav class="navbar navbar-expand-lg navbar-light" v-if="user">
          <a class="navbar-brand" href="/">SMALL ARCHIVES</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarText">
            <ul class="navbar-nav mr-auto" v-if="user">
              <li class="nav-item">
                <a class="nav-link" href="/admin/archives">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" @click="this.logout">Logout</a>
              </li>
            </ul>
          </div>
        </nav>      
      </header> 	
  		<div class="container wrapper flex-shrink-0" v-cloak> 		
  			<router-view/>       
  		</div>  
<!--       <footer class="footer py-3" v-if="user">
        <div class="container-fluid">

            <a href="/Contact">Contact</a>.
        </div>
      </footer>  -->       


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
    background-color: #ffffff;
  }

  body.admin {
    background-color: #fffade !important;
  }


  .table-dark {
    color: #000;
    background-color: #fffade;
    border: 1px solid #ffc107 !important;
  }

  .table-public {
    color: #000;
    background-color: #ffffff;
    border: 1px solid #000;
  }

  .table-dark thead th {
    background-color: #f7f2d7 !important;
    border:0;
    border-bottom: 1px solid #ffc107 !important;
    font-weight: 400;
  }

  .table-public thead th {
    border-bottom: 1px solid #000 !important;
    border-top: 1px solid #000 !important;
    font-weight: 400;
  }

  .table-dark td {
    border: 1px solid #ffc107 !important;
  }

  .table-public td {
    border: 1px solid #000;
  }

  hr {
    border-top: 1px solid #000 !important;
  }

  .wrapper {
    padding-top: 100px;
    /*padding-bottom: 100px;*/
  }
  @media only screen and (max-device-width: 385px) { 
    .wrapper {
      padding-top: 40px;
    }
  }

  header {
    background-color: #fffade;
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

  footer {
    border-top: 1px solid #000;
  }
</style>
