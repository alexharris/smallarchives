<template>
    <div>
      <b-btn @click.stop="goBack" variant="dark">Back</b-btn>
      <hr class="my-4" />
      <template v-if="errors.length > 0">
        <b-alert variant="danger" show>
          <h3>Errors</h3>
          <ul>
            <li v-for="error in errors">{{error}}</li>
          </ul>
        </b-alert>
      </template>
      <h1>Add New Item</h1>
      <hr class="my-4" />
            <b-form>
<div class="container">
  <div class="row">
    <div class="col">
      <h2>Basic Info</h2> 
      <p>Basic info about this asset</p>
    </div>
    <div class="col-8">
        <b-form-group id="assetTitle"
                      :label-cols="4"
                      breakpoint="md"
                      label="Enter Title">
          <b-form-input id="assetTitle" v-model="assetTitle"></b-form-input>
        </b-form-group> 
        <b-form-group id="assetDescription"
                      :label-cols="4"
                      breakpoint="md"
                      label="Enter Description">
          <b-form-textarea id="assetDescription" v-model="assetDescription"></b-form-textarea>
        </b-form-group> 
    </div>
  </div>
  <hr class="my-4" />
  <div class="row">
    <div class="col">
      <h2>Media</h2> 
    </div>
    <div class="col-8">
        <b-form-group id="assetTitle"
                      :label-cols="4"
                      breakpoint="md"
                      label="Select Media Type">        
          <template>
            <div>
              <b-form-select v-model="selectedAssetMediaType">
                <!-- these options will appear after the ones from 'options' prop -->
                <option value="image">Image</option>
                <option value="audio">Audio</option>
                <option value="pdf">PDF</option>
                <option value="text">Text</option>
                <option value="youtube">Youtube</option>
              </b-form-select>
            </div>
          </template>   
        </b-form-group>      
        <b-form-group id="uploadAsset"
                      :label-cols="4"
                      breakpoint="md"
                      label="Upload Image" 
                      v-if="selectedAssetMediaType === 'image'">
          <b-form-file id="uploadAsset" v-model="file" placeholder="Choose a file..."></b-form-file>
        </b-form-group>
        <b-form-group id="uploadAsset"
                      :label-cols="4"
                      breakpoint="md"
                      label="Upload Audio Asset" 
                      v-if="selectedAssetMediaType === 'audio'">
          <b-form-file id="uploadAsset" v-model="file" placeholder="Choose a file..."></b-form-file>
        </b-form-group>  
        <b-form-group id="uploadAsset"
                      :label-cols="4"
                      breakpoint="md"
                      label="Upload PDF Asset" 
                      v-if="selectedAssetMediaType === 'pdf'">
          <b-form-file id="uploadAsset" v-model="file" placeholder="Choose a file..."></b-form-file>
        </b-form-group>                
        <b-form-group id="assetText"
                      :label-cols="4"
                      breakpoint="md"
                      label="Text"
                      v-if="selectedAssetMediaType === 'text'">
          <b-form-textarea id="assetText" v-model="text"></b-form-textarea>
        </b-form-group>
        <b-form-group id="assetYoutubeId"
                      :label-cols="4"
                      breakpoint="md"
                      label="Youtube Video ID"
                      v-if="selectedAssetMediaType === 'youtube'">
          <b-form-input id="assetText" v-model="assetYoutubeId"></b-form-input>
        </b-form-group> 
    </div>
  </div>  
  <hr class="my-4" />   
  <div class="row">
    <div class="col">
      <h2>Metadata</h2> 
    </div>
    <div class="col-8">
        <b-form-group id="assetType"
                      :label-cols="4"
                      breakpoint="md"
                      label="Select Asset Type">        
          <template>
            <div>
              <b-form-select v-model="selectedAssetType">
                <!-- these options will appear after the ones from 'options' prop -->
                <option value="collection">Collection</option>
                <option value="dataset">Dataset</option>
                <option value="event">Event</option>
                <option value="image">Image</option>
                <option value="interactiveresource">Interactive Resource</option>
                <option value="movingimage">Moving Image</option>
                <option value="physicalobject">Physical Object</option>
                <option value="service">Service</option>
                <option value="software">Software</option>
                <option value="sound">Sound</option>
                <option value="stillimage">Still Image</option>
                <option value="text">Text</option>
              </b-form-select>
            </div>
          </template>   
        </b-form-group>       
        <b-form-group id="assetLocation"
                      :label-cols="4"
                      breakpoint="md"
                      label="Enter Location">
          <b-form-input id="assetLocation" v-model="assetLocation"></b-form-input>
        
        
        </b-form-group> 
        <div class="form-row">
          <div class="col">
            <label for="inputEmail4">Latitude</label>
            <b-form-input id="assetLocation" v-model="assetLocationLat"></b-form-input>
          </div>
          <div class="col">
            <label for="inputEmail4">Longitude</label>
            <b-form-input id="assetLocation" v-model="assetLocationLong"></b-form-input>
          </div>
        </div>          
        <b-form-group id="assetContributor"
                      :label-cols="4"
                      breakpoint="md"
                      label="Contributor">
          <b-form-input id="assetContributor" v-model="assetContributor"></b-form-input>
        </b-form-group> 
    </div>
  </div>
</div>     
  <hr class="my-4" />         
  <div v-if="!loading">
    <b-btn variant="primary" @click.stop="onSubmit">Submit</b-btn>
  </div>
  <div v-else>
    <div class="spinner-border" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>
      </b-form>
    </div>    
  </template>
        

<script>

import firebase from 'firebase'
import sa from '../sa'

export default {
  name: 'AdminCreateAsset',
  data () {
    return {
      ref: '',
      errors: [],
      archive: {},
      uid: '',
      file: null,
      text: '',
      assetYoutubeId: '',
      customFieldLabel: '',
      assetTitle: null,
      assetDescription: '',
      selectedAssetMediaType: '',
      assetMediaType: '',
      assetCreationDate: '',
      selectedAssetType: '',
      assetType: '',
      assetLocation: '',
      assetLocationLat: '',
      assetLocationLong: '',
      assetContributor:'',
      formErrors: false,
      loading: null
    }
  },
  created() {
    var currentUser = firebase.auth().currentUser
    this.uid = currentUser.uid
  },  
  methods: {
    onSubmit (evt) {
      evt.preventDefault()




      // empty the error variable to get rid of old errors
      this.errors = []

      // check the form for completeness
      if (!this.assetTitle) { // title is mandatory
        this.errors.push('A title is required')
      } 

      if(this.selectedAssetMediaType === '') {
        this.errors.push('Media is required')
      }

      // TEXT ERRORS
      // A text item must have some text
      // Test to make sure HTML etc is escaped?
      // Set a character length?
      // Do links work?
      if(this.selectedAssetMediaType === 'text' && this.text === '') {
        this.errors.push('Media type "text" is selected, but no text is entered')
      }

      // IMAGE ERRORS
      // An image file must exist
      if(this.selectedAssetMediaType === 'image' && this.file === null) {
        this.errors.push('Media type "image" is selected, but no image is uploaded')
      }

      // It must be jpg, tif, png, or jpg
      if(this.selectedAssetMediaType == 'image') {
        if(this.file.type != 'image/jpeg' && this.file.type != 'image/tiff' && this.file.type != 'image/png' && this.file.type != 'image/gif') {
          this.errors.push('Image files must be one of the following types: JPG, TIF, PNG, GIF')
        }
      }   
      // Set a maximum filesize   
      if(this.selectedAssetMediaType === 'image' && this.file.size >= 5000000) {
        this.errors.push('Image files must be less than 5MB')
      }      

      // AUDIO ERRORS
      // Audo file must exist
      // It must be of type wav, mp3, ogg
      // Set a maximum filesize
      if(this.selectedAssetMediaType === 'audio' && this.file === null) {
        this.errors.push('Media type "audio" is selected, but no audio is uploaded')
      } 
      // Audio files must be less than 10MB in size
      if(this.selectedAssetMediaType === 'audio' && this.file.size >= 5000000) {
        this.errors.push('Audio files must be less than 5MB')
      }   

      // It must be wav, mp3, ogg, or m4a
      if(this.selectedAssetMediaType == 'audio') {
        if(this.file.type != 'audio/x-wav' && this.file.type != 'audio/x-m4a' && this.file.type != 'video/ogg' && this.file.type != 'audio/mpeg') {
          this.errors.push('Audio files must be one of the following types: WAV, MP3, OGG, M4A')
        }
      }  

      // NEED TO ADD
      // YOUTUBE ERRORS
      // PDF ERRORS           

      this.assetCreationDate = new Date();

      //-------------
      // UPLOAD IMAGE 
      //-------------


      
      if(!(this.errors.length > 0)) {

        this.loading = true
        
        // Check to see if a file has been uploaded
        if(this.file != null) {

          var file = this.file // use the Blob or File API
          var uid = this.uid
          var archiveId = this.$route.params.id
          var fileName = this.file.name
          // Check to see if a file exists before uploading, by trying to get the download URL
          sa.archiveStorageRef(uid, archiveId,'', fileName).getDownloadURL().then((url) => {
            // this means we got a URL, which means it exists, which means we throw an error
            this.errors.push('This archive already contains a file with this name!')
          }).catch((error) => {

            // but if a not found error message returns, it means it wasnt found, which means we should upload it

            var file = this.file // use the Blob or File API
            var uid = this.uid
            var archiveId = this.$route.params.archive_id
            var archiveId = this.$route.params.archive_id
            var fileName = this.file.name

            sa.assetStorageRef(uid, archiveId,'', fileName).put(file).then((snapshot) => {
              console.log('Uploaded a blob or file!');
              this.addArchiveDataToDatabase()
            });
          })
        } else {
          this.addArchiveDataToDatabase()
        }
      }   
    },
    addArchiveDataToDatabase() {

      //this is because sometimes there is no file, so we have to fake it
      var file = this.file

      if(file == null) {
        file = {}
        file.name = ''
      }

      var uid = this.uid
      var archiveId = this.$route.params.archive_id


      sa.assetCollectionDbRef(uid, archiveId).add({
        
        // DCMI Stuff
        assetTitle: this.assetTitle,
        assetDescription: this.assetDescription,
        assetContributor: this.assetContributor,
        assetType: this.selectedAssetType,

        // Media Stuff
        assetMediaType: this.selectedAssetMediaType,
        assetFileName: file.name,
        assetText: this.text,
        assetYoutubeId: this.assetYoutubeId,
        
        // Location Stuff
        assetLocation: this.assetLocation,
        assetLocationLat: this.assetLocationLat,
        assetLocationLong: this.assetLocationLong,

        // Other Stuff
        assetCreationDate: this.assetCreationDate
        
      }).catch((error) => {
        alert("Error adding document: ", error);
      }).then(() => {
        this.goBack()
      })


    },  
    goBack() {
      this.$router.push({ name: 'AdminShowArchive', params: { id: this.$route.params.id }})
    }    
  }
}
</script>