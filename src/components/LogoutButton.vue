<template>
	<b-button @click="logout">Logout</b-button>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "LogoutButton", 
  methods: {
  	logout: function() {
  		firebase.auth().signOut().then(() => {
  			this.$router.replace('login')
  		})
  	}
  }
};
</script>