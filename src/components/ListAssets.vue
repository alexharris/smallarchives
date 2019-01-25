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
          <tr v-for="item in renderedAssets">
            <td>{{item.assetTitle}}</td>
            <td>{{item.assetCreationDate}}</td>
            <td>{{item.assetType}}</td>
            <!-- <td><img :src="item.assetSrc" /></td> -->
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
    // This function creates an array called 'assets' that contains 
    // all of the images that have been upload to a particular archive.
    // These fields include:
    // - filePath: the path to this file, in the form of 'userid/filename.xxx'
    // - fileName: the name of the file that was upload
    // - assetTitle: the chosen title of the asset
    //
    // It then calls renderAssetArray to turn this data into something renderable
    createAssetArray: function() {
        
      firebase.firestore().collection("archives").doc(firebase.auth().currentUser.uid).collection("userarchives").doc(this.$route.params.archive_id).collection('assets')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // get the full file path and make it blank if it doesnt exist
          if(doc.data().file != '') {
            var fullFilePath = firebase.auth().currentUser.uid + '/archive_' + this.$route.params.archive_id + '/assets/' + doc.data().file
          } else {
            var fullFilePath = ''
          }

          this.assets.push({
            // filename: doc.data().file
            filePath: fullFilePath,
            fileName: doc.data().file,
            assetTitle: doc.data().assetTitle,
            assetId: doc.id,
            assetCreationDate: this.getFormattedDate(doc.data().assetCreationDate),
            assetText: doc.data().assetText,
            assetType: doc.data().assetType
          });

        });
        
        this.renderAssetArray()
      });       
    },
    // This function takes the array of assets that have been added to this archive, 
    // and gets it ready for display. This mostly involves querying the storage database 
    // to get the actual URL to the asset.

    renderAssetArray: function() {

      this.assets.forEach((doc) => {
        if(doc.filePath != '') {
          firebase.storage().ref().child(doc.filePath).getDownloadURL().then((url) => {
            this.renderedAssets.push({
              assetSrc: url,
              assetName: doc.fileName,
              assetTitle: doc.assetTitle,
              assetType: doc.assetType,
              assetId: doc.assetId,
              assetCreationDate: doc.assetCreationDate
            })
          })           
        } else {
          this.renderedAssets.push({
            assetSrc: '',
            assetText: doc.assetText,
            assetName: doc.fileName,
            assetTitle: doc.assetTitle,
            assetType: doc.assetType,
            assetId: doc.assetId,
            assetCreationDate: doc.assetCreationDate
          })
        }
      })
    },
    itemEdit (assetTitle, assetId) {
      this.$router.push({
        name: 'AdminEditAsset',
        params: { archive_id: this.$route.params.id, asset_id: assetId }
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
