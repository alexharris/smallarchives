<template>
  <div class="row justify-content-center">
    <div class="col-12 col-sm-11 pt-4">
      
      <h1 class="h3 float-left"> Edit Archive</h1>
      <a :href="backUrl" class="float-right close-item"><font-awesome-icon icon="times" size="1x" /></a><br />
      <br />
      <template v-if="errors.length > 0">
        <div class="alert alert-danger" role="alert" show>
          <ul>
            <li v-for="error in errors">{{error}}</li>
          </ul>
        </div>
      </template>   
      <div class="card">
        <div class="card-header">     
          <ul class="nav nav-pills card-header-pills" id="myTab" role="tablist">
            <li class="nav-item">
              <a class="nav-link active" id="basic-tab" data-toggle="tab" href="#basic" role="tab" aria-controls="basic" aria-selected="true">Basic</a>
            </li>
            <li class="nav-item">
              <a class="nav-link" id="field-tab" data-toggle="tab" href="#field" role="tab" aria-controls="field" aria-selected="false">Fields</a>
            </li>         
            <li class="nav-item">
              <a class="nav-link" id="tag-tab" data-toggle="tab" href="#tag" role="tab" aria-controls="tag" aria-selected="false">Tags</a>
            </li>       
            <li class="nav-item">
              <a class="nav-link" id="admin-tab" data-toggle="tab" href="#admin" role="tab" aria-controls="admin" aria-selected="false">Admin</a>
            </li>        
          </ul>     
        </div>
        <div class="card-body">
          <div id="myTabContent" class="tab-content my-2">   
          <!-- Start first tab -->
            <div class="tab-pane fade show active" id="basic" role="tabpanel" aria-labelledby="basic-tab">   
              <!-- Title -->
              <div class="form-group row">
                <label for="inputTitle" class="col-sm-4 col-form-label">Title</label>
                <div class="col-sm-8">
                  <input class="form-control" id="inputTitle" v-model="archive.title">
                </div>
              </div> 
              <!-- Desc -->
              <div class="form-group row">
                <label for="inputDesc" class="col-sm-4 col-form-label">Description</label>
                <div class="col-sm-8">
                  <textarea class="form-control" id="inputDesc" v-model="archive.desc"></textarea>
                </div>
              </div>   
              <!-- Header Image -->
              <div v-if="archive.headerImage" class="my-4">
                <div class="row">
                  <div class="col-sm-4">Header Image</div>
                  <div class="cols-m-8">
                    <ArchiveHeaderImage v-bind:archiveId="key" class="mr-3"/>
                    <div @click.stop="archive.headerImage = ''" class="btn btn-outline-dark my-4">Remove</div>
                  </div>
                </div>
              </div>
              <div v-else>
                <div class="form-group row">
                  <label for="inputFile" class="col-sm-4 col-form-label">Header Image</label>
                  <input type="file" id="inputFile" v-on:change="handleFileChange">
                </div>
              </div>        
              <h4>View types</h4>
              <p>The grid view will always show by default, but you can decide if you want to also display items in a table format or map view. Map view will only display items that have a latitude and longitude.</p>
              <!-- Views -->
              <div class="form-group row">
                <label for="listView" class="col-sm-4 col-form-label">Show List View</label>
                <div class="col-sm-8">
                  <input type="checkbox" id="listView" v-model="showList">
                </div>
              </div>    
              <!-- <div class="form-group row">
                <label for="gridView" class="col-sm-2 col-form-label">Show Grid View</label>
                <div class="col-sm-10">
                  <input type="checkbox" id="gridView" v-model="showGrid">
                </div>
              </div>   -->

              <div class="form-group row">
                <label for="mapView" class="col-sm-4 col-form-label">Show Map View</label>
                <div class="col-sm-8">
                  <input type="checkbox" id="mapView" v-model="showMap">
                </div>
              </div>  
              <!-- Map Coordinates -->
              <div class="card" v-if="showMap">
                <div class="card-header">
                  Map Settings
                </div>
                <div class="card-body">
                  <div class="form-group row">
                    <label for="inputMapLat" class="col-12 col-sm-4 col-form-label">Initial Map Latitude</label>
                    <div class="col-12 col-sm-8">
                      <input class="form-control" id="inputMapLat" v-model.number="mapLat">
                    </div>
                  </div>
                  <div class="form-group row">
                    <label for="inputMapLong" class="col-12 col-sm-4 col-form-label">Initial Map Longitude</label>
                    <div class="col-12 col-sm-8">
                      <input class="form-control" id="inputMapLong" v-model.number="mapLong">
                    </div>
                  </div>  
                  <div class="form-group row">
                    <label for="customRange2" class="col-12 col-sm-4 col-form-label">Initial Map Zoom</label>
                    <div class="col-12 col-sm-2 text-center">
                      <strong>{{zoom}}</strong>
                    </div>            
                    <div class="col-12 col-sm-8">
                      <input type="range" class="custom-range" min="0" max="16" id="customRange2" v-model.number="zoom">    
                    </div>
                  </div> 
                </div>
              </div>     
              <!-- Submit -->
              <SubmitButton v-on:submit="onSubmit" v-on:cancel="goBack" :formIsLoading="isLoading" />                      

              
                          
              
            </div>
            <!-- start second tab -->
            <div class="tab-pane fade" id="field" role="tabpanel" aria-labelledby="field-tab">
              <AdminCustomFields />   
            </div>          
            <!-- start third tab -->
            <div class="tab-pane fade" id="tag" role="tabpanel" aria-labelledby="tag-tab">     
              <p>Tags are used to group items together. Add tags here to make them available when creating or updating an item.</p>
              <hr class="my-4" />   
              <div class="tags">  
                <form class="form-inline mb-4">
                  <label class="sr-only" for="inlineFormInputName2">Name</label>
                  <input type="text" class="form-control mr-2" id="inlineFormInputName2" placeholder="A tag" v-model="newTag">
                  <div class="btn btn-primary" v-on:click.stop="addTag">Add</div>
                </form>    
                <p>Existing tags:</p>   
                <span v-if="tags.length == 0">
                  <p>This archive currently does not have any tags! Add a tag below and click <strong>Add</strong>.</p>
                </span>
                <span class="badge badge-warning mr-2" v-for="tag in tags" v-else>
                  {{tag.tagTitle}}<font-awesome-icon icon="times" class="ml-2 badge-close" v-on:click.stop="deleteTagFromArchive(tag.tagId, tag.tagTitle)" size="1x" />
                </span>
              </div>
            </div>  

            <!-- start fourth tab -->
            <div class="tab-pane fade" id="admin" role="tabpanel" aria-labelledby="admin-tab">
                <ul class="list-unstyled">
                  <li><strong>Created:</strong> {{dateCreated}}</li>
                  <li><strong>ID:</strong> {{key}}</li>
                  <li><strong>Export Data: </strong> <AdminExportData /></li>
                </ul>
                            
                        

    
              <div class="admin my-4">
                <div class=" card-deck">

                  <!-- Card two -->
                  <div class="card border-danger">
                    <div class="card-header">Delete Archive</div>
                    <div class="card-body">
                      <p>Warning: Deleting this archive is permanent and you can't get it back.</p>
                      <a class="btn btn-outline-danger" data-target="#exampleModal" data-toggle="modal">Delete</a>
                    </div>
                  </div>             
                </div> 
              </div>
            </div>                  
          </div>     
        </div>
      </div>
    </div>
      <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title">CONFIRM DELETION!</h5>
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>
          </div>          
          <div class="modal-body">           
            <p>Are you totally sure you want to delete this archive? You really can't get it back at all.</p>
          </div>
          <div class="modal-footer">
            <a class="btn btn-outline-danger" @click.stop="deletearchive(key)">I understand, please delete</a>
          </div>          
        </div>
      </div>
    </div>
  </div>
   
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'
import AdminExportData from '../components/AdminExportData'
import AdminCustomFields from '../components/AdminCustomFields'
import SubmitButton from '../components/SubmitButton'

export default {
  name: 'AdminEditArchive',
  components: {
    ArchiveHeaderImage,
    AdminExportData,
    SubmitButton,
    AdminCustomFields
  }, 
  data () {
    return {
      key: this.$route.params.archive_id,
      archive: {},
      uid: this.$store.getters.getUser.uid,
      originalHeaderImage: '',
      newHeaderImage: '',
      numberOfItems: 0,
      errors: [],
      dateCreated: '',
      newTag: '',
      tags: [],
      newTags: [],
      showMap: true,
      // showGrid: true,
      showList: false,
      isLoading: false,
      zoom: 1,
      mapLat: 1,
      mapLong: 1,
      backUrl: '/u/' + firebase.auth().currentUser.displayName + '/' + this.$route.params.archive_id
    }
  },
  created () {

    // get existing data
    var uid = firebase.auth().currentUser.uid
    var archiveId = this.$route.params.archive_id

    sa.archiveDocumentDbRef(uid, archiveId).get().then((doc) => {
      if (doc.exists) {
        this.archive = doc.data();
        this.dateCreated = sa.getFormattedDate(doc.data().dateCreated)
        this.originalHeaderImage = doc.data().headerImage
        this.getTags()
        this.showList = doc.data().showList
        // this.showGrid = doc.data().showGrid
        this.showMap = doc.data().showMap
        this.mapLat = doc.data().mapLat
        this.mapLong = doc.data().mapLong
        this.zoom = doc.data().zoom
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    handleFileChange(e, index) {
      this.newHeaderImage = e.target.files[0]
    },     
    onSubmit () {

      this.isLoading = true

      // Check for errors in the form
      this.errors = [] //clear old error array
      //check for completeness
      if(this.archive.title == '') { //title is mandatory
        this.errors.push('Title required')
        this.isLoading = false;
        return
      }      

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id      

      sa.archiveDocumentDbRef(uid, archiveId).update({
        title: this.archive.title,
        desc: this.archive.desc,
        showList: this.showList,
        // showGrid: this.showGrid,
        showMap: this.showMap,
        mapLat: this.mapLat,
        mapLong: this.mapLong,
        zoom: this.zoom        
      }).catch((error) => {
        alert("Error adding document: ", error);
      }).then(() => {
        if(this.newHeaderImage != '') { // if there is a new header image
          console.log('new header image')
          // delete the original if it exists
          if(this.originalHeaderImage != '') {
            sa.deleteArchiveHeaderImage (uid, archiveId, this.originalHeaderImage)
          }

          // add the new
          sa.addArchiveHeaderImage(uid,archiveId,this.newHeaderImage)
          
        } else if(this.originalHeaderImage == this.archive.headerImage) {
          console.log('same image, leave it alone')
        } else {
          console.log('delete the image and dont upload a new one')
          // delete the original
          sa.deleteArchiveHeaderImage (uid, archiveId, this.originalHeaderImage)
        }
      }).then(() => {
        this.$router.push({
          name: 'AdminListArchives',
        }) 
      })
    },
    goBack() {
      this.$router.push({ name: 'PublicArchive', params: { id: this.$route.params.archive_id, username: firebase.auth().currentUser.displayName }})
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
            tagTitle: doc.data().tagTitle,
            tagId: doc.id
          });
        });
      });     
    },
    addTag(evt) {
      evt.preventDefault()

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id      

      sa.tagCollectionDbRef(uid, archiveId).add({
        tagTitle: this.newTag
      }).catch((error) => {
        alert("Error adding document: ", error);
      }).then(() => {
        // get a new list of tags which will include the just added
        this.getTags()
        //clear the field
        this.newTag = ''
      })
    },
    deleteTagFromArchive(tagId, tagTitle) {

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      // delete the tag from the archive record
      sa.tagDocumentDbRef(uid, archiveId, tagId).delete().then(() =>{
          console.log("Tag successfully deleted from archive");
          this.deleteTagFromItem(tagTitle)
          this.getTags();
      }).catch(function(error) {
          console.error("Error removing tag: ", error);
      });
      
    },
    deleteTagFromItem(tagTitle) {
      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      console.log('tag targeted: ' + tagTitle);
      this.newTags = []
      // get all items that contain a specific tag
      sa.itemCollectionDbRef(uid, archiveId).where('tags', 'array-contains', tagTitle)
      .get()
      .then((querySnapshot) => {
        console.log(this.newTags)
        console.log('building up new array')
        querySnapshot.forEach((doc) => {
          // go through each tag
          this.newTags = []
          for( var i = 0; i < doc.data().tags.length; i++){ 
             if ( doc.data().tags[i] != tagTitle) {

               this.newTags.push(doc.data().tags[i])  
             }
          }
           this.updateTagsOnItem(doc.id, this.newTags)
        });
          console.log('New tag array:')
          console.log(this.newTags)        
      }).then(() => {
        // console.log('now add back new array')
        // sa.itemollectionDbRef(uid, archiveId).where('tags', 'array-contains', tagTitle).update({
        //   tags: newTags
        // })        
      })
    },
    updateTagsOnItem(itemId, tags) {

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id

      sa.itemDocumentDbRef(uid, archiveId, itemId).update({
          "tags": tags
      })
      .then(function() {
          console.log("Document successfully updated!");
      });
    },
    deletearchive (id) {

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id     

      /**
      * 1. Get all of the items associated with this archive
      * 2. Delete the images from storage associated with this archive
      * 3. Delete the item's data
      * 4. Delete tags
      * 5. Delete the archive itself
      */

      // 1: get all of the items associated with the archive
      sa.itemCollectionDbRef(uid, archiveId).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // 2: Go through each one, get associated filename, and delete that file from storage
            
            this.numberOfItems = this.numberOfItems + 1 // track number of items to delete from total
  
            // If this record has an itemFileName
            if(doc.data().itemFileName != '') {
              // Delete the main image
              sa.itemStorageRef(uid, archiveId, doc.id, doc.data().itemFileName).delete()
              // Delete the thumbnail
              sa.itemStorageRef(uid, archiveId, doc.id, doc.data().itemFileName, 'thumb_').delete()
            }
            // Delete the item record
            sa.itemDocumentDbRef(uid, archiveId, doc.id).delete().then(function() { 
              console.log("Item successfully deleted!");
            }).catch(function(error) {
              console.error("Error removing item: ", error);
            });
          });

          

      }).then(() => {

        // 4. Delete the tags from the archive
          tagCollectionDbRef(uid, archiveId).delete().then(function() {
              console.log("Tags successfully deleted!");
          }).catch(function(error) {
              console.error("Error removing document: ", error);
          });


        // 5. Delete the archive itself

        // First the images from storage
        sa.deleteArchiveHeaderImage (uid, archiveId, this.originalHeaderImage)

        // Delete the archive from the db
        sa.archiveDocumentDbRef(uid, archiveId).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });

        // delete the containing folder
        // was this doing something?
        // sa.archiveDocumentDbRef(uid, archiveId).parent().delete()
        
        //reroute
        this.$router.push({ name: 'AdminListArchives'})
      })
      


    },           
  },
 
}
</script>

<style lang="scss">

  .tags {
    size: 2em;
  }

</style>
