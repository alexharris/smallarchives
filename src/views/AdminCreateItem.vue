<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-11 pt-4">     
      <template v-if="errors.length > 0">
        <div class="alert alert-danger" show>
          <h3>Errors</h3>
          <ul>
            <li v-for="error in errors">{{error}}</li>
          </ul>
        </div>
      </template>
      <h1 class="h4">Add New Item</h1>
      <hr class="my-4" />
      <div>
        <input type="checkbox" id="checkbox" v-model="helpSwitcherValue">
        <label for="checkbox" class="ml-2">Show field hints</label>
      </div>        
      <ul class="nav nav-tabs my-5" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="basic-tab" data-toggle="tab" href="#basic" role="tab" aria-controls="basic" aria-selected="true">Basic Info</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="media-tab" data-toggle="tab" href="#media" role="tab" aria-controls="media" aria-selected="false">Media</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="metadata-tab" data-toggle="tab" href="#metadata" role="tab" aria-controls="metadata" aria-selected="false">Metadata</a>
        </li>
      </ul>
      <form class="needs-validation">
        <div id="myTabContent" class="tab-content my-5">
          <div class="tab-pane fade show active" id="basic" role="tabpanel" aria-labelledby="basic-tab">
            <!-- Title -->
            <div class="form-group row">
              <label for="inputTitle" class="col-sm-2 col-form-label">Title *</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputTitle" placeholder="Title" v-model="itemTitle" v-bind:class="{'is-invalid': titleInvalid}">
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
                <textarea class="form-control" id="inputDescription" placeholder="Description" v-model="itemDescription"></textarea>
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An account of the resource.</small>
              </div>
            </div>  
            <!-- Tags -->
            <div class="form-group row">
              <label for="inputTags" class="col-sm-2 col-form-label">Tags</label>
              <div class="col-sm-10">
                <select class="form-control" id="inputTags" multiple v-model="selectedTags">
                  <option v-for="tag in tags">{{tag.tagTitle}}</option>
                </select>
                <small class="help-text form-text text-muted">Tags allow you to draw connections between separate items. Get started by editing the archive and adding the tags you want to use. They will then appear here and you can select which ones apply to each item.</small>
              </div>
            </div>                      
          </div>
          <div class="tab-pane fade" id="media" role="tabpanel" aria-labelledby="media-tab">
            <!-- Media Type -->
            <div class="form-group row">
              <label for="inputMediaType" class="col-sm-2 col-form-label">Media Type *</label>
              <div class="col-sm-10">
                <select class="form-control" id="inputMediaType" v-model="selecteditemMediaType" v-bind:class="{'is-invalid': mediaInvalid}">
                  <option value="image">Image</option>
                  <option value="audio">Audio</option>
                  <option value="pdf">PDF</option>
                  <!-- <option value="text">Text</option> -->
                  <option value="youtube">Youtube</option>
                </select>
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">The media used to represent this resource.</small>
              </div>
            </div> 
            <!-- Media Type - Image -->
            <div class="form-group row" v-if="selecteditemMediaType === 'image'">
              <span class="col-sm-2"></span>
              <label for="selectImage" class="col-sm-2 col-form-label">Select Image</label>
              <div class="col-sm-8">
                <input type="file" id="selectImage" v-on:change="handleFileChange" v-bind:class="{'is-invalid': imageInvalid}">
              </div>
            </div>
            <!-- Media Type - Audio -->
            <div class="form-group row" v-if="selecteditemMediaType === 'audio'">
              <span class="col-sm-2"></span>
              <label for="selectAudio" class="col-sm-2 col-form-label">Select Audio File</label>
              <div class="col-sm-8">
                <input type="file" id="selectAudio" v-on:change="handleFileChange" v-bind:class="{'is-invalid': audioInvalid}">
              </div>
            </div>
            <!-- Media Type - PDF -->
            <div class="form-group row" v-if="selecteditemMediaType === 'pdf'">
              <span class="col-sm-2"></span>
              <label for="selectPdf" class="col-sm-2 col-form-label">Select PDF</label>
              <div class="col-sm-8">
                <input type="file" id="selectPdf" v-on:change="handleFileChange" v-bind:class="{'is-invalid': pdfInvalid}">
              </div>
            </div>
            <!-- Media Type - Text -->
            <div class="form-group row" v-if="selecteditemMediaType === 'text'">
              <span class="col-sm-2"></span>
              <label for="selectText" class="col-sm-2 col-form-label">Text</label>
              <div class="col-sm-8">
                <textarea class="form-control" id="selectText" v-model="itemText" v-bind:class="{'is-invalid': textInvalid}"></textarea>
              </div>
            </div>
            <!-- Media Type - Youtube -->
            <div class="form-group row" v-if="selecteditemMediaType === 'youtube'">
              <span class="col-sm-2"></span>
              <label for="selectYoutube" class="col-sm-2 col-form-label">Youtube Video ID</label>
              <div class="col-sm-8">
                <input class="form-control" id="selectYoutube" v-model="itemMediaYoutubeId" v-bind:class="{'is-invalid': youtubeInvalid}" />
              </div>
            </div>           
          </div>
          <div class="tab-pane fade" id="metadata" role="tabpanel" aria-labelledby="metadata-tab">
            <!-- Item Type -->
            <div class="form-group row">
              <label for="inputItemType" class="col-sm-2 col-form-label">Item Type</label>
              <div class="col-sm-10">
                <select class="form-control" id="inputItemType" v-model="selectedItemType">
                  <option value="Collection">Collection</option>
                  <option value="Dataset">Dataset</option>
                  <option value="Event">Event</option>
                  <option value="Image">Image</option>
                  <option value="Interactive Resource">Interactive Resource</option>
                  <option value="Moving Image">Moving Image</option>
                  <option value="Physical Object">Physical Object</option>
                  <option value="Service">Service</option>
                  <option value="Software">Software</option>
                  <option value="Sound ">Sound</option>
                  <option value="Still Image">Still Image</option>
                  <option value="Text">Text</option>
                </select>
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">The nature or genre of the resource.</small>
              </div>
            </div> 
            <!-- Contributor -->
            <div class="form-group row">
              <label for="inputContributor" class="col-sm-2 col-form-label">Contributor</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputContributor" v-model="itemContributor">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An entity responsible for making contributions to the resource.</small>
              </div>
            </div>
            <!-- Date -->
            <div class="form-group row">
              <label for="inputDate" class="col-sm-2 col-form-label">Date</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputDate" v-model="itemDate">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A point or period of time associated with an event in the lifecycle of the resource.</small>
              </div>
            </div>
            <!-- Coverage -->
            <div class="form-group row">
              <label for="inputCoverage" class="col-sm-2 col-form-label">Coverage</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputCoverage" v-model="itemCoverage">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">The spatial or temporal topic of the resource, the spatial applicability of the resource, or the jurisdiction under which the resource is relevant.</small>
              </div>
            </div> 
            <div class="form-row">
              <div class="col-sm-2">&nbsp;</div>
              <div class="form-group col-md-5">
                <label for="inputLatitude">Latitude</label>
                <input class="form-control" id="inputLatitude" v-model="itemCoverageLat">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">Latitude.</small>
              </div>
              <div class="form-group col-md-5">
                <label for="inputLongitude">Longitude</label>
                <input class="form-control" id="inputLongitude" v-model="itemCoverageLong">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">Longitude.</small>
              </div>
            </div>                        
            <!-- Creator -->
            <div class="form-group row">
              <label for="inputCreator" class="col-sm-2 col-form-label">Creator</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputCreator" v-model="itemCreator">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An entity primarily responsible for making the resource.</small>
              </div>
            </div>  
            <!-- Format -->
            <div class="form-group row">
              <label for="inputFormat" class="col-sm-2 col-form-label">Format</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputFormat" v-model="itemFormat">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">The file format, physical medium, or dimensions of the resource.</small>
              </div>
            </div>
            <!-- Identifier -->
            <div class="form-group row">
              <label for="inputIdentifier" class="col-sm-2 col-form-label">Identifier</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputIdentifier" v-model="itemIdentifier">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An unambiguous reference to the resource within a given context.</small>
              </div>
            </div>
            <!-- Language -->
            <div class="form-group row">
              <label for="inputLanguage" class="col-sm-2 col-form-label">Language</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputLanguage" v-model="itemLanguage">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A language of the resource.</small>
              </div>
            </div>
            <!-- Publisher -->
            <div class="form-group row">
              <label for="inputPublisher" class="col-sm-2 col-form-label">Publisher</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputPublisher" v-model="itemPublisher">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">An entity responsible for making the resource available.</small>
              </div>
            </div>
            <!-- Relation -->
            <div class="form-group row">
              <label for="inputRelation" class="col-sm-2 col-form-label">Relation</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputRelation" v-model="itemRelation">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A related resource.</small>
              </div>
            </div>
            <!-- Rights -->
            <div class="form-group row">
              <label for="inputRights" class="col-sm-2 col-form-label">Rights</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputRights" v-model="itemRights">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">Information about rights held in and over the resource.</small>
              </div>
            </div>
            <!-- Source -->
            <div class="form-group row">
              <label for="inputSource" class="col-sm-2 col-form-label">Source</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputSource" v-model="itemSource">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A related resource from which the described resource is derived.</small>
              </div>
            </div> 
            <!-- Subject -->
            <div class="form-group row">
              <label for="inputSubject" class="col-sm-2 col-form-label">Subject</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputSubject" v-model="itemSubject">
                <small v-if="helpSwitcherValue" class="help-text form-text text-muted">The topic of the resource.</small>
              </div>
            </div>            
          </div>
        </div>   
        <!-- Submit -->
        <SubmitButton v-on:submit="onSubmit" v-on:cancel="goBack" />    
      </form>
    </div>
  </div>    
</template>


<script>

  import firebase from 'firebase'
  import sa from '../sa'
  import SubmitButton from '../components/SubmitButton'

  export default {
    name: 'AdminCreateItem',
    components: {
      SubmitButton
    },
    data () {
      return {
        ref: '',
        errors: [],
        archive: {},
        uid: '',
        file: null,
        itemText: '',
        itemMediaYoutubeId: '',
        customFieldLabel: '',
        itemTitle: null,
        itemDescription: '',
        selecteditemMediaType: '',
        itemMediaType: '',
        itemCreationDate: '',
        selectedItemType: '',
        itemType: '',
        itemCoverageLat: '',
        itemCoverageLong: '',
        itemContributor:'',
        itemDate:'',
        itemCoverage:'',
        itemCreator:'',
        itemFormat:'',
        itemIdentifier:'',
        itemLanguage:'',
        itemPublisher:'',
        itemRelation:'',
        itemRights:'',
        itemSource:'',
        itemSubject:'',
        formErrors: false,
        loading: null,
        helpSwitcherValue: false,
        titleInvalid: false,
        mediaInvalid: false,
        textInvalid: false,
        imageInvalid: false,
        pdfInvalid: false,
        youtubeInvalid: false,
        audioInvalid: false,
        tags: [],
        selectedTags: []
      }
    },
    created() {
      var currentUser = firebase.auth().currentUser
      this.uid = currentUser.uid
      // load the tags from the central source
      this.getTags()
    },  
    methods: {
      handleFileChange(e, index) {
        this.file = e.target.files[0]
      },   
      getTags() {
        var uid = firebase.auth().currentUser.uid
        var archiveId = this.$route.params.archive_id 
        this.tags = [];   

        sa.tagCollectionDbRef(uid,archiveId)
        .get()
        .then((querySnapshot) => {

          querySnapshot.forEach((doc) => {
            this.tags.push({
              tagTitle: doc.data().tagTitle
            });
          });
        });     
      },          
      onSubmit () {

      // empty the error variable to get rid of old errors
      this.errors = []

      // check the form for completeness
      if (!this.itemTitle || this.itemTitle === '') { // title is mandatory
        this.errors.push('A title is required')
        this.titleInvalid = true
      }  else {
        this.titleInvalid = false
      }

      if(this.selecteditemMediaType === '') {
        this.errors.push('Media Type is required')
        this.mediaInvalid = true
      } else {
        this.mediaInvalid = false
      }

      // TEXT ERRORS
      // A text item must have some text
      // Test to make sure HTML etc is escaped?
      // Set a character length?
      // Do links work?
      if(this.selecteditemMediaType === 'text' && this.text === '') {
        console.log('oops')
        this.errors.push('Media type "text" is selected, but no text is entered')
        this.textInvalid = true
      }  else {
        this.textInvalid = false
      }

      // IMAGE ERRORS
      // An image file must exist
      if(this.selecteditemMediaType === 'image' && this.file === null) {
        this.errors.push('Media type "image" is selected, but no image is uploaded')
        this.imageInvalid = true
      }  else {
        this.imageInvalid = false
      }

      // It must be jpg, tif, png, or jpg

      if(this.selecteditemMediaType === 'image' && this.file.type != null) {
        if(this.file.type != 'image/jpeg' && this.file.type != 'image/tiff' && this.file.type != 'image/png' && this.file.type != 'image/gif') {
          this.errors.push('Image files must be one of the following types: JPG, TIF, PNG, GIF')
          this.imageInvalid = true
        }  else {
          this.imageInvalid = false
        }
      }   

      // Set a maximum filesize   
      if(this.selecteditemMediaType === 'image' && this.file.size >= 5000000) {
        this.errors.push('Image files must be less than 5MB')
        this.imageInvalid = true
      }  else {
        this.imageInvalid = false
      }     

      // AUDIO ERRORS
      // Audo file must exist
      // It must be of type wav, mp3, ogg
      // Set a maximum filesize
      if(this.selecteditemMediaType === 'audio' && this.file === null) {
        this.errors.push('Media type "audio" is selected, but no audio is uploaded')
        this.audioInvalid = true
      }  else {
        this.audioInvalid = false
      } 

      // Audio files must be less than 5MB in size
      if(this.selecteditemMediaType === 'audio' && this.file.size >= 5000000) {
        this.errors.push('Audio files must be less than 5MB')
        this.audioInvalid = true
      }  else {
        this.audioInvalid = false
      }

      // It must be wav, mp3, ogg, or m4a
      if(this.selecteditemMediaType == 'audio') {
        if(this.file.type != 'audio/x-wav' && this.file.type != 'audio/x-m4a' && this.file.type != 'video/ogg' && this.file.type != 'audio/mpeg') {
          this.errors.push('Audio files must be one of the following types: WAV, MP3, OGG, M4A')
          this.audioInvalid = true
        }  else {
          this.audioInvalid = false
        }
      }  

      // PDF ERRORS
      // PDF file must exist
      // It must be of type PDF
      // Set a maximum filesize
      if(this.selecteditemMediaType === 'pdf' && this.file === null) {
        this.errors.push('Media type "PDF" is selected, but no pdf is uploaded')
        this.pdfInvalid = true
      }  else {
        this.pdfInvalid = false
      } 

      // PDF files must be less than 5MB in size
      if(this.selecteditemMediaType === 'pdf' && this.file.size >= 5000000) {
        this.errors.push('PDFs must be less than 10MB')
        this.pdfInvalid = true
      }  else {
        this.pdfInvalid = false
      }

      // It must be PDF
      if(this.selecteditemMediaType == 'pdf') {
        if(this.file.type != 'application/pdf') {
          this.errors.push('The uploaded file must be a PDF')
          this.pdfInvalid = true
        }  else {
          this.pdfInvalid = false
        }
      }        

      // NEED TO ADD
      // YOUTUBE ERRORS    

      this.itemCreationDate = new Date();

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

            sa.itemStorageRef(uid, archiveId,'', fileName).put(file).then((snapshot) => {
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

      sa.itemCollectionDbRef(uid, archiveId).add({

        // DCMI Stuff
        itemTitle: this.itemTitle,
        itemDescription: this.itemDescription,
        itemContributor: this.itemContributor,
        itemCoverage: this.itemCoverage,
        itemCoverageLat: this.itemCoverageLat,
        itemCoverageLong: this.itemCoverageLong,        
        itemCreator: this.itemCreator,
        itemDate: this.itemDate,
        itemFormat: this.itemFormat,
        itemIdentifier: this.itemIdentifier,
        itemLanguage: this.itemLanguage,
        itemPublisher: this.itemPublisher,
        itemRelation: this.itemRelation,
        itemRights: this.itemRights,
        itemSource: this.itemSource,
        itemSubject: this.itemSubject,
        itemType: this.selectedItemType,

        // Media Stuff
        itemMediaType: this.selecteditemMediaType,
        itemFileName: file.name,
        itemText: this.itemText,
        itemMediaYoutubeId: this.itemMediaYoutubeId,

        // Other Stuff
        itemCreationDate: this.itemCreationDate,
        tags: this.selectedTags

      }).catch((error) => {
        alert("Error adding document: ", error);
      }).then(() => {
        this.goBack()
      })





    },  
    goBack() {
      this.$router.push({ name: 'PublicArchive', params: { id: this.$route.params.id, username: firebase.auth().currentUser.displayName }})
    }    
  }
}
</script>

