<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Add Archive
        <b-link href="archives">(Archive List)</b-link>
      </h2>
      <b-jumbotron>
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
          </b-form-group>
          <b-button type="submit" variant="primary">Save</b-button>
        </b-form>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'
import UserProfileForm from '../components/UserProfileForm'


// userRef = firebase.firestore().collection("users").doc(this.uid);
// console.log(userRef);

export default {
  name: 'AddArchive',
  data () {
    return {
      ref: firebase.firestore().collection('archives'),
      archive: {},
      uid: ''
    }
  },
  created() {
    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()
      // Add a new document to Archives > {user id} > UserArchives

      firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").add({
        title: this.archive.title,
        desc: this.archive.desc
      }).catch((error) => {
        alert("Error adding document: ", error);
      });

      this.$router.push({
        name: 'Archives'
      })

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

<style>
  .jumbotron {
    padding: 2rem;
  }
</style>