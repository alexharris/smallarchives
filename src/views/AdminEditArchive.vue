<template>
  <div class="row justify-content-center">

      
      <h1 class="h3"> Edit Archive</h1>
      <!-- <a :href="backUrl" class="close-item"><font-awesome-icon icon="times" size="1x" /></a><br /> -->
      <template v-if="errors.length > 0">
        <AlertBox color="red" strength="200">
          <ul>
            <li v-for="error in errors">{{error}}</li>
          </ul>
        </AlertBox>
        <!-- <div class="alert alert-danger" role="alert" show>
          <ul>
            <li v-for="error in errors">{{error}}</li>
          </ul>
        </div> -->
      </template>    
        <div class="flex flex-row">
            <span @click="tab = 'basic'" class="tab" :class="{active: (tab == 'basic')}">Basic</span>
            <span @click="tab = 'fields'" class="tab" :class="{active: (tab == 'fields')}">Fields</span>
            <span @click="tab = 'tags'" class="tab" :class="{active: (tab == 'tags')}">Tags</span>
            <span @click="tab = 'admin'" class="tab" :class="{active: (tab == 'admin')}">Admin</span>
        </div>     
        <div id="myTabContent" class="tab-content my-2">   
          
          <!-- Start first tab -->
          <div v-if="tab == 'basic'" class="shadow-lg p-4">  
            <h2>Basic Details</h2> 
            <!-- Title -->
            <FormField 
              id="title"
              label="Title"
              type=""
              placeholder="Title"
              v-model="archive.title"
            />               

            <!-- <div class="form-group row">
              <label for="inputTitle" class="col-sm-4 col-form-label">Title</label>
              <div class="col-sm-8">
                <input class="form-control" id="inputTitle" v-model="archive.title">
              </div>
            </div>  -->
            <!-- Desc -->
            <FormField 
              id="description"
              label="Description"
              type="textarea"
              placeholder="Description"
              v-model="archive.desc"
            />               
            <!-- <div class="form-group row">
              <label for="inputDesc" class="col-sm-4 col-form-label">Description</label>
              <div class="col-sm-8">
                <textarea class="form-control" id="inputDesc" v-model="archive.desc"></textarea>
              </div>
            </div>    -->
            <!-- Header Image -->
            <FormField 
              id="headerimage"
              label="Header Image"
              type="file"
              placeholder=""
              v-model.lazy="archive.headerImage"
            />               
            <!-- <div v-if="archive.headerImage" class="my-4">
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
            </div>         -->
            <h3>View types</h3>
            <p>The grid view will always show by default, but you can decide if you want to also display items in a table format or map view.</p>
            <!-- Views -->
            <FormField 
              id="listview"
              label="List View"
              type="checkbox"
              placeholder=""
              v-model="showList"
            />               
            <!-- <div class="form-group row">
              <label for="listView" class="col-sm-4 col-form-label">Show List View</label>
              <div class="col-sm-8">
                <input type="checkbox" id="listView" v-model="showList">
              </div>
            </div>     -->
            <!-- <div class="form-group row">
              <label for="gridView" class="col-sm-2 col-form-label">Show Grid View</label>
              <div class="col-sm-10">
                <input type="checkbox" id="gridView" v-model="showGrid">
              </div>
            </div>   -->
            <FormField 
              id="mapview"
              label="Map View"
              type="checkbox"
              placeholder=""
              v-model="showMap"
            />   
            <!-- <div class="form-group row">
              <label for="mapView" class="col-sm-4 col-form-label">Show Map View</label>
              <div class="col-sm-8">
                <input type="checkbox" id="mapView" v-model="showMap">
              </div>
            </div>   -->
            <!-- Map Coordinates -->
            <AlertBox color="gray" strength="200" v-if="showMap">
                <h3>Map Settings</h3>
                <p>The map view will only show items that have latitude and longitude values.</p>
                <!-- <div class="form-group row">
                  <label for="inputMapLat" class="col-12 col-sm-4 col-form-label">Initial Map Latitude</label>
                  <div class="col-12 col-sm-8">
                    <input class="form-control" id="inputMapLat" v-model.number="mapLat">
                  </div>
                </div> -->
                <FormField 
                  id="maplat"
                  label="Initial Map Latitude"
                  type="text"
                  placeholder=""
                  v-model="mapLat"
                  helptext="Starting latitude"
                />                   
                <!-- <div class="form-group row">
                  <label for="inputMapLong" class="col-12 col-sm-4 col-form-label">Initial Map Longitude</label>
                  <div class="col-12 col-sm-8">
                    <input class="form-control" id="inputMapLong" v-model.number="mapLong">
                  </div>
                </div>   -->
                <FormField 
                  id="maplong"
                  label="Initial Map Longitude"
                  type="text"
                  placeholder=""
                  v-model="mapLong"
                  helptext="Starting longitude"
                />   
                <FormField 
                  id="zoom"
                  label="Initial Map Zoom"
                  type="number"
                  placeholder=""
                  v-model="zoom"
                  min="0"
                  max="16"
                  helptext="Starting zoom, between 0 and 16"
                />                                  
                <!-- <div class="form-group row">
                  <label for="customRange2" class="col-12 col-sm-4 col-form-label">Initial Map Zoom</label>
                  <div class="col-12 col-sm-2 text-center">
                    <strong>{{zoom}}</strong>
                  </div>            
                  <div class="col-12 col-sm-8">
                    <input type="range" class="custom-range" min="0" max="16" id="customRange2" v-model.number="zoom">    
                  </div>
                </div>  -->
            </AlertBox>     
            <!-- Submit -->
            <SubmitButton v-on:submit="onSubmit" v-on:cancel="goBack" :formIsLoading="isLoading" />                      

            
                        

          </div>
          <!-- start second tab -->
          <div v-if="tab == 'fields'" class="shadow-lg p-4">
            <AdminCustomFields />   
          </div>          
          <!-- start third tab -->
          <div v-if="tab == 'tags'" class="shadow-lg p-4">     
            <h2>Tags</h2>
            <p>Tags are used to group items together. Add tags here to make them available when creating or updating an item.</p>
            <hr class="my-4" />   
            <div class="tags">  

              <h3>Existing tags</h3>   
              <span v-if="tags.length == 0">
                <p>This archive currently does not have any tags! Add a tag below and click <strong>Add</strong>.</p>
              </span>
              <div class="w-full flex flex-row flex-wrap py-4"  v-else>
                <span v-for="tag in tags" class="mr-4">
                  <span class="bg-yellow-200 p-4 rounded shadow">{{tag.tagTitle}}<font-awesome-icon icon="times" class="ml-2 cursor-pointer" v-on:click.stop="deleteTagFromArchive(tag.tagId, tag.tagTitle)" size="1x" /></span>
                </span>
              </div>              
              <form class="form-inline my-4 flex flex-row">
                <input type="text" class="border border-gray-900 p-2 rounded mr-4" id="inlineFormInputName2" placeholder="A tag" v-model="newTag">
                <div class="btn-dark inline-block py-2 cursor-pointer" v-on:click.stop="addTag">Add</div>
              </form>                   
            </div>
          </div>  

          <!-- start fourth tab -->
          <div v-if="tab == 'admin'" class="shadow-lg p-4">
            <ul class="list-unstyled">
              <li><strong>Created:</strong> {{dateCreated}}</li>
              <li><strong>ID:</strong> {{key}}</li>
              <li><strong>Export Data: </strong> <AdminExportData /></li>
              <!-- <li><strong>Import Data: </strong> <AdminImportData /></li> -->
            </ul>
            <AlertBox color="yellow" strength="200" v-if="deleteConfirm">
              <h3>Delete Archive</h3>
              <p>Warning: Deleting this archive is permanent and you can't get it back.</p>
              <a class="btn-dark" @click="deleteConfirm = !deleteConfirm">Delete</a>
            </AlertBox>       
            <AlertBox color="red" strength="200" v-else>
              <h3>CONFIRM DELETION!!!</h3>
              <p>Are you totally sure you want to delete this archive? You really can't get it back at all.</p>
              <a class="btn-red mr-2" @click.stop="deletearchive(key)">I understand, please delete</a> <a class="btn-dark" @click="deleteConfirm = !deleteConfirm">No thanks!</a>
            </AlertBox>                   
          </div>                  
        </div>     
  </div>
   
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'
import AdminExportData from '../components/AdminExportData'
import AdminImportData from '../components/AdminImportData'
import AdminCustomFields from '../components/AdminCustomFields'
import SubmitButton from '../components/SubmitButton'
import AlertBox from '../components/AlertBox'
import FormField from '../components/FormField'

export default {
  name: 'AdminEditArchive',
  components: {
    ArchiveHeaderImage,
    AdminExportData,
    AdminImportData,
    SubmitButton,
    AdminCustomFields,
    AlertBox,
    FormField
  }, 
  data () {
    return {
      key: this.$route.params.archive_id,
      archive: {},
      uid: this.$store.getters.getUser.uid,
      originalHeaderImage: '',
      newHeaderImage: '',
      errors: [],
      dateCreated: '',
      newTag: '',
      tags: [],
      newTags: [],
      showMap: false,
      // showGrid: true,
      showList: false,
      isLoading: false,
      zoom: 1,
      mapLat: 1,
      mapLong: 1,
      backUrl: '/u/' + firebase.auth().currentUser.displayName + '/' + this.$route.params.archive_id,
      tab: 'basic',
      deleteConfirm: 'false'
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
          name: 'AdminDashboard',
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
      * 5. Delete custom fields
      * 6. Delete the archive itself
      */

      // 1: get all of the items associated with the archive
      sa.itemCollectionDbRef(uid, archiveId).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // 2: Go through each one, get associated filename, and delete that file from storage
            

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
        sa.tagCollectionDbRef(uid, archiveId).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              sa.tagDocumentDbRef(uid, archiveId, doc.id).delete() 
          });
        }) 

        // 5. Delete the tags from the archive
        sa.customFieldCollectionDbRef(uid, archiveId).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
              sa.customFieldDocumentDbRef(uid, archiveId, doc.id).delete() 
          });
        })         


        // 6. Delete the archive itself

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
        this.$router.push({ name: 'AdminDashboard'})
      })
      


    },           
  },
 
}
</script>

<style lang="scss" scoped>

  .tags {
    size: 2em;
  }

  .nav-pills .nav-link.active {
    color: black;
    background-color: lightgray;
}

</style>
