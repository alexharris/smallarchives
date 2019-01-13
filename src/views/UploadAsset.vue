

  <template>
  <div>
    <!-- <b-btn v-b-modal.modal1>Add Image</b-btn> -->
<b-btn @click.stop="goBackOne">Back</b-btn>
<hr class="my-4" />
    <!-- Modal Component -->
    <!-- <b-modal id="modal1" ref="myModalRef" title="Bootstrap-Vue" @ok="onSubmit"> -->
      <b-form >
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
        <hr class="my-4">
        <b-btn  variant="outline-primary" @click.stop="onSubmit">Submit</b-btn>
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
      ref: firebase.firestore().collection('archives'),
      archive: {},
      uid: '',
      file: null,
      assetTitle: ''
    }
  },
  created() {
    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
  },  
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      
      //-------------
      // UPLOAD IMAGE
      //-------------
      var file = this.file // use the Blob or File API
      var assetTitle = this.assetTitle

      firebase.storage().ref(this.uid + '/' + file.name).put(file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        //-------------
        // ADD ARCHIVE DATA
        //-------------      

        firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").doc(this.$route.params.id).collection('assets').add({
          file: file.name,
          assetTitle: assetTitle
        }).catch((error) => {
          alert("Error adding document: ", error);
        });  

        this.goBackOne();
        

      });



    },
    goBackOne() {
      this.$router.go(-1)
    }    
  }
}
</script>