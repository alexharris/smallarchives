<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Add Archive
      </h2>

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
            <b-form-input id="desc" v-model.trim="archive.desc"></b-form-input>
          </b-form-group>
          <template>
            <div>
              <b-form-file v-model="file" placeholder="Choose a file..."></b-form-file>
              <div class="mt-3">Selected file: {{file && file.name}}</div>
            </div>
          </template>          
          <b-button type="submit" variant="primary">Save</b-button>
        </b-form>
    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'
import UploadAsset from '../components/UploadAsset'

export default {
  name: 'AddArchive',
  data () {
    return {
      ref: firebase.firestore().collection('archives'),
      archive: {},
      uid: '',
      file: null,
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

      firebase.storage().ref(this.uid + '/' + file.name).put(file).then(function(snapshot) {
        console.log('Uploaded a blob or file!');
      });

      this.$router.push({
        name: 'Archives'
      })

      //-------------
      // ADD ARCHIVE DATA
      //-------------

      firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").add({
        title: this.archive.title,
        desc: this.archive.desc,
        file: file.name
      }).catch((error) => {
        alert("Error adding document: ", error);
      });      

      // this.ref.add(this.archive).then((docRef) => {
      //   this.archive.title = ''
      //   console.log(this.archive.uid)
      //   this.archive.userid = ''
      //   this.$router.push({
      //     name: 'Archives'
      //   })
      // })
      // .catch((error) => {
      //   alert("Error adding document: ", error);
      // });
    }
  }
}
</script>