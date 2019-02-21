<template>
  <div>
    <div class="row">
      <div class="col-12">
        <div class="btn btn-dark" @click.stop="goBack">Back</div>
        <hr class="my-4" />
        <template v-if="errors.length > 0">
          <div class="alert alert-danger" role="alert" show>
            <ul>
              <li v-for="error in errors">{{error}}</li>
            </ul>
          </div>
        </template>
      </div>
    </div>
    <div class="row">
      <div class="col-12">
        <h1 class="h4">
          Add Archive
        </h1>
        <hr class="my-4" />
        <form @submit="onSubmit">
          <!-- Title -->
          <div class="form-group row">
            <label for="inputTitle" class="col-sm-2 col-form-label">Title</label>
            <div class="col-sm-10">
              <input class="form-control" id="inputTitle" placeholder="Archive title" v-model="archive.title">
            </div>
          </div>
          <!-- Description -->
          <div class="form-group row">
            <label for="inputDesc" class="col-sm-2 col-form-label">Description</label>
            <div class="col-sm-10">
              <textarea class="form-control" id="inputTitle" placeholder="Archive description" v-model="archive.desc"></textarea>
            </div>
          </div>   
          <!-- Header image --> 
          <div class="form-group row">
            <label for="selectHeaderImage" class="col-sm-2 col-form-label">Select Header Image</label>
            <div class="col-sm-10">
              <input type="file" id="selectHeaderImage" v-on:change="handleFileChange">
            </div>
          </div> 
          <hr class="my-4" />                                          
          <div class="btn btn-warning" type="submit" @click="onSubmit">Submit</div>
        </form>
      </div>
    </div>

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
    handleFileChange(e, index) {
      this.archiveHeaderImage = e.target.files[0]
    },      
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