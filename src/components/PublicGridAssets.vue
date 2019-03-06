<template

>
<div>
    <div v-if="assets.length == 0">
        <p>This archive has no items.</p>
    </div>
    <div v-else>
      <div class="container">
          <div v-if="renderedAssets.length !== 0" class="row px-n5">
            <div class="col-xs-12 col-md-6 col-lg-4 col-xl-3 grid-item mb-3" v-for="item in renderedAssets">
              <div class="media-display">
                <div v-if="item.assetMediaType === 'image'">       
                  <a href="" @click.stop="viewSingleAsset(item.assetId)"><img :src="item.assetSrc" /></a>
                </div>
                <div v-if="item.assetMediaType === 'pdf'">      
                <div class="pdf-placeholder"><a href="" @click.stop="viewSingleAsset(item.assetId)">PDF</a> </div>
                  <!-- <font-awesome-icon :icon="['far', 'file']" size="10x" /> -->
                </div>
                <div v-if="item.assetMediaType === 'audio'">       
                  <figure>
                      <audio
                          controls
                          :src="item.assetSrc">
                              Your browser does not support the
                              <code>audio</code> element.
                      </audio>
                  </figure>
                </div> 
                <div v-if="item.assetMediaType === 'youtube'">       
                  <a href="" @click.stop="viewSingleAsset(item.assetId)"><img :src="youtubeThumbnail(item)" /></a>
                </div>                                 
              </div>
              <div class="grid-title">
                <small>{{item.assetType}}<font-awesome-icon class="ml-2" icon="map-marker-alt" size="1x" v-if="item.assetCoverageLat"/></small>
                <p class="my-2"><a href="" @click.stop="viewSingleAsset(item.assetId)">{{truncatedTitle(item.assetTitle, 50)}}</a></p>

              </div>
            </div>
          </div>
          <div class="row" v-else>
            <div class="col-12">
              <p></p>
              <p>There are no results. Please modify filters.</p>
            </div>
          </div>          

      </div>
    </div>
	</div>
</div>
</template>

<script>
import firebase from 'firebase';
import sa from '../sa'

export default {
  name: "PublicGridAssets",
  props: ['filteredAssetType', 'filteredCoverageLat'],
  data() {
  	return {
  	uid: '',
		url: '',
    assets: [],
    renderedAssets: []
  	}
  },
  watch: { 
    //watch the filteredAssetType prop for changes, and change the asset array when it does
    filteredAssetType: function(newVal, oldVal) { // watch it
      this.filterAssetArray()
    },
    //watch the filteredCoverageLat prop for changes, and change the asset array when it does
    filteredCoverageLat: function(newVal, oldVal) { // watch it
      this.filterAssetArray()
    }    
  },    

  created() {
    this.getUidFromUsername()
  },    
  methods: {     
    async getUidFromUsername() {
      var username = this.$route.params.username
      this.uid = await sa.getUidFromUsername(username)
      this.createAssetArray()
      
    },
    createAssetArray: function() {

      var uid = this.uid
      var archiveId = this.$route.params.archive_id
      var assetSrcUrl = ''

      // clear it so it resets each time this is called
      this.assets = []

      sa.assetCollectionDbRef(uid, archiveId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var imagePrefix = '';

          if(doc.data().assetMediaType === 'image') {
            imagePrefix = 'thumb_'
          } else {
            imagePrefix = ''
          }
          // get the asset source for thumbnail image
          sa.assetStorageRef(uid, archiveId, doc.id, doc.data().assetFileName, imagePrefix).getDownloadURL().then((url) => {
            assetSrcUrl = url
          }).catch(function(error) {
            assetSrcUrl = ''
            console.log(error.message)
          }).then(() => {
            this.assets.push({
              fileName: doc.data().file,
              assetTitle: doc.data().assetTitle,
              assetId: doc.id,
              assetCreationDate: sa.getFormattedDate(doc.data().assetCreationDate),
              assetText: doc.data().assetText,
              assetType: doc.data().assetType,
              assetMediaType: doc.data().assetMediaType,
              assetFileName: doc.data().assetFileName,
              assetYoutubeId: doc.data().assetYoutubeId,
              assetSrc: assetSrcUrl,
              assetCoverageLat: doc.data().assetCoverageLat
            });    
            //tell the parent about how many assets there are
            this.$store.commit('setAssetCount', this.assets.length)  

            this.assets.sort(this.sortByTitle)

            // load rendered assets
            this.renderedAssets = this.assets         
          })
        });

      })
    },   
    // this just does some quick sorting
    sortByTitle: function(a,b) {
      if (a.assetTitle < b.assetTitle)
        return -1;
      if (a.assetTitle > b.assetTitle)
        return 1;
      return 0;
    },      
    filterAssetArray: function() {

      this.renderedAssets = []

      if(this.filteredCoverageLat === true) { //this means the box is checked and only items with location should appear
        this.renderedAssets = this.assets.filter((item) => {
          return item.assetCoverageLat != false
        })  
        if(this.filteredAssetType != 'All'){ // then we check to see if a specific type is selected
          this.renderedAssets = this.renderedAssets.filter((item) => {
            return item.assetType === this.filteredAssetType
          })  
        }
      } else { // this means show things with or without location
        this.renderedAssets = this.assets.filter((item) => {
          return item.assetCoverageLat != true
        })  
        if(this.filteredAssetType != 'All'){ // then we check to see if a specific type is selected
          this.renderedAssets = this.renderedAssets.filter((item) => {
            return item.assetType === this.filteredAssetType
          })  
        }
      }
    },        
    viewSingleAsset: function(assetId) {
      this.$router.push({
        name: 'PublicAsset',
        params: { username: this.$route.params.username, archive_id: this.$route.params.archive_id, asset_id: assetId }
      })
    },
    truncatedTitle: function(string, length) {
      return sa.truncateString(string,length)
    },
    youtubeThumbnail: function(item) {
      return 'https://img.youtube.com/vi/' + item.assetYoutubeId + '/sddefault.jpg';
    }     
       
  
  }


}
</script>

<style scoped lang="scss">


  audio {
    width: 100%;
    top: 50px;
    position: relative;
  }

  .grid-item {
    height: 400;
    padding: 30px;

  }

  .grid-title {
    height: 90px;
    padding-bottom: 10px;
    border-bottom: 2px solid #000;
  }

  .pdf-placeholder {
    position: relative;
    border: 1px solid #000;
    top: 60px;
    left: 60px;
    width: 100px;
    padding: 10px 0;
  }

  .media-display {
    margin: 20px 0;
    height: 200px;
    text-align: center;
    img {
      max-height: 200px
    }
  }
</style>