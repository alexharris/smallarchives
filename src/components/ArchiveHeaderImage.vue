<template>
	<div class="my-4"> 
		<img :src="headerImage" />
	</div>
</template>

<script>
import firebase from 'firebase';
import sa from '../sa'



export default {
  name: "ArchiveHeaderImage", 
  data() {
  	return {
  		headerImage: '',
  		headerFileName: ''
  	}
  },
  computed: {
  	uid() {
  		return this.$store.getters.getUser.uid
  	},

  },
  created() {
  	this.getHeaderFileName();
  },
  methods: {
  	getHeaderFileName() {

		const ref = firebase.firestore().collection('archives').doc(this.uid).collection('userarchives').doc(this.$route.params.id);
		ref.get().then((doc) => {
			if (doc.exists) {
				this.headerFileName = doc.data().headerImage
			} else {
			  alert("No such document!");
			}
		}).then(() => {
			this.getHeaderImage()
		})		 
  	},   	
  	getHeaderImage: function() {


  		var filePath = this.uid + '/archive_' + this.$route.params.id + '/thumb_' + this.headerFileName;


        firebase.storage().ref().child(filePath).getDownloadURL().then((url) => {
        	this.headerImage = url
        }).catch(function(error) {
          console.log(error.message)
        })
  	}
  }
};
</script>