<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Show Archive
        <b-link href="/list">(Archive List)</b-link>
      </h2>
      <b-jumbotron>
        <template slot="header">
          {{archive.title}}
        </template>
        <template slot="lead">
          Title: {{archive.title}}<br>
        </template>
        <hr class="my-4">
        <b-btn class="edit-btn" variant="success" @click.stop="editarchive(key)">Edit</b-btn>
        <b-btn variant="danger" @click.stop="deletearchive(key)">Delete</b-btn>
      </b-jumbotron>
    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'ShowArchive',
  data () {
    return {
      key: '',
      archive: {}
    }
  },
  created () {
    const ref = firebase.firestore().collection('archives').doc(this.$route.params.id);
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
      firebase.firestore().collection('archives').doc(id).delete().then(() => {
        this.$router.push({
          name: 'ArchiveList'
        })
      }).catch((error) => {
        alert("Error removing document: ", error);
      });
    }
  }
}
</script>

<style>
  .jumbotron {
    padding: 2rem;
  }
  .edit-btn {
    margin-right: 20px;
    width: 70px;
  }
</style>