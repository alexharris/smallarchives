<template>
  <b-row>
    <b-col cols="12">
      <b-btn @click.stop="goBackOne">Back</b-btn>
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
          <b-form-textarea id="textarea1"
                           v-model="archive.desc"
                           placeholder="Enter something"
                           :rows="3"
                           :max-rows="6">
          </b-form-textarea>
        </b-form-group>   
    
        <b-button type="submit" variant="primary">Update</b-button>
        <hr my="4" />
        <b-alert show variant="danger">
          <h4>Delete</h4>
          <p>Warning: Deleting this archive is permanent and you can't get it back</p>
          <b-btn variant="danger" @click.stop="deletearchive(key)">Delete</b-btn>
        </b-alert>
      </b-form>
    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'EditArchive',
  data () {
    return {
      key: this.$route.params.id,
      archive: {},
    }
  },
  created () {
    const ref = firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.archive = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    onSubmit (evt) {
      evt.preventDefault()

      const updateRef = firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives').doc(this.$route.params.id);
      updateRef.set(this.archive).then((docRef) => {
        this.key = ''
        this.archive.title = ''
        this.$router.push({ name: 'ShowArchive', params: { id: this.$route.params.id }})
      })
      .catch((error) => {
        alert("Error adding document: ", error);
      });
    },
    goBackOne() {
      this.$router.go(-1)
    },
    deletearchive (id) {
      firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives').doc(id).delete().then(() => {
        this.$router.push({
          name: 'Archives'
        })
      }).catch((error) => {
        alert("Error removing document: ", error);
      });
    },           
  }
}
</script>
