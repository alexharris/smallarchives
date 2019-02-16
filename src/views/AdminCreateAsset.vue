<template>
  <div>
    <div class="row">
      <div class="col-sm-9">
        <div class="btn btn-dark" @click.stop="goBack">Back</div>
      </div>
      <div class="col-sm-3">
        <switcher v-model="helpSwitcherValue" />    
      </div>
    </div>
    <hr class="my-4" />
    <template v-if="errors.length > 0">
      <div class="alert alert-danger" show>
        <h3>Errors</h3>
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </div>
    </template>
    <h1 class="h4">Add Item</h1>
    <hr class="my-4" />
    <form class="needs-validation">
      <div class="container">
            <!-- Title -->
            <div class="form-group row">
              <label for="inputTitle" class="col-sm-2 col-form-label">Title *</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputTitle" placeholder="Title" v-model="assetTitle" v-bind:class="{'is-invalid': titleInvalid}">
                <div class="invalid-feedback">
                  Please enter a title.
                </div>
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A name given to the resource.</small>
              </div>
            </div>
            <!-- Description -->
            <div class="form-group row">
              <label for="inputDescription" class="col-sm-2 col-form-label">Description</label>
              <div class="col-sm-10">
                <textarea class="form-control" id="inputDescription" placeholder="Description" v-model="assetDescription"></textarea>
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An account of the resource.</small>
              </div>
            </div>
            <hr class="my-4" />
            <!-- Media Type -->
            <div class="form-group row">
              <label for="inputMediaType" class="col-sm-2 col-form-label">Media Type *</label>
              <div class="col-sm-10">
                <select class="form-control" id="inputMediaType" v-model="selectedAssetMediaType" v-bind:class="{'is-invalid': mediaInvalid}">
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                  <option value="pdf">PDF</option>
                  <!-- <option value="text">Text</option> -->
                  <option value="youtube">Youtube</option>
                </select>
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A name given to the resource.</small>
              </div>
            </div> 
            <!-- Media Type - Image -->
            <div class="form-group row" v-if="selectedAssetMediaType === 'image'">
              <span class="col-sm-2"></span>
              <label for="selectImage" class="col-sm-2 col-form-label">Select Image</label>
              <div class="col-sm-8">
                <input type="file" id="selectImage" v-on:change="handleFileChange" v-bind:class="{'is-invalid': imageInvalid}">
              </div>
            </div>
            <!-- Media Type - Audio -->
            <div class="form-group row" v-if="selectedAssetMediaType === 'audio'">
              <span class="col-sm-2"></span>
              <label for="selectAudio" class="col-sm-2 col-form-label">Select Audio File</label>
              <div class="col-sm-8">
                <input type="file" id="selectAudio" v-on:change="handleFileChange" v-bind:class="{'is-invalid': audioInvalid}">
              </div>
            </div>
            <!-- Media Type - PDF -->
            <div class="form-group row" v-if="selectedAssetMediaType === 'pdf'">
              <span class="col-sm-2"></span>
              <label for="selectPdf" class="col-sm-2 col-form-label">Select PDF</label>
              <div class="col-sm-8">
                <input type="file" id="selectPdf" v-on:change="handleFileChange" v-bind:class="{'is-invalid': pdfInvalid}">
              </div>
            </div>
            <!-- Media Type - Text -->
            <div class="form-group row" v-if="selectedAssetMediaType === 'text'">
              <span class="col-sm-2"></span>
              <label for="selectText" class="col-sm-2 col-form-label">Text</label>
              <div class="col-sm-8">
                <textarea class="form-control" id="selectText" v-model="assetText" v-bind:class="{'is-invalid': textInvalid}"></textarea>
              </div>
            </div>
            <!-- Media Type - Youtube -->
            <div class="form-group row" v-if="selectedAssetMediaType === 'youtube'">
              <span class="col-sm-2"></span>
              <label for="selectYoutube" class="col-sm-2 col-form-label">Youtube Video ID</label>
              <div class="col-sm-8">
                <input class="form-control" id="selectYoutube" v-model="assetYoutubeId" v-bind:class="{'is-invalid': youtubeInvalid}" />
              </div>
            </div>                                                            
            <hr class="my-4" />             
            <!-- Asset Type -->
            <div class="form-group row">
              <label for="inputAssetType" class="col-sm-2 col-form-label">Asset Type</label>
              <div class="col-sm-10">
                <select class="form-control" id="inputAssetType" v-model="selectedAssetType">
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
                </select>
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A name given to the resource.</small>
              </div>
            </div> 
            <!-- Contributor -->
            <div class="form-group row">
              <label for="inputContributor" class="col-sm-2 col-form-label">Contributor</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputContributor" placeholder="Contributor" v-model="assetContributor">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An entity responsible for making contributions to the resource.</small>
              </div>
            </div>
            <!-- Date -->
            <div class="form-group row">
              <label for="inputDate" class="col-sm-2 col-form-label">Date</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputDate" placeholder="Date" v-model="assetDate">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A point or period of time associated with an event in the lifecycle of the resource.</small>
              </div>
            </div>
            <!-- Coverage -->
            <div class="form-group row">
              <label for="inputCoverage" class="col-sm-2 col-form-label">Coverage</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputCoverage" placeholder="Coverage" v-model="assetCoverage">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">The spatial or temporal topic of the resource, the spatial applicability of the resource, or the jurisdiction under which the resource is relevant.</small>
              </div>
            </div> 
            <div class="form-row">
              <div class="col-sm-2">&nbsp;</div>
              <div class="form-group col-md-5">
                <label for="inputLatitude">Latitude</label>
                <input class="form-control" id="inputLatitude" v-model="assetCoverageLat" placeholder="Latitude">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">Latitude.</small>
              </div>
              <div class="form-group col-md-5">
                <label for="inputLongitude">Longitude</label>
                <input class="form-control" id="inputLongitude" v-model="assetCoverageLong" plcaeholder="Longitude">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">Longitude.</small>
              </div>
            </div>                        
            <!-- Creator -->
            <div class="form-group row">
              <label for="inputCreator" class="col-sm-2 col-form-label">Creator</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputCreator" placeholder="Creator" v-model="assetCreator">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An entity primarily responsible for making the resource.</small>
              </div>
            </div>  
            <!-- Format -->
            <div class="form-group row">
              <label for="inputFormat" class="col-sm-2 col-form-label">Format</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputFormat" placeholder="Format" v-model="assetFormat">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">The file format, physical medium, or dimensions of the resource.</small>
              </div>
            </div>
            <!-- Identifier -->
            <div class="form-group row">
              <label for="inputIdentifier" class="col-sm-2 col-form-label">Identifier</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputIdentifier" placeholder="Identifier" v-model="assetIdentifier">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An unambiguous reference to the resource within a given context.</small>
              </div>
            </div>
            <!-- Language -->
            <div class="form-group row">
              <label for="inputLanguage" class="col-sm-2 col-form-label">Language</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputLanguage" placeholder="Language" v-model="assetLanguage">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A language of the resource.</small>
              </div>
            </div>
            <!-- Publisher -->
            <div class="form-group row">
              <label for="inputPublisher" class="col-sm-2 col-form-label">Publisher</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputPublisher" placeholder="Publisher" v-model="assetPublisher">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An entity responsible for making the resource available.</small>
              </div>
            </div>
            <!-- Relation -->
            <div class="form-group row">
              <label for="inputRelation" class="col-sm-2 col-form-label">Relation</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputRelation" placeholder="Relation" v-model="assetRelation">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A related resource.</small>
              </div>
            </div>
            <!-- Rights -->
            <div class="form-group row">
              <label for="inputRights" class="col-sm-2 col-form-label">Rights</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputRights" placeholder="Rights" v-model="assetRights">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">Information about rights held in and over the resource.</small>
              </div>
            </div>
            <!-- Source -->
            <div class="form-group row">
              <label for="inputSource" class="col-sm-2 col-form-label">Source</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputSource" placeholder="Source" v-model="assetSource">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A related resource from which the described resource is derived.</small>
              </div>
            </div> 
            <!-- Subject -->
            <div class="form-group row">
              <label for="inputSubject" class="col-sm-2 col-form-label">Subject</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputSubject" placeholder="Subject" v-model="assetSubject">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">The topic of the resource.</small>
              </div>
            </div>                                                                                                          
       </div>
<div v-if="!loading">
  <hr class="my-4" />
  <div class="btn btn-primary btn-lg" @click.stop="onSubmit">Submit</div>
</div>
<div v-else>
  <div class="spinner-border" role="status">
    <span class="sr-only">Loading...</span>
  </div>
</div>
</form>
</div>    
</template>


<script>

  import firebase from 'firebase'
  import sa from '../sa'
  import Switcher from '../components/Switcher'

  export default {
    name: 'AdminCreateAsset',
    components: {
      Switcher
    },
    data () {
      return {
        ref: '',
        errors: [],
        archive: {},
        uid: '',
        file: null,
        assetText: '',
        assetYoutubeId: '',
        customFieldLabel: '',
        assetTitle: null,
        assetDescription: '',
        selectedAssetMediaType: '',
        assetMediaType: '',
        assetCreationDate: '',
        selectedAssetType: '',
        assetType: '',
        assetCoverageLat: '',
        assetCoverageLong: '',
        assetContributor:'',
        assetDate:'',
        assetCoverage:'',
        assetCreator:'',
        assetFormat:'',
        assetIdentifier:'',
        assetLanguage:'',
        assetPublisher:'',
        assetRelation:'',
        assetRights:'',
        assetSource:'',
        assetSubject:'',
        formErrors: false,
        loading: null,
        helpSwitcherValue: false,
        titleInvalid: false,
        mediaInvalid: false,
        textInvalid: false,
        imageInvalid: false,
        pdfInvalid: false,
        youtubeInvalid: false,
        audioInvalid: false
      }
    },
    created() {
      var currentUser = firebase.auth().currentUser
      this.uid = currentUser.uid
    },  
    methods: {
      handleFileChange(e, index) {
        this.file = e.target.files[0]
      },      
      onSubmit (evt) {
        evt.preventDefault()

      // empty the error variable to get rid of old errors
      this.errors = []

      // check the form for completeness
      if (!this.assetTitle) { // title is mandatory
        this.errors.push('A title is required')
        this.titleInvalid = true
      }  else {
        this.titleInvalid = false
      }

      if(this.selectedAssetMediaType === '') {
        this.errors.push('Media is required')
        this.mediaInvalid = true
      } else {
        this.mediaInvalid = false
      }

      // TEXT ERRORS
      // A text item must have some text
      // Test to make sure HTML etc is escaped?
      // Set a character length?
      // Do links work?
      if(this.selectedAssetMediaType === 'text' && this.text === '') {
        console.log('oops')
        this.errors.push('Media type "text" is selected, but no text is entered')
        this.textInvalid = true
      }  else {
        this.textInvalid = false
      }

      // IMAGE ERRORS
      // An image file must exist
      if(this.selectedAssetMediaType === 'image' && this.file === null) {
        this.errors.push('Media type "image" is selected, but no image is uploaded')
        this.imageInvalid = true
      }  else {
        this.imageInvalid = false
      }

      // It must be jpg, tif, png, or jpg

      if(this.selectedAssetMediaType === 'image' && this.file.type != null) {
        if(this.file.type != 'image/jpeg' && this.file.type != 'image/tiff' && this.file.type != 'image/png' && this.file.type != 'image/gif') {
          this.errors.push('Image files must be one of the following types: JPG, TIF, PNG, GIF')
          this.imageInvalid = true
        }  else {
          this.imageInvalid = false
        }
      }   

      // Set a maximum filesize   
      if(this.selectedAssetMediaType === 'image' && this.file.size >= 5000000) {
        this.errors.push('Image files must be less than 5MB')
        this.imageInvalid = true
      }  else {
        this.imageInvalid = false
      }     

      // AUDIO ERRORS
      // Audo file must exist
      // It must be of type wav, mp3, ogg
      // Set a maximum filesize
      if(this.selectedAssetMediaType === 'audio' && this.file === null) {
        this.errors.push('Media type "audio" is selected, but no audio is uploaded')
        this.audioInvalid = true
      }  else {
        this.audioInvalid = false
      } 

      // Audio files must be less than 10MB in size
      if(this.selectedAssetMediaType === 'audio' && this.file.size >= 5000000) {
        this.errors.push('Audio files must be less than 5MB')
        this.audioInvalid = true
      }  else {
        this.audioInvalid = false
      }

      // It must be wav, mp3, ogg, or m4a
      if(this.selectedAssetMediaType == 'audio') {
        if(this.file.type != 'audio/x-wav' && this.file.type != 'audio/x-m4a' && this.file.type != 'video/ogg' && this.file.type != 'audio/mpeg') {
          this.errors.push('Audio files must be one of the following types: WAV, MP3, OGG, M4A')
          this.audioInvalid = true
        }  else {
          this.audioInvalid = false
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


      // Keep track of the number of items this user has
      var numberOfItems;
      sa.userArchivesDocumentDbRef(uid).get().then(function(doc) {
          if (doc.exists) {
              numberOfItems = doc.data().numberOfItems + 1
              console.log(numberOfItems)
          } else {
              // doc.data() will be undefined in this case
              console.log("No such document!");
          }
      }).then(() => {
        sa.userArchivesDocumentDbRef(uid).set({
          numberOfItems: numberOfItems
        })        
      }).catch(function(error) {
          console.log("Error getting document:", error);
      });







      sa.assetCollectionDbRef(uid, archiveId).add({

        // DCMI Stuff
        assetTitle: this.assetTitle,
        assetDescription: this.assetDescription,
        assetContributor: this.assetContributor,
        assetCoverage: this.assetCoverage,
        assetCoverageLat: this.assetCoverageLat,
        assetCoverageLong: this.assetCoverageLong,        
        assetCreator: this.assetCreator,
        assetDate: this.assetDate,
        assetFormat: this.assetFormat,
        assetIdentifier: this.assetIdentifier,
        assetLanguage: this.assetLanguage,
        assetPublisher: this.assetPublisher,
        assetRelation: this.assetRelation,
        assetRights: this.assetRights,
        assetSource: this.assetSource,
        assetSubject: this.assetSubject,
        assetType: this.selectedAssetType,

        // Media Stuff
        assetMediaType: this.selectedAssetMediaType,
        assetFileName: file.name,
        assetText: this.assetText,
        assetYoutubeId: this.assetYoutubeId,

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

