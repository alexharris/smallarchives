<template>
  <div class="row">
    <div class="col-12">
      <div class="row">
        <div class="col-sm-9">
          <div class="btn btn-dark" @click.stop="goBack" variant="dark">Back</div>
        </div>
        <div class="col-sm-3">
          <switcher v-model="helpSwitcherValue" />    
        </div>
      </div>
      <hr class="my-4" />
      <h1 class="h4">Edit Asset</h1>      
      <hr class="my-4" />
      <h2 class="h5">Media Details</h2>
      <p><small>The media associated with this item is immutable for now. Delete this item and create a new one if a new media representation is needed.</small></p>
      <div class="row">
        <div class="col-2">
          Type
        </div>
        <div class="col-10">
          {{assetMediaType}}
        </div>        
        <div class="col-2">
          Media
        </div>
        <div class="col-10">

          <div v-if="assetMediaType == 'image'">
            <img :src="assetSrc" />
          </div>
          <div v-if="assetMediaType == 'audio'">
            <figure>
                <audio
                    controls
                    :src="assetSrc">
                        Your browser does not support the
                        <code>audio</code> element.
                </audio>
            </figure>
          </div>
          <div v-if="assetMediaType == 'pdf'" class="pdf-download">
            <p>{{assetFileName}}</p>
            <a :href="assetSrc"><font-awesome-icon icon="file-download" size="6x" /> </a>
          </div>        
          <div v-if="assetMediaType === 'text'">
            <p>{{assetText}}</p>
          </div>
          <div v-if="assetMediaType === 'youtube'" class="video-wrapper">         
            <iframe width="560" height="315" v-bind:src="assetYoutubeId" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>          
          </div>                        
        </div>
      </div>
      
      <hr class="my-4" />
      
      <form class="needs-validation">
       
          <h2 class="h5">Basic Info</h2>
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
            <h2 class="h5">Metadata</h2>
            <!-- Asset Type -->
            <div class="form-group row">
              <label for="inputAssetType" class="col-sm-2 col-form-label">Asset Type</label>
              <div class="col-sm-10">
                <select class="form-control" id="inputAssetType" v-model="assetType">
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
   
        <div v-if="!loading">
          <hr class="my-4" />
          <div class="btn btn-warning btn-lg" @click.stop="onSubmit">Submit</div>
        </div>
        <div v-else>
          <div class="spinner-border" role="status">
            <span class="sr-only">Loading...</span>
          </div>
        </div>
        </form>                      
        <hr class="my-4" />  
        <div class="col-12" >
          <div class=" card-deck">
            <!--  Card one -->
            <div class="card border-warning ml-0 bg-transparent">
              <div class="card-header">Item Info</div>
              <div class="card-body">
                <ul class="list-unstyled">
                  <li><strong>Created:</strong> {{assetCreationDate}}</li>
                  <li><strong>ID:</strong> {{this.$route.params.asset_id}}</li>
                </ul>
              </div>
            </div>
            <!-- Card two -->
            <div class="card border-danger ml-0 bg-transparent">
              <div class="card-header">Delete</div>
              <div class="card-body">
                <p>Warning: Deleting this item is permanent and you can't get it back</p>
                <a class="btn btn-outline-danger" @click.stop="itemDelete(assetId)">Delete</a>
              </div>
            </div> 
          </div>         
        </div>                 
      </div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'
  import Switcher from '../components/Switcher'

export default {
  name: 'AdminEditAsset',
  components: {
    Switcher
  },  
  data () {
    return {
      key: this.$route.params.id,
      assetTitle: '',
      assetFileName: '',
      assetId: '',
      assetDescription: '',
      assetFormat:'',
      assetIdentifier:'',
      assetLanguage:'',
      assetPublisher:'',
      assetRelation:'',
      assetRights:'',
      assetSource:'',
      assetSubject:'',
      assetContributor:'',
      assetCoverage:'',
      assetCoverageLat: '',
      assetCoverageLong: '',      
      assetCreator:'',
      assetDate:'',
      assetLocation:'',
      assetMediaType:'',
      assetCreationDate:'',
      selectedAssetMediaType: '',
      assetType: '',
      assetSrc: '',
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
      audioInvalid: false      
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
        this.assetCreationDate = sa.getFormattedDate(doc.data().assetCreationDate)
        this.assetContributor = doc.data().assetContributor
        this.assetCoverage = doc.data().assetCoverage
        this.assetCreator = doc.data().assetCreator
        this.assetDate = doc.data().assetDate
        this.assetTitle = doc.data().assetTitle
        this.assetFileName = doc.data().assetFileName
        this.assetFormat = doc.data().assetFormat
        this.assetIdentifier = doc.data().assetIdentifier
        this.assetLanguage = doc.data().assetLanguage
        this.assetPublisher = doc.data().assetPublisher
        this.assetRelation = doc.data().assetRelation
        this.assetRights = doc.data().assetRights
        this.assetSource = doc.data().assetSource
        this.assetSubject = doc.data().assetSubject
        this.assetCoverageLat = doc.data().assetCoverageLat
        this.assetCoverageLong = doc.data().assetCoverageLong
        this.assetId = doc.id
        this.assetText = doc.data().assetText
        this.assetDescription = doc.data().assetDescription
        this.assetMediaType = doc.data().assetMediaType
        this.assetType = doc.data().assetType
      } else {
        console.log("No such document!");
      }
    }).then(() => {
      this.getAssetSrc()
    });

    

  },
  methods: {
    getAssetSrc() {

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      var assetId = this.$route.params.asset_id
      var fileName = this.assetFileName

      sa.assetStorageRef(uid, archiveId, assetId, fileName, 'thumb_').getDownloadURL().then((url) => {
        this.assetSrc = url
      }).catch(function(error) {
        console.log(error.message)
      })
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

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      var assetId = this.$route.params.asset_id

      if(!(this.errors.length > 0)) {

        this.loading = true
        // build the ref
        sa.assetDocumentDbRef(uid, archiveId, assetId).update({
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
          assetType: this.assetType,
        }).then(() => {
          console.log('asset updated!')
          this.$router.push({ name: 'AdminShowArchive', params: { id: this.$route.params.archive_id }})
        })
      }
    },
    itemDelete(assetId) {
      //Delete the item from the database
      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      var assetId = this.$route.params.asset_id
      var fileName = this.assetFileName

      console.log(fileName)
      //Check to see if there are assets to delete

      console.log(this.assetMediaType)
      if(this.assetMediaType === 'image') {
        // delete the thumb derivative
        sa.assetStorageRef(uid, archiveId, assetId, fileName, 'thumb_').delete()
      }

      if(this.assetMediaType === 'image' || this.assetMediaType === 'audio' || this.assetMediaType === 'pdf') {
        // delete the main asset image
        sa.assetStorageRef(uid, archiveId, assetId, fileName).delete()
      }

      // delete the document
      sa.assetDocumentDbRef(uid, archiveId, assetId).delete()

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
      this.$router.push({ name: 'AdminShowArchive', params: { id: this.$route.params.archive_id }})

    }, 
    goBack() {
      this.$router.push({ name: 'AdminShowArchive', params: { id: this.$route.params.archive_id }})
    }           
  }
}
</script>
