<template>
	<div id="app" class="d-flex flex-column h-100"> 
      <header>
        <nav class="navbar navbar-expand-lg " >
          <a class="navbar-brand" href="/"><img src="/img/sa-logo.jpg" class="float-left logo mr-2" />SMALL ARCHIVES</a>
          <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarText" aria-controls="navbarText" aria-expanded="false" aria-label="Toggle navigation">
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="collapse navbar-collapse" id="navbarText" v-if="user">
            <ul class="navbar-nav mr-auto" v-if="user">
              <li class="nav-item">
                <a class="nav-link" href="/admin/archives">Dashboard</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="" @click="this.logout">Logout</a>
              </li>
            </ul>
          </div>
        </nav>      
      </header> 	
  		<div class="container-fluid wrapper flex-shrink-0" v-cloak> 		
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


<style lang="scss">

  $blue: #0011cf;
  $pink: #fff4e6;
  $red: #ff0000;

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

  h1,h2,h3,h4,h5 {
    font-family: 'inter', sans-serif !important;
  }

  body {
    font-family: Georgia, sans-serif !important;
    background-color: #fff4e6;
    color: $blue;
    font-size: 18px;
    line-height: 35px;
  }

  hr {
    border-top: 1px solid $blue !important;
  }

  .wrapper {
    padding-top: 40px;
    /*padding-bottom: 100px;*/
  }
  @media only screen and (max-device-width: 385px) { 
    .wrapper {
      padding-top: 40px;
    }
  }

  header {
    // border-bottom: 2px solid $blue;
    a.navbar-brand {
      padding: 0;
      color: $blue;
      text-decoration: none;
      border-bottom: 2px solid $blue;
      &:hover {
        text-decoration: none;
        border-bottom: 2px solid $pink;
      }
      .logo {
        width: 30px;
        height: 30px;
      }
    }
    a {
      border-bottom: 0px;
    }
  }

  img {
    max-width: 100%;
  }

  .img-link {
    &:hover {
      text-decoration: none;
    }
  }

  .dashed-top-border {
    border-top: 1px dashed #000;
  }

  a {
    color: $blue;
    border-bottom: 2px solid $blue;
    padding-bottom: 4px;
    &:hover {
      padding-bottom: 4px;
      text-decoration: none;
      color: red;
      border-bottom: 2px solid $pink;

    }
  }

  a svg:hover {
    color: #474747;
  }

  .card {
    border: 1px solid $blue;
    background-color: transparent;
    & .card-header {
      background-color: $pink;
      border-bottom: 1px solid $blue;
      font-weight: 800;
    }
    & .card-footer {
      background-color: $pink;
      border-top: 1px solid $blue;
    }
  }  

  .card.border-danger {
    border: 1px solid $red;
    background-color: transparent;
    color: red;
    & .card-header {
      background-color: transparent;
      border-bottom: 1px solid $red;
            font-weight: 800;
    }
    & .card-footer {
      background-color: $red;
      border-top: 1px solid $red;
    }
  }  

  .btn:hover {
    cursor: pointer;
  }

  .btn.btn-outline-danger {
      &:hover {
          color: white !important;
          border: 2px solid $red;
      }
  }  

  .btn-dark {
      background-color: $blue;
      color: $pink;
      border: 1px solid $blue;
      font-family: 'inter';
      &:hover {
          color: $blue;
          background-color: $pink;
          border: 1px solid $blue;
      }
  }

  .btn-outline-dark {
    color: $blue;
    border: 1px solid $blue;
    &:not(:disabled):not(.disabled).active {
      background-color: $blue;
      color: $pink;
    }
    &:hover {
        color: $pink;
        background-color: $blue;
        border: 1px solid $blue;
    }
  }  

  .btn-light {
      background-color: $pink;
      color: $blue;
      border: 1px solid $pink;
      font-family: 'inter';
      &:hover {
          color: $pink;
          background-color: $blue;
      }        
  }   

  .table {
    color: $blue;
    & thead th {
      border-bottom: 1px solid $blue;
      border-top: 1px solid $blue;
    }
  }

  .nav-tabs {
    border-bottom: 1px solid $blue;
    .nav-link.active {
      color: $blue;
      border: 1px solid $blue;
      border-bottom: 0px;
      background-color: transparent;
    }
  }

  footer {
    border-top: 1px solid #000;
  }
</style>
