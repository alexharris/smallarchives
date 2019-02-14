<template>
	<div>
		<div class="row justify-content-center">
			<div class="col-12">
				<a @click.stop="goBack" class="float-right"><font-awesome-icon icon="times" size="2x" /></a><br />

			</div>
		</div>

		<div class="row justify-content-center">

			<div class="col-8 asset-pane my-4">

				<div v-if="asset.assetMediaType == 'image'">
					<img :src="assetSrc" />
				</div>
				<div v-if="asset.assetMediaType == 'audio'">
					<figure>
					    <audio
					        controls
					        :src="assetSrc">
					            Your browser does not support the
					            <code>audio</code> element.
					    </audio>
					</figure>
				</div>
				<div v-if="asset.assetMediaType == 'pdf'" class="pdf-download">
					<p>{{asset.assetFileName}}</p>
					<a :href="assetSrc"><font-awesome-icon icon="file-download" size="6x" /> </a>
				</div>				
				<div v-if="asset.assetMediaType === 'text'">
					<p class="lead">{{asset.assetText}}</p>
				</div>
				<div v-if="asset.assetMediaType === 'youtube'" class="video-wrapper">					
					<iframe width="560" height="315" v-bind:src="asset.assetYoutubeId" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>					
				</div>												
			</div>

			<div class="col-4">
				<h1 class="my-4 h4">{{asset.assetTitle}}</h1>
				<p>{{asset.assetDescription}}</p>

				


            <div class="card border-warning ml-0 bg-transparent">
              <div class="card-header">Metadata</div>
              <div class="card-body">
				<p>
				<strong>Media type:</strong> {{asset.assetMediaType}} <br />
				<strong>Contributor:</strong> {{asset.assetContributor}} <br />
				<strong>Creator:</strong> {{asset.assetCreator}} <br />
				<strong>Coverage:</strong> {{asset.assetCoverage}} <br />
				<strong>Format:</strong> {{asset.assetFormat}}<br />
				<strong>Identifier:</strong> {{asset.assetIdentifier}}<br />
				<strong>Language:</strong> {{asset.assetLanguage}}<br />
				<strong>Publisher:</strong> {{asset.assetPublisher}}<br />
				<strong>Relation:</strong> {{asset.assetRelation}}<br />
				<strong>Rights:</strong> {{asset.assetRights}}<br />
				<strong>Source:</strong> {{asset.assetSource}}<br />
				<strong>Subject:</strong> {{asset.assetSubject}}<br />
				</p>
              </div>
            </div>				
				

			<div v-if="asset.assetCoverage != ''" class="my-4">
			  <l-map :zoom=13 :center="latLongArray" v-if="asset.assetCoverageLat != '' && asset.assetCoverageLong != ''">
			    <l-tileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tileLayer>
			    <l-marker :lat-lng="latLongArray"></l-marker>

			  </l-map>
			</div>
			<p>Added on: {{asset.assetCreationDate}}</p>
			</div>

		</div>
		<div class="row justify-content-center">
			<div class="col-12">
				<hr class="my-4" />	
				
				
			</div>
		</div>	
	</div>
</template>

<script>
import firebase from 'firebase';
import sa from '../sa'
import {LMap, LTileLayer, LMarker } from 'vue2-leaflet';




export default {
  name: "PublicAsset", 
  components: {
    LMap,
    LTileLayer,
    LMarker
  },  
  data() {
  	return {
  		asset: {
	        assetTitle: '',
	        assetName: '',
	        assetId: '',
	        filePath: '',
	        customFields: '',
	        assetCoverageLat: '',
	        assetCoverageLong: ''	
  		},
  		assetSrc: '',
  		uid: '',
  		
  	}
  },
  computed: {
  	latLongArray: function() {
  		return [this.asset.assetCoverageLat, this.asset.assetCoverageLong]
	},
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
	      	// DCMI Fields
	        this.asset.assetTitle = doc.data().assetTitle
	        this.asset.assetDescription = doc.data().assetDescription
	        this.asset.assetContributor = doc.data().assetContributor
	        this.asset.assetCreator = doc.data().assetCreator
	        this.asset.assetCoverage = doc.data().assetCoverage
			this.asset.assetFormat = doc.data().assetFormat
			this.asset.assetIdentifier = doc.data().assetIdentifier
			this.asset.assetLanguage = doc.data().assetLanguage
			this.asset.assetPublisher = doc.data().assetPublisher
			this.asset.assetRelation = doc.data().assetRelation
			this.asset.assetRights = doc.data().assetRights
			this.asset.assetSource = doc.data().assetSource
			this.asset.assetSubject = doc.data().assetSubject				

			// Media Fields
	        this.asset.assetFileName = doc.data().assetFileName
	        this.asset.assetMediaType = doc.data().assetMediaType
	        this.asset.assetText = doc.data().assetText
	        this.asset.assetYoutubeId = 'https://www.youtube.com/embed/' + doc.data().assetYoutubeId
	        this.asset.assetId = doc.id
	        
	        this.asset.assetCoverageLat = doc.data().assetCoverageLat
	        this.asset.assetCoverageLong = doc.data().assetCoverageLong
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

.video-wrapper {
    position: relative;
    padding-bottom: 56.25%; /* 16:9 */
    padding-top: 25px;
    height: 0;
}
.video-wrapper iframe {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
}

blockquote {
	font-size: 2.5em;
}

.asset-pane audio {
	width: 100%;
}

.asset-pane .pdf-download {
	text-align: center;

}

.vue2leaflet-map {
	height: 300px;
}
</style>
