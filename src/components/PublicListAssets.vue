<template

>
<div>
      <div v-if="assets.length == 0">
          <p>This archive has no items.</p>
      </div>
      <div v-else>
        <table class="table table-dark">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Object Type</th>
              <th scope="col">Date Added</th>
              
              <!-- <th scope="col">Actions</th> -->
            </tr>
          </thead>
          <tr v-for="item in assets">
            <td><a href="" @click.stop="viewSingleAsset(item.assetId)">{{item.assetTitle}}</a></td>
            <td><div>{{item.assetMediaType}}</div></td>
            <td>{{item.assetCreationDate}}</td>
            
          </tr>
        </table>
      </div>



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
    async getUidFromUsername() {
      var username = this.$route.params.username
      this.uid = await sa.getUidFromUsername(username)
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
            assetCreationDate: sa.getFormattedDate(doc.data().assetCreationDate),
            assetText: doc.data().assetText,
            assetMediaType: doc.data().assetMediaType,
            assetFormat: doc.data().assetFormat
          });
        });
        //tell the parent about how many assets there are
        this.$store.commit('setAssetCount', this.assets.length)
      });
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