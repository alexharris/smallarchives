<template>
  <b-row>
    <b-col cols="12">
      <b-btn @click.stop="goBackOne" variant="outline-secondary">Back</b-btn>
      <hr class="my-4" />
      <h1>Edit Asset</h1>      
      <hr class="my-4" />
      {{asset.assetName}}
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Title">
          <b-form-input id="title" v-model.trim="asset.assetTitle"></b-form-input>
        </b-form-group> 
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Enter Description">
          <b-form-textarea id="title" v-model.trim="asset.assetDescription"></b-form-textarea>
        </b-form-group>                      
        <hr class="my-4" />            
        <b-button type="submit" variant="primary">Save</b-button>
        <hr class="my-4" />
        <b-alert show variant="danger">
          <h4>Delete</h4>
          <p>Warning: Deleting this asset is permanent and you can't get it back</p>
          <b-btn variant="danger" @click.stop="itemDelete(asset.assetId)">Delete</b-btn>
        </b-alert>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'

export default {
  name: 'AdminEditAsset',
  data () {
    return {
      key: this.$route.params.id,
      asset: {
        assetTitle: {},
        assetName: '',
        assetId: '',
        assetDescription: '',

      },
      uid: ''
    }
  },
  created () {
    //-------------
    // Get the initial data
    //-------------

    var uid = firebase.auth().currentUser.uid
    var archiveId = this.$route.params.archive_id
    var assetId = this.$route.params.asset_id

    // build the ref
    sa.assetDocumentDbRef(uid, archiveId, assetId).get().then((doc) => {
      if (doc.exists) {
        this.asset.assetTitle = doc.data().assetTitle
        this.asset.assetName = doc.data().file
        this.asset.assetId = doc.id
        this.asset.assetDescription = doc.data().assetDescription
      } else {
        console.log("No such document!");
      }
    });
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      var assetId = this.$route.params.asset_id

      // build the ref
      sa.assetDocumentDbRef(uid, archiveId, assetId).update({
        assetTitle: this.asset.assetTitle,
        assetDescription: this.asset.assetDescription

      }).then(() => {
        console.log('asset updated!')
        this.$router.push({ name: 'AdminShowArchive', params: { id: this.$route.params.archive_id }})
      })
    },
    itemDelete(assetId) {
      //Delete the item from the database
      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      var assetId = this.$route.params.asset_id

      // build the ref
      sa.assetDocumentDbRef(uid, archiveId, assetId).delete().then(() => {
          console.log("Document successfully deleted from database");
          //Then, delete the item from storage
          firebase.storage().ref().child(firebase.auth().currentUser.uid + '/' + this.$route.params.archive_id + '/' + this.asset.assetName).delete().then(() => {
            // File deleted successfully
            console.log("Document successfully deleted from storage");
            console.log(this.$route.params.archive_id)
            this.$router.push({ name: 'AdminShowArchive', params: { id: this.$route.params.archive_id }})

          }).catch(function(error) {
            // Uh-oh, an error occurred!
          });

      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });


    }, 
    goBackOne() {
      this.$router.go(-1)
    },         
  }
}
</script>
