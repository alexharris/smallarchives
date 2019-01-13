<template>
	<div>
      <b-card v-for="item in renderedAssets"
        :img-src="item.assetSrc"
        img-top
        style="float: left; width: 30%; height: 350px; margin-right: 10px;"
        class="mb-2"
        border-variant="secondary"        
      >
        <p class="card-text">
          {{item.assetTitle}}
        </p>
<!--         <td>{{item.assetTitle}}</td>
        <td>{{item.assetName}}</td>
        <td><img :src="item.assetSrc" /></td> -->
      </b-card>
	</div>
</template>

<script>
import firebase from 'firebase';

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
  methods: {
    getUidFromUsername() {

      // get the user id based on the displayname from the route
      firebase.firestore().collection('users').where("displayName", "==", this.$route.params.username)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // Assign the user id from the document to the uid variable

            this.uid = doc.id
            
        });

        // when this is done, we can get the assets
        this.createAssetArray()
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });  

      
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
      firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").doc(this.$route.params.id).collection('assets')
      .get()
      .then((querySnapshot) => {
        // console.log(querySnapshot.data().file)
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.assets.push({
            // filename: doc.data().file
            filePath: this.uid + '/' + doc.data().file,
            fileName: doc.data().file,
            assetTitle: doc.data().assetTitle
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
            assetTitle: doc.assetTitle
          })
        }).catch(function(error) {
          console.log(error.message)
        })
      })
    },
      	
  },
  created() {
    this.getUidFromUsername()
  },  
};
</script>

<style scoped>
  img { 
    height: 300px;
  }
</style>