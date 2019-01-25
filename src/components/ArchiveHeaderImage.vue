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

      var uid = this.uid
      var archiveId = this.$route.params.archive_id

  		sa.archiveDocumentDbRef(uid, archiveId).get().then((doc) => {
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

      console.log(this.headerFileName)

  		var filePath = this.uid + '/archive_' + this.$route.params.archive_id + '/' + this.headerFileName;

      console.log(filePath)
        firebase.storage().ref().child(filePath).getDownloadURL().then((url) => {
        	this.headerImage = url
        }).catch(function(error) {
          console.log(error.message)
        })
  	}
  }
};
</script>