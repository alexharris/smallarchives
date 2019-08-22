<template>
<div>
  <div class="row justify-content-center">
    <div class="col-12 col-md-11 pt-4">
      <h1 class="h3 float-left">Edit Item -</h1>
      <a :href="backUrlHref" class="btn btn-sm btn-transparent float-right close-item"><font-awesome-icon icon="times" size="1x" /></a>
      <!-- <a class="btn btn-sm btn-outline-primary float-right mr-2" :href="backUrlHref + '/' + itemId">View</a> -->
      <br />
    </div>
  </div>
  <div class="row justify-content-center">
    <div class="col-12 col-md-11">  
      <template v-if="errors.length > 0">
        <div class="alert alert-danger" role="alert" show>
          <ul>
            <li v-for="error in errors">{{error}}</li>
          </ul>
        </div>
      </template>      
      <div class="text-left">
        <p>
        <input type="checkbox" id="checkbox" v-model="helpSwitcherValue">
        <label for="checkbox" class="ml-2">Show field hints</label>
        </p>
      </div> 
      <div class="card">
        <div class="card-header">  
          <ul class="nav nav-pills card-header-pills" id="myTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" id="basic-tab" data-toggle="tab" href="#basic" role="tab" aria-controls="basic" aria-selected="true">Basic Info</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="media-tab" data-toggle="tab" href="#media" role="tab" aria-controls="media" aria-selected="false">Media</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="metadata-tab" data-toggle="tab" href="#metadata" role="tab" aria-controls="metadata" aria-selected="false">Metadata</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="admin-tab" data-toggle="tab" href="#admin" role="tab" aria-controls="metadata" aria-selected="false">Admin</a>
            </li>            
          </ul>
        </div>        
        <div class="card-body">
          <form class="needs-validation">
            <div id="myTabContent" class="tab-content my-2">     
              <!-- Start first tab -->
              <div class="tab-pane fade show active" id="basic" role="tabpanel" aria-labelledby="basic-tab"> 
                <!-- Title -->
                <div class="form-group row">
                  <label for="inputTitle" class="col-sm-2 col-form-label">Title *</label>
                  <div class="col-sm-10">
                    <input class="form-control" id="inputTitle" v-model="itemTitle">
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
                    <textarea class="form-control" id="inputDescription" v-model="itemDescription"></textarea>
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
                <!-- Featured image -->
                
                <div class="form-group row" >
                  <label for="selectImage" class="col-sm-2 col-form-label">Featured Image</label>
                  <div class="col-sm-10">
                    
                    <p>Select a featured image to display on the list and grid view: <br /><br />
                      <input type="file" id="selectImage" v-on:change="handleFeatureImageChange" v-bind:class="{'is-invalid': imageInvalid}">
                    </p>
                    <span v-if="itemFeatureImageName != ''"><strong>Current Featured Image:</strong> {{itemFeatureImageName}}</span><br />
                  </div>
                </div>                           

              </div> <!-- end first tab -->
              <!-- Start second tab -->
              <div class="tab-pane fade" id="media" role="tabpanel" aria-labelledby="media-tab">
                <!-- <h2 class="h5">Media Details</h2> -->
                <!-- <p><small>The media associated with this item is immutable for now. Delete this item and create a new one if a new media representation is needed.</small></p> -->
                <div class="row">
                  <!-- <div class="col-2">
                    Type
                  </div>
                  <div class="col-10">
                    {{itemMediaType}}
                  </div>        
                  <div class="col-2">
                    Media
                  </div> -->
                  <div class="col-12">
                    <AdminMediaUploader ref="mediaUploader" :itemId="this.itemId" />
                    <!-- <div v-if="itemMediaType == 'image'">
                      <img :src="itemSrc" />

                    </div>
                    <div v-if="itemMediaType == 'audio'">
                      <figure>
                          <audio
                              controls
                              :src="itemSrc">
                                  Your browser does not support the
                                  <code>audio</code> element.
                          </audio>
                      </figure>
                    </div>
                    <div v-if="itemMediaType == 'pdf'" class="pdf-download">
                      <p>{{itemFileName}}</p>
                      <a :href="itemSrc"><font-awesome-icon icon="file-download" size="6x" /> </a>
                    </div>        
                    <div v-if="itemMediaType === 'text'">
                      <p>{{itemText}}</p>
                    </div>
                    <div v-if="itemMediaType === 'youtube'" class="video-wrapper">         
                      <iframe width="560" height="315" v-bind:src="itemMediaYoutubeId" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>          
                    </div>                         -->
                  </div>
                </div>
              </div> <!-- end second tab -->
              <!-- Start third tab -->
              <div class="tab-pane fade" id="metadata" role="tabpanel" aria-labelledby="metadata-tab">
                <!-- Item Type -->
                <div class="form-group row">
                  <label for="inputItemType" class="col-sm-2 col-form-label">Item Type</label>
                  <div class="col-sm-10">
                    <select class="form-control" id="inputItemType" v-model="itemType">
                      <option value="Collection">Collection</option>
                      <option value="Dataset">Dataset</option>
                      <option value="Event">Event</option>
                      <option value="Image">Image</option>
                      <option value="Interactive Resource">Interactive Resource</option>
                      <option value="Moving Image">Moving Image</option>
                      <option value="Physical Object">Physical Object</option>
                      <option value="Service">Service</option>
                      <option value="Software">Software</option>
                      <option value="Sound">Sound</option>
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
                <h2 class="my-4 h5" v-if="customFields.length > 0">Custom Fields</h2>

                <!-- Custom Fields -->
                <div class="form-group row" v-for="field in customFields">
                  <label :for="'customField_' + field.customFieldName" class="col-sm-2 col-form-label">{{field.customFieldName}}</label>
                  <div class="col-sm-10">
                    <input class="form-control" :id="'customField_' + field.customFieldName" :ref="field.customFieldName" :value="field.customFieldValue">
                    <small v-if="helpSwitcherValue" class="help-text form-text text-muted">{{field.customFieldHint}}</small>
                  </div>
                </div>                
              </div> <!-- end third tab --> 
              <!-- Start fourth tab -->
              <div class="tab-pane fade" id="admin" role="tabpanel" aria-labelledby="admin-tab">
                <div class="row">
                  <div class="col-12">
                    <ul class="list-unstyled">
                      <li><strong>ID:</strong> {{this.itemId}}</li>
                    </ul>
                    <div class="card border-danger ml-0 bg-transparent">
                      <div class="card-header">Delete</div>
                      <div class="card-body">
                        <p>Warning: Deleting this item is permanent and you can't get it back</p>
                        <a class="btn btn-outline-danger" @click.stop="itemDelete()">Delete</a>
                      </div>
                    </div> 
                  </div>                     
                </div>
              </div> <!-- end fourth tab -->                     
            </div>        
            <SubmitButton v-on:submit="onSubmit" v-on:cancel="backUrl" :formIsLoading="isLoading" />
          </form>  
        </div>   
      </div>               
                
    </div>
  </div>
</div>
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'
import SubmitButton from '../components/SubmitButton'
import AdminMediaUploader from '../components/AdminMediaUploader'

export default {
  name: 'AdminEditItem',
  components: {
    SubmitButton,
    AdminMediaUploader
  },  
  data () {
    return {
      key: this.$route.params.id,
      itemTitle: '',
      itemFileName: '',
      itemDescription: '',
      itemFormat:'',
      itemIdentifier:'',
      itemLanguage:'',
      itemPublisher:'',
      itemRelation:'',
      itemRights:'',
      itemSource:'',
      itemSubject:'',
      itemContributor:'',
      itemCoverage:'',
      itemCoverageLat: '',
      itemCoverageLong: '',      
      itemCreator:'',
      itemDate:'',
      itemLocation:'',
      itemFeatureImage: '',
      itemFeatureImageName: '',
      itemOldFeatureImage: '',
      itemMediaFiles: [],
      newItemMediaFiles: [],
      itemMediaType:'',
      itemMediaYoutubeId:'',
      itemCreationDate:'',
      selecteditemMediaType: '',
      itemType: '',
      itemSrc: '',
      tags: [],
      selectedTags: [],
      customFields: [],
      uid: firebase.auth().currentUser.uid,
      archiveId: this.$route.params.archive_id,
      formErrors: false,
      isLoading: false,
      helpSwitcherValue: false,
      mediaInvalid: false,
      textInvalid: false,
      imageInvalid: false,
      pdfInvalid: false,
      youtubeInvalid: false,
      audioInvalid: false,
      backUrlHref: '/u/' + firebase.auth().currentUser.displayName + '/' + this.$route.params.archive_id,
      numberOfExistingItems: 0,
      itemId: '',
      errors: []
    }
  },
  created () {

      if (this.$route.params.item_id == null) {
        console.log('new')
        // load the tags
        this.getTags()
        // find out how many items there are
        sa.itemCollectionDbRef(this.uid, this.archiveId)
        .get()
        .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              this.numberOfExistingItems ++
            });
        }).then(() => {
          this.itemId = 'item_' + this.numberOfExistingItems
          console.log(this.itemId)
          this.$refs.mediaUploader.getExistingFiles(this.itemId)
        })
      } else {
        this.itemId = this.$route.params.item_id
        this.getExistingItemData()
      }        
  },
  methods: {    
    getExistingItemData() {

      // build the ref
      sa.itemDocumentDbRef(this.uid, this.archiveId, this.itemId).get().then((doc) => {
        if (doc.exists) {
          this.itemCreationDate = doc.data().itemCreationDate
          this.itemContributor = doc.data().itemContributor
          this.itemCoverage = doc.data().itemCoverage
          this.itemCreator = doc.data().itemCreator
          this.itemDate = doc.data().itemDate
          this.itemTitle = doc.data().itemTitle
          // this.itemFeatureImage = doc.data().itemFeatureImage
          this.itemFeatureImageName = doc.data().itemFeatureImageName
          this.itemFormat = doc.data().itemFormat
          this.itemIdentifier = doc.data().itemIdentifier
          this.itemLanguage = doc.data().itemLanguage
          this.itemPublisher = doc.data().itemPublisher
          this.itemRelation = doc.data().itemRelation
          this.itemRights = doc.data().itemRights
          this.itemSource = doc.data().itemSource
          this.itemSubject = doc.data().itemSubject
          this.itemCoverageLat = doc.data().itemCoverageLat
          this.itemCoverageLong = doc.data().itemCoverageLong
          this.itemId = doc.id
          this.itemText = doc.data().itemText
          this.itemDescription = doc.data().itemDescription
          this.itemMediaType = doc.data().itemMediaType
          this.itemType = doc.data().itemType
          if(Array.isArray(doc.data().tags)) { // check to see if there are any tags selected already, and if not, pass an empty array
            this.selectedTags = doc.data().tags // the tags stored on the item are the ones already selected for that item
          } else {
            this.selectedTags = [] // the tags stored on the item are the ones already selected for that item
          }
        
        } else {
          console.log("No such document!");
        }
      }).then(() => {
        // this.getItemSrc()
        // load the tags from the central source
        this.$refs.mediaUploader.getExistingFiles()
        this.getTags()
        this.getCustomFields()        
      });



    } ,  
    handleFeatureImageChange(e, index) {
      if(this.itemFeatureImageName != '') { // if the feature image is already set
        this.itemOldFeatureImage = this.itemFeatureImageName // move the value
        this.itemFeatureImage = e.target.files[0] // set it to new value
        this.itemFeatureImageName = e.target.files[0].name
      } else { // else
        this.itemFeatureImage = e.target.files[0] // just set it
        this.itemFeatureImageName = e.target.files[0].name
      }

      
    },   
    deleteOldFeatureImage() {
      // delete the legacy image and thumb derivative
      sa.itemFeatureStorageRef(this.uid, this.archiveId, this.itemId, this.itemOldFeatureImage, 'thumb_').delete()
      sa.itemFeatureStorageRef(this.uid, this.archiveId, this.itemId, this.itemOldFeatureImage, '').delete()
    },
    deleteCurrentFeatureImage() {
      // delete the current image and thumb derivative
      sa.itemFeatureStorageRef(this.uid, this.archiveId, this.itemId, this.itemFeatureImageName, 'thumb_').delete()
      sa.itemFeatureStorageRef(this.uid, this.archiveId, this.itemId, this.itemFeatureImageName, '').delete()
    },    
    addFeatureImage() { // Upload feature image to the DB
      if(this.itemOldFeatureImage != '') { //check to see if there is a new feature image
        this.deleteOldFeatureImage() //delete the old one
      }
      // add the new one
      sa.itemFeatureStorageRef(this.uid, this.archiveId, this.itemId, this.itemFeatureImage.name).put(this.itemFeatureImage).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });   

    },       
    getTags() {
      console.log('tags')
      this.tags = [];   

      sa.tagCollectionDbRef(this.uid, this.archiveId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.tags.push({
            tagTitle: doc.data().tagTitle
          });
        });
      });     
    },
    getCustomFields() {

      this.customFields = [];   
 
      sa.customFieldCollectionDbRef(this.uid, this.archiveId)
      .get()
      .then((querySnapshot) => {

        querySnapshot.forEach((doc) => {
          this.customFields.push({
            customFieldName: doc.id,
            customFieldType: doc.data().customFieldType,
            customFieldHint: doc.data().customFieldHint
          });
        });
      }).then(() => {
        this.getExistingCustomFieldsValues()
      })
    },  
    getExistingCustomFieldsValues() {

      sa.itemDocumentDbRef(this.uid, this.archiveId,this.itemId)
      .get()
      .then((doc) => {


        for(var i in doc.data().customFields) {
          console.log(i)
          var keyObj = Object.keys(doc.data().customFields[i])
          var key = keyObj[0]

          this.$refs[key][0].value = doc.data().customFields[i][key]
        }

      })
    },
    //
    addCustomFieldValues() {

      var customFieldsObj = [];
      this.customFields.forEach((field) => {
        customFieldsObj.push({
          [field.customFieldName]: this.$refs[field.customFieldName][0].value
        })
      })
      sa.itemDocumentDbRef(this.uid, this.archiveId,this.itemId).update({
        customFields: customFieldsObj
      })       

    },     
    checkForErrors () {
      // empty the error variable to get rid of old errors
      this.errors = []

      // check the form for completeness
      if (!this.itemTitle || this.itemTitle === '') { // title is mandatory
        this.errors.push('A title is required')
      }

      // if (!this.itemFeatureImageName || this.itemFeatureImageName === '') { // title is mandatory
      //   this.errors.push('A feature image is required')
      // }

      console.log(this.itemFeatureImage)
      if(this.itemFeatureImage != '') {
        if(this.itemFeatureImage.type.includes('image/') && this.itemFeatureImage.size > 1000000) { // image file size
            this.errors.push('The featured image is too big! Images must be under 1MB.')
        }
      }

    },             
    onSubmit () {

      this.checkForErrors();

      if(!(this.errors.length > 0)) {      
        this.addItemEditsToDB()
        this.addCustomFieldValues()
        if(this.itemFeatureImage != '') {
          this.addFeatureImage()
        }
      }
    },
    addItemEditsToDB () {

      if(!(this.errors.length < 0)) {

        this.isLoading = true
        // build the ref
        sa.itemDocumentDbRef(this.uid, this.archiveId, this.itemId).set({
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
          itemType: this.itemType,
          itemCreationDate: new Date(),
          itemFeatureImageName: this.itemFeatureImageName,
          tags: this.selectedTags
        }, { merge: true }).then(() => {
          this.$refs.mediaUploader.uploadFiles()
          console.log('item updated!')
          this.$router.push({ name: 'PublicArchive', params: { id: this.$route.params.archive_id, username: firebase.auth().currentUser.displayName }})
        })
      }
    },
    itemDelete() {

      // Needs to check and see if there are any media files to delete

     

      // delete the document
      sa.itemDocumentDbRef(this.uid, this.archiveId, this.itemId).delete()
      
      // delete the feature image
      this.deleteCurrentFeatureImage() 

      // reroute after delete
      this.$router.push({ name: 'PublicArchive', params: { id: this.$route.params.archive_id, username: firebase.auth().currentUser.displayName }})

    }, 
    backUrl() {
      this.$router.push({ name: 'PublicArchive', params: {username: firebase.auth().currentUser.displayName, id: this.$route.params.archive_id }})
    }           
  }
}
</script>
