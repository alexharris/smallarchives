<template>
  <div class="row">
    <div class="col-12">
      <div class="btn btn-dark" @click.stop="goBack">Back</div>
      <hr class="my-4" />
      <h4>Basic Info</h4>      
      <form @submit="onSubmit">
        <!-- Coverage -->
        <div class="form-group row">
          <label for="inputTitle" class="col-sm-2 col-form-label">Title</label>
          <div class="col-sm-10">
            <input class="form-control" id="inputTitle" placeholder="Archive Title" v-model="archive.title">
          </div>
        </div> 
        <!-- Desc -->
        <div class="form-group row">
          <label for="inputDesc" class="col-sm-2 col-form-label">Title</label>
          <div class="col-sm-10">
            <textarea class="form-control" id="inputDesc" placeholder="Archive Description" v-model="archive.desc"></textarea>
          </div>
        </div>   

        <div v-if="archive.headerImage" class="my-4">
          <div class="row">
            <div class="col-sm-2">Header Image</div>
            <div class="cols-m-10">
              <ArchiveHeaderImage />
              <div @click.stop="archive.headerImage = ''" class="btn btn-info my-4">Remove</div>
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
      <hr my="4" />
        <div class="btn btn-lg btn-primary" type="submit">Update Archive</div>
        <hr my="4" />
        <div class="alert alert-danger" show>
          <h4>Delete</h4>
          <p>Warning: Deleting this archive is permanent and you can't get it back</p>
         
          <div class="btn btn-danger" @click.stop="deletearchive(key)">Delete</div>
        </div>
      </form>
      Archive ID: {{key}}
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
      newHeaderImage: ''
    }
  },
  created () {

    // get existing data
    var uid = firebase.auth().currentUser.uid
    var archiveId = this.$route.params.archive_id

    sa.archiveDocumentDbRef(uid, archiveId).get().then((doc) => {
      if (doc.exists) {
        this.archive = doc.data();
        this.originalHeaderImage = doc.data().headerImage
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

        // First the images from storage
        sa.deleteArchiveHeaderImage (uid, archiveId, this.originalHeaderImage)

        // Delete the archive from the db
        sa.archiveDocumentDbRef(uid, archiveId).delete().then(function() {
            console.log("Document successfully deleted!");
        }).catch(function(error) {
            console.error("Error removing document: ", error);
        });

        // delete the containing folder
        sa.archiveDocumentDbRef(uid, archiveId).parent().delete()

      })
      


    },           
  }
}
</script>
