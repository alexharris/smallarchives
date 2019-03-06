<template

>
<div class="mt-5">
      <div v-if="assets.length == 0">
          <p>This archive has no items.</p>
      </div>
      <div v-else>
        
        <div v-if="renderedAssets.length !== 0" class="row">
          <div class="col-8">
          <l-map :zoom=2>
            <l-tileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tileLayer>
              <template v-for="item in renderedAssets">

                <l-marker v-if="item.assetCoverageLat != ''" :lat-lng="[item.assetCoverageLat, item.assetCoverageLong]"></l-marker>
              </template>
           </l-map>
         </div>
         <div class="col-4">
          <ul class="list-group" >
              <li class="list-group-item" v-for="item in renderedAssets">{{item.assetTitle}}</li>
          </ul>
            
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
</template>

<script>
import firebase from 'firebase';
import sa from '../sa'
import {LMap, LTileLayer, LMarker } from 'vue2-leaflet';

export default {
  name: "DisplayArchiveItems",
  props: ['filteredAssetType', 'filteredCoverageLat'],
  data() {
  	return {
  	uid: '',
		url: '',
    assets: [],
    renderedAssets: [],
  	}
  },
  components: {
    LMap,
    LTileLayer,
    LMarker     
  },
  watch: { 
    //watch the filteredAssetType prop for changes, and change the asset array when it does
    filteredAssetType: function(newVal, oldVal) { // watch it
      this.filterAssetArray()
    },
    //watch the filteredCoverageLat prop for changes, and change the asset array when it does
    filteredCoverageLat: function(newVal, oldVal) { // watch it
      console.log('location toggled')
      this.filterAssetArray()
    }    
  },  
  created() {
    this.getUidFromUsername()
  },   
  computed: {
    firstMapPoint: function() {
      return [1,1]
    }
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

       // clear it so it resets each time this is called
      this.assets = []      

      sa.assetCollectionDbRef(uid, archiveId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.assets.push({
            fileName: doc.data().file,
            assetTitle: doc.data().assetTitle,
            assetId: doc.id,
            assetCreationDate: sa.getFormattedDate(doc.data().assetCreationDate),
            assetText: doc.data().assetText,
            assetType: doc.data().assetType,
            assetCoverageLat: doc.data().assetCoverageLat,
            assetCoverageLong: doc.data().assetCoverageLong
          });
        });
        //tell the parent about how many assets there are
        this.$store.commit('setAssetCount', this.assets.length)

        // sort the results
        this.assets.sort(this.sortByTitle)

        // load rendered assets
        this.renderedAssets = this.assets     
      });
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
  },

};
</script>

<style scoped>

  img {
    height: 300px;
  }

  .vue2leaflet-map {
    height: 515px;
  }

</style>