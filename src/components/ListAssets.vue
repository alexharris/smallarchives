<template>
  <b-row>
    <b-col cols="12">
      <div v-if="assets.length == 0">
          <p>This archive has no items.</p>    
      </div>
      <div v-else>      
        <table bordered="true" id="example-1" class="table table-striped table-bordered">
          <tr v-for="item in renderedAssets">
            <td>{{item.assetTitle}}</td>
            <td>{{item.assetName}}</td>
            <!-- <td><img :src="item.assetSrc" /></td> -->
            <td >
              <b-btn variant="outline-secondary" class="float-right mr-2" @click.stop="itemEdit(item.assetName, item.assetId)">Edit</b-btn>          
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
    // This function creates an array called 'assets' that contains 
    // all of the images that have been upload to a particular archive.
    // These fields include:
    // - filePath: the path to this file, in the form of 'userid/filename.xxx'
    // - fileName: the name of the file that was upload
    // - assetTitle: the chosen title of the asset
    //
    // It then calls renderAssetArray to turn this data into something renderable
    createAssetArray: function() {
        
      firebase.firestore().collection("archives").doc(firebase.auth().currentUser.uid).collection("userarchives").doc(this.$route.params.id).collection('assets')
      .get()
      .then((querySnapshot) => {
        // console.log(querySnapshot.data().file)
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.assets.push({
            // filename: doc.data().file
            filePath: firebase.auth().currentUser.uid + '/' + this.$route.params.id + '/' + doc.data().file,
            fileName: doc.data().file,
            assetTitle: doc.data().assetTitle,
            assetId: doc.id
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
        firebase.storage().ref().child(doc.filePath).getDownloadURL().then((url) => {
          this.renderedAssets.push({
            assetSrc: url,
            assetName: doc.fileName,
            assetTitle: doc.assetTitle,
            assetId: doc.assetId
          })
        }).catch(function(error) {
          console.log(error.message)
        })
      })
    },
    itemEdit (assetTitle, assetId) {
      this.$router.push({
        name: 'EditAsset',
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
