<template>
	<div id="app"> 
    	<b-navbar variant="dark" type="dark" toggleable="md">
        	<b-navbar-brand href="#">Memory Palace</b-navbar-brand>
        	
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
        	</b-navbar-nav>      
        </b-navbar>  	
		<b-container> 		
			<router-view/>
		</b-container>   
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
   setUser: function() {
      this.$store.dispatch('setUser');
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
