<template>
  <b-row>
    <b-col cols="12">
      <b-btn @click.stop="goBackOne">Back</b-btn>
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
        <b-button type="submit" variant="primary">Update</b-button>
        <hr my="4" />
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

export default {
  name: 'EditAsset',
  data () {
    return {
      key: this.$route.params.id,
      asset: {
        assetTitle: {},
        assetName: '',
        assetId: ''
      },
    }
  },
  created () {
    //-------------
    // Get the initial data
    //-------------

    // build the ref
    const ref = firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives').doc(this.$route.params.archive_id).collection('assets').doc(this.$route.params.asset_id);

    // get the fields from the database and assign to asset array
    ref.get().then((doc) => {
      if (doc.exists) {
        this.asset.assetTitle = doc.data().assetTitle
        this.asset.assetName = doc.data().file
        this.asset.assetId = doc.id
      } else {
        console.log("No such document!");
      }
    });
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()

      const ref = firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives').doc(this.$route.params.archive_id).collection('assets').doc(this.$route.params.asset_id);

      ref.update({
        assetTitle: this.asset.assetTitle

      }).then(() => {
        console.log('asset updated!')
        this.$router.push({ name: 'ShowArchive', params: { id: this.$route.params.archive_id }})
      })
    },
    itemDelete(assetId) {
      //Delete the item from the database
      const ref = firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives').doc(this.$route.params.archive_id).collection('assets').doc(assetId);

      ref.delete().then(() => {
          console.log("Document successfully deleted from database");
          //Then, delete the item from storage
          firebase.storage().ref().child(firebase.auth().currentUser.uid + '/' + this.asset.assetName).delete().then(() => {
            // File deleted successfully
            console.log("Document successfully deleted from storage");
            this.$router.push({ name: 'ShowArchive', params: { id: this.$route.params.archive_id }})

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
