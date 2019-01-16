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
          <b-form-textarea id="desc" v-model="archive.desc"></b-form-textarea>
        </b-form-group>         
        <b-button type="submit" variant="primary">Save</b-button>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'
export default {
  name: 'AdminAddArchive',
  data () {
    return {
      ref: firebase.firestore().collection('archives'),
      archive: {},
      uid: '',
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
      // ADD ARCHIVE DATA
      //-------------

      firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").add({
        title: this.archive.title,
        desc: this.archive.desc,
        dateCreated: new Date()
      }).catch((error) => {
        alert("Error adding document: ", error);
      });


      this.$router.push({
        name: 'Admin',
      }) 

    }
  }
}
</script>