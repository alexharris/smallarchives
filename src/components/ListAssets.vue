<template>
  <b-row>
    <b-col cols="12">


    <table id="example-1">
      <tr v-for="item in renderedAssets">
        <td>{{item.assetName}}</td>
        <td><img :src="item.assetSrc" /></td>
      </tr>
    </table>  

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
    }
  },
  created() {
    this.createAssetArray()
  },
  methods: {
    createAssetArray: function() {
        
      firebase.firestore().collection("archives").doc(firebase.auth().currentUser.uid).collection("userarchives").doc(this.$route.params.id).collection('assets')
      .get()
      .then((querySnapshot) => {
        // console.log(querySnapshot.data().file)
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.assets.push({
            // filename: doc.data().file
            filePath: firebase.auth().currentUser.uid + '/' + doc.data().file,
            fileName: doc.data().file
          });
        });
        this.renderAssetArray()
      });       
    },


    renderAssetArray: function() {

      this.assets.forEach((doc) => {
        firebase.storage().ref().child(doc.filePath).getDownloadURL().then((url) => {
          this.renderedAssets.push({
            assetSrc: url,
            assetName: doc.fileName
          })
        }).catch(function(error) {
          console.log(error.message)
        })

        
      })

      console.log(this.assets)

    }     
  }
}
</script>

<style scoped>
  img { 
    height:100px;
  }
</style>
