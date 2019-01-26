<template>
  <b-row>
    <b-col cols="12">
      <div v-if="assets.length == 0">
          <p>This archive has no items.</p>    
      </div>
      <div v-else>  
        <table bordered="true" id="example-1" class="table table-striped table-bordered table-sm" >
          <thead class="thead-dark">
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Date Added</th>
              <th scope="col">Asset Type</th>
              <th scope="col">Action</th>
            </tr>
          </thead>          
          <tr v-for="item in assets">
            <td>{{item.assetTitle}}</td>
            <td>{{item.assetCreationDate}}</td>
            <td>{{item.assetType}}</td>
            <td >
              <b-btn variant="outline-secondary" class="mr-2 btn-sm" @click.stop="itemEdit(item.assetName, item.assetId)">Edit</b-btn>          
            </td>
          </tr>
        </table> 
      </div> 
    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'

export default {
  name: 'ListAssets',
  data () {
    return {
      assets: [],
      renderedAssets: [],
      uid: ''
    }
  },
  created() {
    this.createAssetArray()

    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
   
  },
  methods: {
    getFormattedDate (dateCreated) {
      var day = dateCreated.getDate()
      var month = dateCreated.getMonth() + 1
      var year = dateCreated.getFullYear()
      var formattedDate = month + '-' + day + '-' + year
      return formattedDate
    },
    createAssetArray: function() {

      var uid = firebase.auth().currentUser.uid
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
            assetType: doc.data().assetType
          });

        });
      });       
    },
    itemEdit (assetTitle, assetId) {
      this.$router.push({
        name: 'AdminEditAsset',
        params: { archive_id: this.$route.params.archive_id, asset_id: assetId }
      })
    }
  }
}
</script>



<style scoped>
  table {
    width:100%;
  }
  img { 
    height:100px;
  }
</style>
