<template>
  <b-row>
    <b-col cols="12">
      <b-btn @click.stop="goBackOne">Back</b-btn>
      <hr class="my-4" />
      <h4>Basic Info</h4>      
      <b-form @submit="onSubmit">
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Title">
          <b-form-input id="title" v-model.trim="archive.title"></b-form-input>
        </b-form-group>
        <b-form-group id="fieldsetHorizontal"
                  horizontal
                  :label-cols="4"
                  breakpoint="md"
                  label="Description">
          <b-form-textarea id="textarea1"
                           v-model="archive.desc"
                           placeholder="Enter something"
                           :rows="3"
                           :max-rows="6">
          </b-form-textarea>
          </b-form-group>
          <h4>Header Image</h4>  
          Original Header Image: {{originalHeaderImage}}<br/>
          Header Image: {{archive.headerImage}}<br/>
          New Header Image: {{newHeaderImage.name}}<br />
          <div v-if="archive.headerImage">
            <ArchiveHeaderImage />
            <b-button @click.stop="archive.headerImage = ''" variant="primary">Remove</b-button>
          </div>
          <div v-else>
            <b-form-group id="uploadAsset"
                          :label-cols="4"
                          breakpoint="md"
                          label="Upload Image">

              <b-form-file id="uploadAsset" 
                           v-model="newHeaderImage" 
                           placeholder="Choose a file..."
                           :rows="3"
                           :max-rows="6" 
              ></b-form-file>
            </b-form-group> 
          </div>
        </b-form-group>   
        <hr my="4" />
        <b-button type="submit" variant="primary">Update</b-button>
        <hr my="4" />
        <b-alert show variant="danger">
          <h4>Delete</h4>
          <p>Warning: Deleting this archive is permanent and you can't get it back</p>
         
          <b-btn variant="danger" @click.stop="deletearchive(key)">Delete</b-btn>
        </b-alert>
      </b-form>
      Archive ID: {{key}}
    </b-col>
  </b-row>
   
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
    goBackOne() {
      this.$router.go(-1)
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
