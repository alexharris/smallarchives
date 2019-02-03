<template>
	<div>
		<b-row>
			<b-col>
				<b-btn @click.stop="goBack" variant="outline-secondary">Back</b-btn>
				<hr class="my-4" />
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<h1 class="my-4">{{asset.assetTitle}}</h1>
			</b-col>
		</b-row>
		<b-row>

			<b-col cols="12" class="col-md-6">

				<div v-if="asset.assetType == 'image'">
					<img :src="assetSrc" />
				</div>
				<div v-if="asset.assetType == 'audio'">
					<figure>
					    <audio
					        controls
					        :src="assetSrc">
					            Your browser does not support the
					            <code>audio</code> element.
					    </audio>
					</figure>
				</div>
				<div v-if="asset.assetType === 'text'">
					<blockquote class="blockquote">{{asset.assetText}}</blockquote>
				</div>
				<div v-if="asset.assetType === 'youtube'">					
					<iframe width="560" height="315" v-bind:src="asset.assetYoutubeId" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>					
				</div>						
				<p class="my-4">
					Media type: {{asset.assetType}}
				</p>						
			</b-col>
			<b-col cols="12" class="col-md-6">
				<p>{{asset.assetDescription}}</p>
				<p>
				<strong>Creator:</strong> {{asset.assetCreator}} <br />
				<strong>Location:</strong> {{asset.assetLocation}} <br />
				<strong>Format:</strong> {{asset.assetFormat}}
				</p>
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<hr class="my-4" />	
				<p>Added on: {{asset.assetCreationDate}}</p>
				
			</b-col>
		</b-row>	
	</div>
</template>

<script>
import firebase from 'firebase';
import sa from '../sa'


export default {
  name: "PublicAsset",  
  data() {
  	return {
  		asset: {
	        assetTitle: '',
	        assetName: '',
	        assetId: '',
	        filePath: '',
	        customFields: ''	
  		},
  		assetSrc: '',
  		uid: ''
  	}
  },
  created() {
  	this.getUidFromUsername()
  	
  },
  methods: {      	
    async getUidFromUsername() {
      var username = this.$route.params.username
      this.uid = await sa.getUidFromUsername(username)
      this.getAssetDetails()
    },     	
    getAssetDetails: function() {

    	var uid = this.uid
    	var archiveId = this.$route.params.archive_id
    	var assetId = this.$route.params.asset_id
        

	    // get the fields from the database and assign to asset array
	    sa.assetDocumentDbRef(uid, archiveId, assetId).get().then((doc) => {
	      if (doc.exists) {
	        this.asset.assetTitle = doc.data().assetTitle
	        this.asset.assetFileName = doc.data().assetFileName
	        this.asset.assetType = doc.data().assetType
	        this.asset.assetText = doc.data().assetText
	        this.asset.assetYoutubeId = 'https://www.youtube.com/embed/' + doc.data().assetYoutubeId
	        this.asset.assetId = doc.id
	        this.asset.assetDescription = doc.data().assetDescription
	        this.asset.assetLocation = doc.data().assetLocation
	        this.asset.assetCreator = doc.data().assetCreator
	        this.asset.assetFormat = doc.data().assetFormat
	        this.asset.assetCreationDate = sa.getFormattedDate(doc.data().assetCreationDate)

	        this.getAssetSrc()
	      } else {
	        console.log("No such document!");
	      }
	    });      
    },  
    getAssetSrc: function() {

    	var uid = this.uid
    	var archiveId = this.$route.params.archive_id
    	var assetId = this.asset.assetId
		var fileName = this.asset.assetFileName
  
        sa.assetStorageRef(uid, archiveId, assetId, fileName).getDownloadURL().then((url) => {
            this.assetSrc = url
        }).catch(function(error) {
          console.log(error.message)
        })
    },    	
	goBack() {
	  this.$router.push({ name: 'PublicArchive', params: { id: this.$route.params.archive_id }})
	},      
  },
  

 
};
</script>

<style scoped>
img {
	max-width: 100%;
}
blockquote {
	font-size: 2.5em;
}
</style>
