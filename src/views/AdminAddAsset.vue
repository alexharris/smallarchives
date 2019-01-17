<template>
    <div>
      <b-btn @click.stop="goBackOne" variant="outline-secondary">Back</b-btn>
      <hr class="my-4" />
      <template v-if="errors.length > 0">
        <b-alert variant="danger" show>
          <ul>
            <li v-for="error in errors">{{error}}</li>
          </ul>
        </b-alert>
      </template>
  
      <b-form>
        <b-form-group id="assetTitle"
                      :label-cols="4"
                      breakpoint="md"
                      label="Enter Title">
          <b-form-input id="assetTitle" v-model="assetTitle"></b-form-input>
        </b-form-group> 
        <b-form-group id="assetDescription"
                      :label-cols="4"
                      breakpoint="md"
                      label="Enter Description">
          <b-form-textarea id="assetDescription" v-model="assetDescription"></b-form-textarea>
        </b-form-group>  
        <hr class="my-4" />
        <h4>Add Asset</h4>
        <b-form-group id="assetTitle"
                      :label-cols="4"
                      breakpoint="md"
                      label="Select Item Type">        
          <template>
            <div>
              <b-form-select v-model="selectedAssetType">
                <!-- these options will appear after the ones from 'options' prop -->
                <option value="image">Image</option>
                <option value="audio">Audio</option>
                <option value="text">Text</option>
              </b-form-select>
            </div>
          </template>   
        </b-form-group>      
        <b-form-group id="uploadAsset"
                      :label-cols="4"
                      breakpoint="md"
                      label="Upload Image" 
                      v-if="selectedAssetType === 'image'">
          <b-form-file id="uploadAsset" v-model="file" placeholder="Choose a file..."></b-form-file>
        </b-form-group>
        <b-form-group id="uploadAsset"
                      :label-cols="4"
                      breakpoint="md"
                      label="Upload Audio Asset" 
                      v-if="selectedAssetType === 'audio'">
          <b-form-file id="uploadAsset" v-model="file" placeholder="Choose a file..."></b-form-file>
        </b-form-group>        
        <b-form-group id="assetDescription"
                      :label-cols="4"
                      breakpoint="md"
                      label="Text"
                      v-if="selectedAssetType === 'text'">
          <b-form-textarea id="assetDescription" v-model="text"></b-form-textarea>
        </b-form-group>         
        <hr class="my-4" />
        <h4>Custom Fields</h4>
        <table class="table-bordered table">
          <thead>
            <tr>
              <th scope="col">Field</th>
              <th scope="col">Value</th>
              <th scope="col">Action</th>
            </tr>
          </thead>          
          <tr v-for="(item,itemId) in customFields">
            <td>{{item.fieldLabel}}</td>
            <td>{{item.fieldValue}}</td>
            <td><b-btn @click.stop="deleteCustomField(itemId)" variant="outline-danger">Delete</b-btn></td>
          </tr>
        </table> 
        <div>
          <b-btn v-b-toggle.collapse1 variant="outline-secondary">Add Custom Field</b-btn>
          <b-collapse id="collapse1" class="mt-2">
            <b-card>
              <b-form-group label="Label"
                            label-for="customFieldLabel">
                <b-form-input id="customFieldLabel" v-model="newCustomField.fieldLabel"></b-form-input>
              </b-form-group>
              <b-form-group label="Value"
                            label-for="customFieldValue">
                <b-form-input id="customFieldValue" v-model="newCustomField.fieldValue"></b-form-input>
              </b-form-group>
              <b-btn  @click.stop="addCustomField()" variant="outline-primary">Add</b-btn>
            </b-card>
          </b-collapse>
        </div>
        <hr class="my-4" />
        <b-btn  variant="primary" @click.stop="onSubmit">Submit</b-btn>
      </b-form>
    </div>    
  </template>
        

<script>

import firebase from 'firebase'

export default {
  name: 'AdminAddAsset',
  data () {
    return {
      ref: '',
      errors: [],
      archive: {},
      uid: '',
      file: null,
      text: '',
      customFieldLabel: '',
      assetTitle: '',
      assetDescription: '',
      customFields: [],
      newCustomField: {
        fieldLabel:'',
        fieldValue:''
      },      
      selectedAssetType: '',
      assetCreationDate: ''
    }
  },
  created() {
    var currentUser = firebase.auth().currentUser
    this.uid = currentUser.uid
  },  
  methods: {
    onSubmit (evt) {
      evt.preventDefault()

      // empty the error variable to get rid of old errors
      this.errors = []

      // check the form for completeness
      if (!this.assetTitle) { // title is mandatory
        this.errors.push('Title required')
      } 

      this.assetCreationDate = new Date();

      //-------------
      // UPLOAD IMAGE 
      //-------------

      var file = this.file // use the Blob or File API

      if(file != null) {
        // Check to see if a file exists before uploading, by trying to get the download URL
        firebase.storage().ref(this.uid + '/' + this.$route.params.id + '/' + file.name).getDownloadURL().then((url) => {
          // this means we got a URL, which means it exists, which means we throw an error
          this.errors.push('This archive already contains a file with this name!')
        }).catch((error) => {
          // but if a not found error message returns, it means it wasnt found, which means we should upload it
          console.log(error.code)
         firebase.storage().ref(this.uid + '/' + this.$route.params.id + '/' + file.name).put(file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
            this.addArchiveDataToDatabase()
          });
        })
      } else {
        this.addArchiveDataToDatabase()
      }
    },
    addArchiveDataToDatabase() {

      //this is because sometimes there is no file, so we have to fake it
      var file = this.file

      if(file == null) {
        file = {}
        file.name = ''
      }
      
      //-------------
      // ADD ARCHIVE DATA
      //-------------      
      if (this.assetTitle != null) { // check for any errors
        // If nothing is wrong, add the title, asset and custom fields
        firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").doc(this.$route.params.id).collection('assets').add({
          file: file.name,
          assetTitle: this.assetTitle,
          customFields: this.customFields,
          assetDescription: this.assetDescription,
          assetCreationDate: this.assetCreationDate,
          assetType: this.selectedAssetType,
          assetText: this.text
        }).catch((error) => {
          alert("Error adding document: ", error);
        }).then(() => {
          this.$router.go(-1)
        })
      }
    },
    addCustomField () {
      this.customFields.push({fieldLabel: this.newCustomField.fieldLabel, fieldValue: this.newCustomField.fieldValue });
      this.newCustomField.fieldLabel = ''
      this.newCustomField.fieldValue = ''
    },  
    goBackOne() {
      this.$router.go(-1)
    }    
  }
}
</script>