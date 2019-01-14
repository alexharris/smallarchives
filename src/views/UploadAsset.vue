

  <template>
  <div>
    <!-- <b-btn v-b-modal.modal1>Add Image</b-btn> -->
    <b-btn @click.stop="goBackOne">Back</b-btn>
    <hr class="my-4" />
    <template v-if="errors.length > 0">
      <b-alert variant="danger" show>
        <ul>
          <li v-for="error in errors">{{error}}</li>
        </ul>
      </b-alert>
    </template> 
    <!-- Modal Component -->
    <!-- <b-modal id="modal1" ref="myModalRef" title="Bootstrap-Vue" @ok="onSubmit"> -->
      <b-form>
        <b-form-group id="assetTitle"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Enter Title">
          <b-form-input id="assetTitle" v-model="assetTitle"></b-form-input>
        </b-form-group> 
        <b-form-group id="uploadAsset"
                      horizontal
                      :label-cols="4"
                      breakpoint="md"
                      label="Upload Asset">
          <b-form-file id="uploadAsset" v-model="file" placeholder="Choose a file..."></b-form-file>
        </b-form-group>
        <hr class="my-4" />
        <h3>Custom Fields</h3>
        <ul>
          <li bg-variant="light" v-for="(customField,fieldId) in customFields">
            <div>
              <b-form-group label="Label"
                            label-for="customFieldLabel">
                <b-form-input id="customFieldLabel" v-model="customField.fieldLabel"></b-form-input>
              </b-form-group>
              <b-form-group label="Value"
                            label-for="customFieldValue">
                <b-form-input id="customFieldValue" v-model="customField.fieldValue"></b-form-input>
              </b-form-group>
            </div>

            <hr class="my-4" />
          </li>  
          <b-btn  variant="outline-primary" @click.stop="addNewCustomField">Add Custom Item</b-btn>

        </ul>  
        <hr class="my-4">
        <b-btn  variant="outline-primary" @click.stop="onSubmit">Save</b-btn>
      </b-form>
    <!-- </b-modal> -->
  </div>    


  </template>
        

<script>

import firebase from 'firebase'

export default {
  name: 'UploadAsset',
  data () {
    return {
      ref: '',
      errors: [],
      archive: {},
      uid: '',
      file: null,
      customFieldLabel: '',
      assetTitle: '',
      customFields: []
  
    }
  },
  created() {
    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
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
      if (!this.file){ //file is mandatory, for now
        this.errors.push('File required')
      }

      //-------------
      // UPLOAD IMAGE
      //-------------
      var file = this.file // use the Blob or File API

      firebase.storage().ref(this.uid + '/' + file.name).put(file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
      });   
    
      //-------------
      // ADD ARCHIVE DATA
      //-------------      
      if (this.file != null && this.assetTitle != null) { // check for any errors
        // If nothing is wrong, add the title, asset and custom fields
        firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").doc(this.$route.params.id).collection('assets').add({
          file: file.name,
          assetTitle: this.assetTitle,
          customFields: this.customFields
        }).catch((error) => {
          alert("Error adding document: ", error);
        }).then(() => {
          console.log('go back one')
        })
      }
    },
    addNewCustomField () {
      this.customFields.push({fieldLabel: '', fieldValue: '' });
    },
    goBackOne() {
      this.$router.go(-1)
    }    
  }
}
</script>