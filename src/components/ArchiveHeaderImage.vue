<template>
	<div class="header-image-container"> 
		<img :src="headerImage" />
	</div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'



export default {
  name: "ArchiveHeaderImage", 
  props: ['archiveId'],
  data() {
  	return {
  		headerImage: '',
  		headerFileName: ''
  	}
  },
  created() {
    this.getUidFromUsername()
  	
  },
  watch: { 
    //watch the archiveId prop for changes, and change value when it does
    archiveId: function(newVal, oldVal) { // watch it
      console.log(newVal)
    },
  },   
  methods: {
    async getUidFromUsername() {
      // this component is used on both the front end and back end, so it needs to check both the route and currentuser for username
      if(this.$route.params.username != undefined) {
        var username = this.$route.params.username
        this.uid = await sa.getUidFromUsername(username)
      } else {
        var username = this.$store.getters.getUser.displayName
        this.uid = await sa.getUidFromUsername(username)
      }

      this.getHeaderFileName();
    },    
  	getHeaderFileName() {

      var uid = this.uid
      var archiveId = this.archiveId

  		sa.archiveDocumentDbRef(uid, archiveId).get().then((doc) => {
  			if (doc.exists) {
  				this.headerFileName = doc.data().headerImage   
  			} else {
  			  alert("No such document!");
  			}
  		}).then(() => {
        if(this.headerFileName != '') {
          this.getHeaderImage()  
        } else {
          console.log('no header image')
        }
  			
  		})		 
    	},   	
  	getHeaderImage: function() {

      var uid = this.uid
      var archiveId = this.archiveId
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

<style lang="scss">

.header-image-container img {
  max-width: 100%;
}

</style>