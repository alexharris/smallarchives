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
  created() {
    this.getUidFromUsername()
  	
  },
  methods: {
    async getUidFromUsername() {
      var username = this.$route.params.username
      this.uid = await sa.getUidFromUsername(username)
      this.getHeaderFileName();
    },    
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

      var uid = this.uid
      var archiveId = this.$route.params.archive_id
      var fileName = this.headerFileName

  		sa.archiveStorageRef(uid, archiveId, fileName, 'thumb_').getDownloadURL().then((url) => {
        	this.headerImage = url
        }).catch(function(error) {
          console.log(error.message)
        })
  	}
  }
};
</script>