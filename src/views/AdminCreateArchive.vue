<template>
  <div class="">


       
        <h1 class="h4">
          New Archive
        </h1>
        
        <p>Set some basic information and settings for your archive. You will be able to change all of this in the future, as well as add advanced configuration such as custom tags and fields.</p>
        <hr class="my-2" />
        <template v-if="errors.length > 0">
          <div class="bg-red-200 p-4 mb-2" role="alert" show>
            <ul>
              <li v-for="error in errors">{{error}}</li>
            </ul>
          </div>
        </template>         
        <form @submit="onSubmit">
          <!-- Title -->
          <FormField 
            id="title"
            label="Title"
            type=""
            placeholder="Title"
            v-model="archive.title"
          />             
          <!-- <div class="form-group row">
            <label for="inputTitle" class="col-sm-2 col-form-label">Title</label>
            <div class="col-sm-10">
              <input class="form-control" id="inputTitle" placeholder="Archive title" v-model="archive.title">
            </div>
          </div> -->
          <!-- Description -->
          <FormField 
            id="description"
            label="Description"
            type="textarea"
            placeholder="Archive Description"
            v-model="archive.desc"
          />             
          <!-- <div class="form-group row">
            <label for="inputDesc" class="col-sm-2 col-form-label">Description</label>
            <div class="col-sm-10">
              <textarea class="form-control" id="inputTitle" placeholder="Archive description" v-model="archive.desc"></textarea>
            </div>
          </div>    -->
          <!-- Header image --> 
          <!-- <div class="form-group row">
            <label for="selectHeaderImage" class="col-sm-2 col-form-label">Select Header Image</label>
            <div class="col-sm-10">
              <input type="file" id="selectHeaderImage" v-on:change="handleFileChange">
            </div>
          </div>  -->
          <FormField 
            id="headerimage"
            label="Header Image"
            type="file"
            placeholder=""
            v-model.lazy="archiveHeaderImage"
          />          
          <!-- Views -->
          <FormField 
            id="listview"
            label="List View"
            type="checkbox"
            placeholder=""
            v-model="showList"
          />             
          <!-- <div class="form-group row">
            <label for="listView" class="col-sm-2 col-form-label">Show List View</label>
            <div class="col-sm-10">
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
            <label for="mapView" class="col-sm-2 col-form-label">Show Map View</label>
            <div class="col-sm-10">
              <input type="checkbox" id="mapView" v-model="showMap">
            </div>
          </div>                                          -->
          <SubmitButton v-on:submit="onSubmit" v-on:cancel="goBack" :formIsLoading="isLoading" />                                          
        </form>

  </div>
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'
import SubmitButton from '../components/SubmitButton'
import FormField from '../components/FormField'

export default {
  name: 'AdminCreateArchive',
  components: {
    SubmitButton,
    FormField
  },   
  data () {
    return {
      archive: {
        title: '',
        desc: ''
      },
      uid: '',
      archiveHeaderImage: null,
      archiveCreationDate: '',
      errors: [],
      showList: true,
      showGrid: true,
      showMap: false,
      isLoading: false
    }
  },
  created() {
    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
  },
  methods: {
    // handleFileChange(e, index) {
    //   this.archiveHeaderImage = e.target.files[0]
    // },      
    onSubmit () {

      this.isLoading = true;
 
      // Check for errors in the form
      this.errors = [] //clear old error array
      //check for completeness
      if(this.archive.title == '') { //title is mandatory
        this.errors.push('Title required')
        this.isLoading = false;
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
        dateCreated: new Date(),
        showMap: this.showMap,
        showGrid: this.showGrid,
        showList: this.showList,
        mapLat: 1,
        mapLong: 1,
        zoom: 0        
      }).catch((error) => {
        alert("Error adding document: ", error);
      }).then((docRef) => {
        if(this.archiveHeaderImage.name != '') {
          this.addArchiveHeaderImage(docRef.id)
          
        }
      }).then(() => {
        
        console.log('4')
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
          name: 'AdminDashboard',
        }) 
    }
  }
}
</script>