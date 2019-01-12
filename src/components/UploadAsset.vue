

  <template>
  <div>
    <b-btn v-b-modal.modal1>Add Image</b-btn>

    <!-- Modal Component -->
    <b-modal id="modal1" ref="myModalRef" title="Bootstrap-Vue" @ok="onSubmit">
      <b-form >
        <b-form-file v-model="file" placeholder="Choose a file..."></b-form-file>
        <div class="mt-3">Selected file: {{file && file.name}}</div>
      </b-form>
    </b-modal>
  </div>    


  </template>
        

<script>

import firebase from 'firebase'


// userRef = firebase.firestore().collection("users").doc(this.uid);
// console.log(userRef);

export default {
  name: 'UploadAsset',
  data () {
    return {
      ref: firebase.firestore().collection('archives'),
      archive: {},
      uid: '',
      file: null
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

      firebase.storage().ref(this.uid + '/' + file.name).put(file).then((snapshot) => {
        console.log('Uploaded a blob or file!');
        this.$refs.myModalRef.hide()
      });

      firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").doc(this.$route.params.id).collection('assets').add({
        file: file.name
      }).catch((error) => {
        alert("Error adding document: ", error);
      });          


    }    
  }
}
</script>