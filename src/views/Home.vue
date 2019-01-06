<template>
  <div class="home">
  <b-jumbotron header="Welcome" lead="Lorem ipsum dolor sit amet, consectetur adipiscing elit." >
  <p>Sed ultrices justo odio, eu consequat sem tristique a. Donec nec aliquam ante. Mauris vitae pellentesque velit. Maecenas felis leo, egestas in leo quis, pharetra fermentum libero. Cras pulvinar est ac justo ultricies consectetur. In eu finibus orci. Duis vitae tempor turpis. Curabitur sit amet laoreet felis. In hac habitasse platea dictumst. </p>
</b-jumbotron>

    <b-button @click="logout">Logout</b-button>


  </div>
</template>

<script>

import firebase from 'firebase';

export default {
  name: "home", 
  methods: {
  	logout: function() {
  		firebase.auth().signOut().then(() => {
  			this.$router.replace('login')
  		})
  	}
  }
};
</script>
