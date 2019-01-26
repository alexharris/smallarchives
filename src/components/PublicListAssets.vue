<template

>
  <b-row>
    <b-col cols="12">
      <div v-if="assets.length == 0">
          <p>This archive has no items.</p>
      </div>
      <div v-else>
        <table bordered="true" id="example-1" class="table table-striped table-bordered table-sm">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Object Type</th>
              <th scope="col">Date Added</th>
              
              <!-- <th scope="col">Actions</th> -->
            </tr>
          </thead>
          <tr v-for="item in assets">
            <td><b-link @click.stop="editAsset(item.assetId)">{{item.assetTitle}}</b-link></td>
            <td><div>{{item.assetFormat}}</div></td>
            <td>{{item.assetCreationDate}}</td>
            
<!--             <td >
              <b-btn variant="outline-secondary" size="sm" @click.stop="editAsset(item.assetId)">Details</b-btn>
            </td> -->
          </tr>
        </table>
      </div>
    </b-col>
  </b-row>


	</div>
</template>

<script>
import firebase from 'firebase';
import sa from '../sa'

export default {
  name: "DisplayArchiveItems",
  data() {
  	return {
  	uid: '',
		url: '',
    assets: [],
    renderedAssets: [],
  	}
  },
  created() {
    this.getUidFromUsername()
  },    
  methods: {  
    getFormattedDate (dateCreated) {
      var day = dateCreated.getDate()
      var month = dateCreated.getMonth() + 1
      var year = dateCreated.getFullYear()
      var formattedDate = month + '-' + day + '-' + year
      return formattedDate
    },      
    async getUidFromUsername() {
      this.uid = await sa.getUidFromUsername('alex')
      this.createAssetArray()
    },
    createAssetArray: function() {

      var uid = this.uid
      var archiveId = this.$route.params.archive_id

      sa.assetCollectionDbRef(uid, archiveId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.assets.push({
            fileName: doc.data().file,
            assetTitle: doc.data().assetTitle,
            assetId: doc.id,
            assetCreationDate: this.getFormattedDate(doc.data().assetCreationDate),
            assetText: doc.data().assetText,
            assetType: doc.data().assetType,
            assetFormat: doc.data().assetFormat
          });
        });
        //tell the parent about how many assets there are
        this.$store.commit('setAssetCount', this.assets.length)
      });
    },
    editAsset: function(assetId) {
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