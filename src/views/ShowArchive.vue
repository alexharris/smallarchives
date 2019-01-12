<template>
  <b-row>
    <b-col cols="12">


        <b-link href="/archives">Back to archives</b-link>


        <template slot="header">
          {{archive.title}}
        </template>
        <template slot="lead">
          <p>{{archive.desc}}</p>
        </template>
        <ListAssets />  
        <hr class="my-4">
        <UploadAsset />   
        <hr class="my-4">
        <b-btn class="edit-btn" variant="success" @click.stop="editarchive(key)">Edit</b-btn>
        <b-btn variant="danger" @click.stop="deletearchive(key)">Delete</b-btn>
 
    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'
import ListAssets from '../components/ListAssets'
import UploadAsset from '../components/UploadAsset'

export default {
  name: 'ShowArchive',
  components: {
    UploadAsset,
    ListAssets
  },  
  data () {
    return {
      key: '',
      archive: {}
    }
  },
  created () {
    const ref = firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives').doc(this.$route.params.id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.key = doc.id;
        this.archive = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    editarchive (id) {
      this.$router.push({
        name: 'EditArchive',
        params: { id: id }
      })
    },
    deletearchive (id) {
      firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives').doc(id).delete().then(() => {
        this.$router.push({
          name: 'Archives'
        })
      }).catch((error) => {
        alert("Error removing document: ", error);
      });
    }
  }
}
</script>
