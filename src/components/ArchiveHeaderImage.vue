<template>
	<div>
		<h1>{{uid}}</h1>
		{{headerImage}}
	</div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "ArchiveHeaderImage", 
  computed: {
  	uid() {
  		return this.$store.getters.getUser.uid
  	},
  	headerImage() {

  		// firebase.storage().ref().child(this.uid + '/archive_' + this.$route.params.id + '/goose_swan.jpg').getDownloadURL().then((url) => {
  		// 	console.log(url)
  		// })

  		return 'hello'

  	}
  },
  methods: {
  	getHeaderImage() {

  	}
  }
};
</script>