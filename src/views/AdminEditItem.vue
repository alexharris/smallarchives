<template>
  <div class="row justify-content-center">
    <div class="col-12 col-md-11 pt-4">
      
      <h1 class="h4">Edit Item</h1>  
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
        <!-- Start first tab -->
        <div class="tab-pane fade show active" id="basic" role="tabpanel" aria-labelledby="basic-tab"> 
          <h2 class="h5">Basic Info</h2>
          <!-- Title -->
          <div class="form-group row">
            <label for="inputTitle" class="col-sm-2 col-form-label">Title *</label>
            <div class="col-sm-10">
              <input class="form-control" id="inputTitle" v-model="itemTitle" v-bind:class="{'is-invalid': titleInvalid}">
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

        </div> <!-- end first tab -->
        <!-- Start second tab -->
        <div class="tab-pane fade" id="media" role="tabpanel" aria-labelledby="media-tab">
          <h2 class="h5">Media Details</h2>
          <p><small>The media associated with this item is immutable for now. Delete this item and create a new one if a new media representation is needed.</small></p>
          <div class="row">
            <div class="col-2">
              Type
            </div>
            <div class="col-10">
              {{itemMediaType}}
            </div>        
            <div class="col-2">
              Media
            </div>
            <div class="col-10">

              <div v-if="itemMediaType == 'image'">
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
              </div>                        
            </div>
          </div>
        </div> <!-- end second tab -->
        <!-- Start third tab -->
        <div class="tab-pane fade" id="metadata" role="tabpanel" aria-labelledby="metadata-tab">
          <h2 class="h5 my-4">Metadata</h2>
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
              <small v-if="helpSwitcherValue" class="help-text form-text text-muted">A name given to the resource.</small>
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
          <h2 class="my-4 h5">Custom Fields</h2>
          <!-- Custom Fields -->
          <div class="form-group row" v-for="field in customFields">
            <label :for="'customField_' + field.customFieldName" class="col-sm-2 col-form-label">{{field.customFieldName}}</label>
            <div class="col-sm-10">
              <input class="form-control" :id="'customField_' + field.customFieldName" :ref="field.customFieldName" :value="field.customFieldValue">
              <small v-if="helpSwitcherValue" class="help-text form-text text-muted">{{field.customFieldHint}}</small>
            </div>
          </div>                
        </div> <!-- end third tab -->        
      </div>        
            
      <SubmitButton v-on:submit="onSubmit" v-on:cancel="backUrl" />
      
        </form>                      
        <hr class="my-4" />  
        <div class="col-12" >
          <div class=" card-deck">
            <!--  Card one -->
            <div class="card ml-0 bg-transparent">
              <div class="card-header">Item Info</div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li><strong>Created:</strong> {{itemCreationDate}}</li>
                  <li><strong>ID:</strong> {{this.$route.params.item_id}}</li>
                </ul>
              </div>
            </div>
            <!-- Card two -->
            <div class="card border-danger ml-0 bg-transparent">
              <div class="card-header">Delete</div>
              <div class="card-body">
                <p>Warning: Deleting this item is permanent and you can't get it back</p>
                <a class="btn btn-outline-danger" @click.stop="itemDelete(itemId)">Delete</a>
              </div>
            </div> 
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

export default {
  name: 'AdminEditItem',
  components: {
    SubmitButton
  },  
  data () {
    return {
      key: this.$route.params.id,
      itemTitle: '',
      itemFileName: '',
      itemId: '',
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
      itemMediaType:'',
      itemMediaYoutubeId:'',
      itemCreationDate:'',
      selecteditemMediaType: '',
      itemType: '',
      itemSrc: '',
      tags: [],
      selectedTags: [],
      customFields: [],
      uid: '',
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
    }
  },
  created () {
    //-------------
    // Get the initial data
    //-------------

    var uid = firebase.auth().currentUser.uid
    var archiveId = this.$route.params.archive_id
    var itemId = this.$route.params.item_id

    // build the ref
    sa.itemDocumentDbRef(uid, archiveId, itemId).get().then((doc) => {
      if (doc.exists) {
        this.itemCreationDate = sa.getFormattedDate(doc.data().itemCreationDate)
        this.itemContributor = doc.data().itemContributor
        this.itemCoverage = doc.data().itemCoverage
        this.itemCreator = doc.data().itemCreator
        this.itemDate = doc.data().itemDate
        this.itemTitle = doc.data().itemTitle
        this.itemFileName = doc.data().itemFileName
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
      this.getItemSrc()
    });

    // load the tags from the central source
    this.getTags()
    this.getCustomFields()

    

  },
  methods: {
    getItemSrc() {

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      var itemId = this.$route.params.item_id
      var fileName = this.itemFileName

      sa.itemStorageRef(uid, archiveId, itemId, fileName, 'thumb_').getDownloadURL().then((url) => {
        this.itemSrc = url
      }).catch(function(error) {
        console.log(error.message)
      })
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
    getCustomFields() {
      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id 
      this.customFields = [];   

      sa.customFieldCollectionDbRef(uid,archiveId)
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


      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id

      sa.itemDocumentDbRef(uid,archiveId,this.$route.params.item_id)
      .get()
      .then((doc) => {


        
        for(var i in doc.data().customFields) {
          var keyObj = Object.keys(doc.data().customFields[i])
          var key = keyObj[0]

          this.$refs[key][0].value = doc.data().customFields[i][key]
        }
          // this.customFields.push({
          //   customFieldName: doc.id,
          //   customFieldType: doc.data().customFieldType
          // });
      })
    },
    //
    addCustomFieldValues() {
      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id

      var customFieldsObj = [];
      this.customFields.forEach((field) => {
        customFieldsObj.push({
          [field.customFieldName]: this.$refs[field.customFieldName][0].value
        })
      })
      sa.itemDocumentDbRef(uid,archiveId,this.$route.params.item_id).update({
        customFields: customFieldsObj
      })       

    },              
    onSubmit () {

      // empty the error variable to get rid of old errors
      this.errors = []

      // check the form for completeness
      if (!this.itemTitle || this.itemTitle == '') { // title is mandatory
        this.errors.push('A title is required')
        this.titleInvalid = true
      }  else {
        this.titleInvalid = false
      }      

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      var itemId = this.$route.params.item_id

      this.addCustomFieldValues()

      if(!(this.errors.length < 0)) {

        this.loading = true
        // build the ref
        sa.itemDocumentDbRef(uid, archiveId, itemId).update({
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
          tags: this.selectedTags
        }).then(() => {
          console.log('item updated!')
          this.$router.push({ name: 'PublicArchive', params: { id: this.$route.params.archive_id, username: firebase.auth().currentUser.displayName }})
        })
      }
    },
    itemDelete(itemId) {
      //Delete the item from the database
      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      var itemId = this.$route.params.item_id
      var fileName = this.itemFileName

      console.log(fileName)
      //Check to see if there are items to delete

      console.log(this.itemMediaType)
      if(this.itemMediaType === 'image') {
        // delete the thumb derivative
        sa.itemStorageRef(uid, archiveId, itemId, fileName, 'thumb_').delete()
      }

      if(this.itemMediaType === 'image' || this.itemMediaType === 'audio' || this.itemMediaType === 'pdf') {
        // delete the main item image
        sa.itemStorageRef(uid, archiveId, itemId, fileName).delete()
      }

      // delete the document
      sa.itemDocumentDbRef(uid, archiveId, itemId).delete()

      // Keep track of the number of items this user has
      var numberOfItems;
      sa.userArchivesDocumentDbRef(uid).get().then(function(doc) {
          if (doc.exists) {
              numberOfItems = doc.data().numberOfItems - 1
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

      // reroute after delete
      this.$router.push({ name: 'PublicArchive', params: { id: this.$route.params.archive_id, username: firebase.auth().currentUser.displayName }})

    }, 
    backUrl() {
      this.$router.push({ name: 'PublicArchive', params: {username: firebase.auth().currentUser.displayName, id: this.$route.params.archive_id }})
      // return '/u/' + firebase.auth().currentUser.displayName + '/' + this.$route.params.archive_id
    }           
  }
}
</script>
