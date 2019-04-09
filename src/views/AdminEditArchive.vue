<template>
  <div class="row justify-content-center">
    <div class="col-12 col-sm-10">
      <div class="btn btn-outline-dark" @click.stop="goBack">Back</div>
      <hr class="my-4" />
      <ul class="nav nav-tabs my-5" id="myTab" role="tablist">
        <li class="nav-item">
          <a class="nav-link active" id="basic-tab" data-toggle="tab" href="#basic" role="tab" aria-controls="basic" aria-selected="true">Basic Info</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="tag-tab" data-toggle="tab" href="#tag" role="tab" aria-controls="tag" aria-selected="false">Tags</a>
        </li>
        <li class="nav-item">
          <a class="nav-link" id="admin-tab" data-toggle="tab" href="#admin" role="tab" aria-controls="admin" aria-selected="false">Admin</a>
        </li>        
      </ul>     
      <div id="myTabContent" class="tab-content my-5">   
      <!-- Start first tab -->
        <div class="tab-pane fade show active" id="basic" role="tabpanel" aria-labelledby="basic-tab">   

          <h2 class="h4">Basic Info</h2>
          <p>Update basic info about this archive.</p>
          <hr class="my-4" /> 
          <form>
          
            <!-- Title -->
            <div class="form-group row">
              <label for="inputTitle" class="col-sm-2 col-form-label">Title</label>
              <div class="col-sm-10">
                <input class="form-control" id="inputTitle" v-model="archive.title">
              </div>
            </div> 
            <!-- Desc -->
            <div class="form-group row">
              <label for="inputDesc" class="col-sm-2 col-form-label">Description</label>
              <div class="col-sm-10">
                <textarea class="form-control" id="inputDesc" v-model="archive.desc"></textarea>
              </div>
            </div>   
            <!-- Header Image -->
            <div v-if="archive.headerImage" class="my-4">
              <div class="row">
                <div class="col-sm-2">Header Image</div>
                <div class="cols-m-10">
                  <ArchiveHeaderImage v-bind:archiveId="key" class="mr-3"/>
                  <div @click.stop="archive.headerImage = ''" class="btn btn-outline-dark my-4">Remove</div>
                </div>
              </div>
            </div>
            <div v-else>
              <div class="form-group row">
                <label for="inputFile" class="col-sm-2 col-form-label">Header Image</label>
                <input type="file" id="inputFile" v-on:change="handleFileChange">
              </div>
            </div>        
          </form> 
          <button class="btn btn-dark" type="submit" v-on:click="onSubmit">Update</button>
        </div>
        <!-- start second tab -->
        <div class="tab-pane fade" id="tag" role="tabpanel" aria-labelledby="tag-tab">
          <h2 class="h4">Tags</h2>   
          <p>Tags are used to group items together. Add tags here to make them available when creating or updating an item.</p>
          <hr class="my-4" />   
          <div class="tags">  
            <span v-if="tags.length == 0">
              <p>This archive currently does not have any tags! Add a tag below and click <strong>Add</strong>.</p>
            </span>
            <span class="badge badge-warning mr-2" v-for="tag in tags" v-else>
              {{tag.tagTitle}}<font-awesome-icon icon="times" class="ml-2 badge-close" v-on:click.stop="deleteTagFromArchive(tag.tagId, tag.tagTitle)" size="1x" />
            </span>
            <form class="form-inline mt-4">
              <label class="sr-only" for="inlineFormInputName2">Name</label>
              <input type="text" class="form-control mr-2" id="inlineFormInputName2" placeholder="A tag" v-model="newTag">
              <div class="btn btn-dark" v-on:click.stop="addTag">Add</div>
            </form> 
          </div>
        </div>  

        <!-- start third tab -->
        <div class="tab-pane fade" id="admin" role="tabpanel" aria-labelledby="admin-tab">
          <h2 class="h4">Administration</h2>   
          <hr class="my-4" />   
          <div class="admin">
            <div class=" card-deck">
              <!--  Card one -->
              <div class="card">
                <div class="card-header">Archive Info</div>
                <div class="card-body">
                  <ul class="list-unstyled">
                    <li><strong>Created:</strong> {{dateCreated}}</li>
                    <li><strong>ID:</strong> {{key}}</li>
                  </ul>
                </div>
              </div>
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

import firebase from 'firebase'
import sa from '../sa'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'

export default {
  name: 'AdminEditArchive',
  components: {
    ArchiveHeaderImage
  }, 
  data () {
    return {
      key: this.$route.params.archive_id,
      archive: {},
      uid: this.$store.getters.getUser.uid,
      originalHeaderImage: '',
      newHeaderImage: '',
      numberOfItems: 0,
      dateCreated: '',
      newTag: '',
      tags: [],
      newTags: []
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
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    handleFileChange(e, index) {
      this.newHeaderImage = e.target.files[0]
    },     
    onSubmit (evt) {
      evt.preventDefault()

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id      

      sa.archiveDocumentDbRef(uid, archiveId).update({
        title: this.archive.title,
        desc: this.archive.desc
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
      this.$router.push({ name: 'AdminShowArchive', params: { archive_id: this.$route.params.archive_id }})
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
          this.deleteTagFromAsset(tagTitle)
          this.getTags();
      }).catch(function(error) {
          console.error("Error removing tag: ", error);
      });
      
    },
    deleteTagFromAsset(tagTitle) {
      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id
      console.log('tag targeted: ' + tagTitle);
      this.newTags = []
      // get all assets that contain a specific tag
      sa.assetCollectionDbRef(uid, archiveId).where('tags', 'array-contains', tagTitle)
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
           this.updateTagsOnAsset(doc.id, this.newTags)
        });
          console.log('New tag array:')
          console.log(this.newTags)        
      }).then(() => {
        // console.log('now add back new array')
        // sa.assetCollectionDbRef(uid, archiveId).where('tags', 'array-contains', tagTitle).update({
        //   tags: newTags
        // })        
      })
    },
    updateTagsOnAsset(assetId, tags) {

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id

      console.log(assetId)
      console.log(tags)
      sa.assetDocumentDbRef(uid, archiveId, assetId).update({
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
      * 1. Get all of the assets associated with this archive
      * 2. Delete the images from storage associated with this archive
      * 3. Delete the asset's data
      * 4. Delete the archive itself
      */

      // 1: get all of the assets associated with the archive
      sa.assetCollectionDbRef(uid, archiveId).get().then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            // 2: Go through each one, get associated filename, and delete that file from storage
            
            this.numberOfItems = this.numberOfItems + 1 // track number of items to delete from total
  
            // If this record has an assetFileName
            if(doc.data().assetFileName != '') {
              // Delete the main image
              sa.assetStorageRef(uid, archiveId, doc.id, doc.data().assetFileName).delete()
              // Delete the thumbnail
              sa.assetStorageRef(uid, archiveId, doc.id, doc.data().assetFileName, 'thumb_').delete()
            }
            // Delete the asset record
            sa.assetDocumentDbRef(uid, archiveId, doc.id).delete().then(function() { 
              console.log("Asset successfully deleted!");
            }).catch(function(error) {
              console.error("Error removing asset: ", error);
            });
          });

      }).then(() => {

        // 4. Delete the archive itself
        var numberOfItems;
        // Keep track of the number of items this user has
        sa.userArchivesDocumentDbRef(uid).get().then((doc) => {
            if (doc.exists) {
                numberOfItems = doc.data().numberOfItems - this.numberOfItems
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
