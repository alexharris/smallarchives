<template>
	<div>
		<div class="row justify-content-center my-4">
			<div class="col-12">
				<button v-if="confirmOwner" class="btn mr-2 btn-sm btn-primary" @click.stop="itemEdit(item.itemName, item.itemId)">Edit</button>		
				<a @click.stop="goBack" class="float-right close-item"><font-awesome-icon icon="times" size="2x" /></a><br />

			</div>
		</div>

		<div class="row justify-content-center">

			<div class="col-lg-8 item-pane my-4">

				<div v-if="item.itemMediaType == 'image'">
					<img :src="itemSrc" />
				</div>
				<div v-if="item.itemMediaType == 'audio'">
					<figure>
					    <audio
					        controls
					        :src="itemSrc">
					            Your browser does not support the
					            <code>audio</code> element.
					    </audio>
					</figure>
				</div>
				<div v-if="item.itemMediaType == 'pdf'" class="pdf-download">
					<!-- <p>{{item.itemFileName}}</p> -->
<!-- 					<a :href="itemSrc"><font-awesome-icon icon="file-download" size="6x" /> </a> -->
					<div id="pdfViewer"></div>
				</div>				
				<div v-if="item.itemMediaType === 'text'">
					<p class="lead">{{item.itemText}}</p>
				</div>
				<div v-if="item.itemMediaType === 'youtube'" class="video-wrapper">					
					<iframe width="560" height="315" v-bind:src="item.itemMediaYoutubeId" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>					
				</div>												
			</div>

			<div class="col-lg-4">
				
				<h1 class="my-4 h3">{{item.itemTitle}}</h1>
				<p>{{item.itemDescription}}</p>
				<span class="badge badge-warning mr-2" v-for="tag in item.tags"><a @click.stop="goToTag(tag)">{{tag}}</a></span>
				<p>
					<span v-if="item.itemMediaType"><strong>Media type:</strong> {{item.itemMediaType}} <br /></span>
					<span v-if="item.itemContributor"><strong>Contributor:</strong> {{item.itemContributor}} <br /></span>
					<span v-if="item.itemCreator"><strong>Creator:</strong> {{item.itemCreator}} <br /></span>
					<span v-if="item.itemCoverage"><strong>Coverage:</strong> {{item.itemCoverage}} <br /></span>
					<span v-if="item.itemDate"><strong>Date:</strong> {{item.itemDate}}<br /></span>
					<span v-if="item.itemFormat"><strong>Format:</strong> {{item.itemFormat}}<br /></span>
					<span v-if="item.itemIdentifier"><strong>Identifier:</strong> {{item.itemIdentifier}}<br /></span>
					<span v-if="item.itemLanguage"><strong>Language:</strong> {{item.itemLanguage}}<br /></span>
					<span v-if="item.itemPublisher"><strong>Publisher:</strong> {{item.itemPublisher}}<br /></span>
					<span v-if="item.itemRelation"><strong>Relation:</strong> {{item.itemRelation}}<br /></span>
					<span v-if="item.itemRights"><strong>Rights:</strong> {{item.itemRights}}<br /></span>
					<span v-if="item.itemSource"><strong>Source:</strong> {{item.itemSource}}<br /></span>
					<span v-if="item.itemSubject"><strong>Subject:</strong> {{item.itemSubject}}<br /></span>
				</p>
				<div v-if="item.itemCoverage != ''" class="my-4">
				  <l-map :zoom=13 :center="latLongArray" v-if="item.itemCoverageLat != '' && item.itemCoverageLong != ''">
				    <l-tileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tileLayer>
				    <l-marker :lat-lng="latLongArray"></l-marker>
				  </l-map>
					<p>
						<strong>Latitude: </strong>{{item.itemCoverageLat}}<br />
						<strong>Longitude: </strong>{{item.itemCoverageLong}}
					</p>
				</div>
				<div class="my-4">
					<hr />
					<p>
						<strong>Part of: </strong> <a href="" @click.stop="goBack">{{archiveTitle}}</a><br />
						<strong>Added on: </strong> {{item.itemCreationDate}}
					</p>	
				</div>
			</div>
			<div class="row my-5 py-5 justify-content-center">  
				<small>Made with <a href="/">Small Archives</a></small>
			</div>  			
		</div>	
	</div>
</template>

<script>
import firebase from 'firebase';
import sa from '../sa'
import PDF from 'pdfobject';
import {LMap, LTileLayer, LMarker } from 'vue2-leaflet';




export default {
  name: "PublicItem", 
  components: {
    LMap,
    LTileLayer,
    LMarker
  },  
  data() {
  	return {
  		item: {
	        itemTitle: '',
	        itemName: '',
	        itemId: '',
	        filePath: '',
	        customFields: '',
	        itemCoverageLat: '',
	        itemCoverageLong: ''	
  		},
  		itemSrc: '',
  		archiveTitle: '',
			uid: '',
			confirmOwner: false
  		
  	}
  },
  computed: {
  	latLongArray: function() {
  		return [this.item.itemCoverageLat, this.item.itemCoverageLong]
	}
  },
  created() {
		this.getUidFromUsername()
		this.getConfirmOwner();
  
  },
  methods: {      	
    async getUidFromUsername() {
      var username = this.$route.params.username
      this.uid = await sa.getUidFromUsername(username)
      // send to 404 when no UID matches
      if(this.uid === false) {
        this.$router.push('/404')
      }         
      this.getItemDetails()
		},   
    async getConfirmOwner() {
      this.confirmOwner = await sa.confirmOwner(this.$route.params.archive_id)
    },  		  	
  

    getItemDetails: function() {

    	var uid = this.uid
    	var archiveId = this.$route.params.archive_id
    	var itemId = this.$route.params.item_id
        

	    // get the fields from the database and assign to item array
	    sa.itemDocumentDbRef(uid, archiveId, itemId).get().then((doc) => {
	      if (doc.exists) {
	      	// DCMI Fields
	        this.item.itemTitle = doc.data().itemTitle
	        this.item.itemDescription = doc.data().itemDescription
	        this.item.itemContributor = doc.data().itemContributor
	        this.item.itemCreator = doc.data().itemCreator
	        this.item.itemCoverage = doc.data().itemCoverage
	        this.item.itemDate = doc.data().itemDate
					this.item.itemFormat = doc.data().itemFormat
					this.item.itemIdentifier = doc.data().itemIdentifier
					this.item.itemLanguage = doc.data().itemLanguage
					this.item.itemPublisher = doc.data().itemPublisher
					this.item.itemRelation = doc.data().itemRelation
					this.item.itemRights = doc.data().itemRights
					this.item.itemSource = doc.data().itemSource
					this.item.itemSubject = doc.data().itemSubject				

			// Media Fields
	        this.item.itemFileName = doc.data().itemFileName
	        this.item.itemMediaType = doc.data().itemMediaType
	        this.item.itemText = doc.data().itemText
	        this.item.itemMediaYoutubeId = 'https://www.youtube.com/embed/' + doc.data().itemMediaYoutubeId
	        this.item.itemId = doc.id
	        
	        this.item.itemCoverageLat = doc.data().itemCoverageLat
	        this.item.itemCoverageLong = doc.data().itemCoverageLong
	        this.item.itemCreationDate = sa.getFormattedDate(doc.data().itemCreationDate)
	        this.item.tags = doc.data().tags
	        
	        

	        this.getItemSrc()
	        
	      } else {
	        this.$router.push('/404')
	      }
	    }).then(() => {
	    	this.getArchiveTitle()
	    })    
    },  
    getItemSrc: function() {

    	var uid = this.uid
    	var archiveId = this.$route.params.archive_id
    	var itemId = this.item.itemId
		var fileName = this.item.itemFileName
  
        sa.itemStorageRef(uid, archiveId, itemId, fileName).getDownloadURL().then((url) => {
            this.itemSrc = url
        }).catch(function(error) {
          console.log(error.message)
        }).then(() => {
	    	if(this.item.itemMediaType === 'pdf') {
	    		PDF.embed(this.itemSrc, "#pdfViewer");	
	    	}  			
	    }); 
    },   
    getArchiveTitle: function() {
		var uid = this.uid
    	var archiveId = this.$route.params.archive_id
    	sa.archiveDocumentDbRef(uid, archiveId).get().then((doc) => {
		    if (doc.exists) {
		    	this.archiveTitle = doc.data().title
		    } else {
		        // doc.data() will be undefined in this case
		        this.$router.push('/404')
		    }
		}).catch(function(error) {
		    console.log("Error getting document:", error);
		})
	},  
	goBack() {
	  this.$router.push({ name: 'PublicArchive', params: { id: this.$route.params.archive_id }})
	},   
	goToTag(tag) {
        this.$router.push({
        	name: 'PublicArchive',
        	query: { tag: tag }
      	})
	},
	itemEdit (itemTitle, itemId) {
		this.$router.push({
			name: 'AdminEditItem',
			params: { archive_id: this.$route.params.archive_id, item_id: itemId }
		})
	},	 	   
  },
  

 
};
</script>

<style scoped lang="scss">
	$blue: #0011cf;
    $pink: #fff4e6;

.pdfobject-container { height: 50rem; border: 1rem solid rgba(0,0,0,.1); }


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

.item-pane {
	text-align: center
}

.item-pane audio {
	width: 100%;
}


.vue2leaflet-map {
	height: 300px;
}

a.close-item {
	border: 0px;
}
</style>
