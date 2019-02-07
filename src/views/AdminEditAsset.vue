<template>
  <b-row>
    <b-col cols="12">
      <b-btn @click.stop="goBack" variant="dark">Back</b-btn>
      <hr class="my-4" />
      <h1>Edit Asset</h1>      
      <hr class="my-4" />
      <h2>Details</h2>

      Type: {{asset.assetMediaType}} <br />
      <div v-if="asset.assetMediaType != 'text' && asset.assetMediaType != 'youtube'">
        Filename: {{asset.assetFileName}} <br />
      </div>

      Creation Date: {{asset.assetCreationDate}} <br />
      

      
      <hr class="my-4" />
      <h2>Metadata</h2>
      <b-form @submit="onSubmit">
        <b-form-group 
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Title">
          <b-form-input v-model.trim="asset.assetTitle"></b-form-input>
        </b-form-group> 
        <b-form-group 
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Description">
          <b-form-textarea v-model.trim="asset.assetDescription"></b-form-textarea>
        </b-form-group>  
        <b-form-group 
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Creator">
          <b-form-input v-model.trim="asset.assetContributor"></b-form-input>
        </b-form-group>  
        <b-form-group 
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Format">
          <b-form-input v-model.trim="asset.assetFormat"></b-form-input>          
        </b-form-group>
        <b-form-group 
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Location">
          <b-form-input v-model.trim="asset.assetLocation"></b-form-input>          
        </b-form-group>     
        <b-form-group 
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Location Latitude">
          <b-form-input v-model.trim="asset.assetLocationLat"></b-form-input>          
        </b-form-group>     
        <b-form-group 
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Location Longitude">
          <b-form-input v-model.trim="asset.assetLocationLong"></b-form-input>          
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
        assetTitle: '',
        assetFileName: '',
        assetId: '',
        assetDescription: '',
        assetFormat:'',
        assetContributor:'',
        assetLocation:''
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
        this.asset.assetCreationDate = sa.getFormattedDate(doc.data().assetCreationDate)
        this.asset.assetContributor = doc.data().assetContributor
        this.asset.assetTitle = doc.data().assetTitle
        this.asset.assetFileName = doc.data().assetFileName
        this.asset.assetFormat = doc.data().assetFormat
        this.asset.assetLocation = doc.data().assetLocation
        this.asset.assetLocationLat = doc.data().assetLocationLat
        this.asset.assetLocationLong = doc.data().assetLocationLong
        this.asset.assetId = doc.id
        this.asset.assetText = doc.data().assetText
        this.asset.assetDescription = doc.data().assetDescription
        this.asset.assetMediaType = doc.data().assetMediaType
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
        assetDescription: this.asset.assetDescription,
        assetContributor: this.asset.assetContributor,
        assetFormat: this.asset.assetFormat,
        assetLocation: this.asset.assetLocation,
        assetLocationLat: this.asset.assetLocationLat,
        assetLocationLong: this.asset.assetLocationLong
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
      var fileName = this.asset.assetFileName

      console.log(fileName)
      //Check to see if there are assets to delete

      console.log(this.asset.assetMediaType)
      if(this.asset.assetMediaType === 'image') {
        // delete the thumb derivative
        sa.assetStorageRef(uid, archiveId, assetId, fileName, 'thumb_').delete()
      }

      if(this.asset.assetMediaType === 'image' || this.asset.assetMediaType === 'audio' || this.asset.assetMediaType === 'pdf') {
        // delete the main asset image
        sa.assetStorageRef(uid, archiveId, assetId, fileName).delete()
      }

      // delete the document
      sa.assetDocumentDbRef(uid, archiveId, assetId).delete()

      this.$router.push({ name: 'AdminShowArchive', params: { id: this.$route.params.archive_id }})

    }, 
    goBack() {
      this.$router.push({ name: 'AdminShowArchive', params: { id: this.$route.params.archive_id }})
    }           
  }
}
</script>
