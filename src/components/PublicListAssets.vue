<template

>
<div class="mt-5">
      <div v-if="assets.length == 0">
          <p>This archive has no items.</p>
      </div>
      <div v-else>
        <div v-if="renderedAssets.length !== 0" class="row">
          <table class="table table-public">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Item Type</th>
                <th scope="col">Date Added</th>
                
                <!-- <th scope="col">Actions</th> -->
              </tr>
            </thead>
            <tr v-for="item in renderedAssets">
              <td><a href="" @click.stop="viewSingleAsset(item.assetId)">{{item.assetTitle}}</a><font-awesome-icon class="ml-2" icon="map-marker-alt" size="1x" v-if="item.assetCoverageLat"/></td>
              <td><div>{{item.assetType}}</div></td>
              <td>{{item.assetCreationDate}}</td>
              
            </tr>
          </table>
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
            assetCoverageLat: doc.data().assetCoverageLat
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
</style>