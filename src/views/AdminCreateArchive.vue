<template>
  <div>
    <b-row>
      <b-col cols="12">
        <b-btn @click.stop="goBack" variant="dark">Back</b-btn>
        <hr class="my-4" />
        <template v-if="errors.length > 0">
          <b-alert variant="danger" show>
            <ul>
              <li v-for="error in errors">{{error}}</li>
            </ul>
          </b-alert>
        </template>
      </b-col>
    </b-row>
    <b-row>
      <b-col cols="12">
        <h2>
          Add Archive
        </h2>
        <hr class="my-4" />
        <b-form @submit="onSubmit">
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Title">
            <b-form-input id="title" v-model.trim="archive.title"></b-form-input>
          </b-form-group>
          <b-form-group id="fieldsetHorizontal"
                    horizontal
                    :label-cols="4"
                    breakpoint="md"
                    label="Enter Description">
            <b-form-textarea id="desc" v-model="archive.desc"></b-form-textarea>
          </b-form-group>   
          <b-form-group id="uploadAsset"
                        :label-cols="4"
                        breakpoint="md"
                        label="Upload Image" 
                        >
            <b-form-file id="uploadAsset" v-model="archiveHeaderImage" placeholder="Choose a file..."></b-form-file>
          </b-form-group>              
          <b-button type="submit" variant="primary">Submit</b-button>
        </b-form>
      </b-col>
    </b-row>

  </div>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'

export default {
  name: 'AdminCreateArchive',
  data () {
    return {
      archive: {
        title: '',
        desc: ''
      },
      uid: '',
      archiveHeaderImage: null,
      archiveCreationDate: '',
      errors: []
    }
  },
  created() {
    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()

        
      // Check for errors in the form
      this.errors = [] //clear old error array
      //check for completeness
      if(this.archive.title == '') { //title is mandatory
        this.errors.push('Title required')
        return
      }

      // Fake set the image name field if no image is added
      if(this.archiveHeaderImage === null) {
        this.archiveHeaderImage = {
          name: ''
        }
      }

      //-------------
      // ADD ARCHIVE DATA
      //-------------

      sa.archiveCollectionDbRef(this.uid).add({
        title: this.archive.title,
        desc: this.archive.desc,
        headerImage: this.archiveHeaderImage.name,
        dateCreated: new Date()
      }).catch((error) => {
        alert("Error adding document: ", error);
      }).then((docRef) => {
        if(this.archiveHeaderImage.name != '') {
          this.addArchiveHeaderImage(docRef.id)
        }
      }).then(() => {
        this.$router.push({
          name: 'Admin',
        })         
      })  
    },
    addArchiveHeaderImage(archiveId) {
      //-------------
      // UPLOAD IMAGE 
      //-------------

      var file = this.archiveHeaderImage // use the Blob or File API

      if(file != null) {

        var uid = this.uid
        var achiveId = archiveId
        var fileName = file.name

        // Check to see if a file exists before uploading, by trying to get the download URL

        sa.archiveStorageRef(uid, archiveId, fileName).getDownloadURL().then((url) => {
          // this means we got a URL, which means it exists, which means we throw an error
          this.errors.push('This archive already contains a file with this name!')
        }).catch((error) => {
          // but if a not found error message returns, it means it wasnt found, which means we should upload it
          console.log(error.code)
         sa.archiveStorageRef(uid, archiveId, fileName).put(file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
          });
        })
      }  
    },
    goBack() {
        this.$router.push({
          name: 'AdminListArchives',
        }) 
    }
  }
}
</script>