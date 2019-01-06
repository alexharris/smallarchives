<template>
  <b-row>
    <b-col cols="12">
      <h2>
        Archive List
        <b-link href="add-archive">(Add Archive)</b-link>
      </h2>
      <b-table striped hover :items="archives" :fields="fields">
        <template slot="actions" scope="row">
          <b-btn size="sm" @click.stop="details(row.item)">Details</b-btn>
        </template>
      </b-table>
    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'ArchiveList',
  data () {
    return {
      fields: {
        title: { label: 'Title', sortable: true, 'class': 'text-left' },
        actions: { label: 'Action', 'class': 'text-center' }
      },
      archives: [],
      errors: [],
      ref: firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives'),
    }
  },
  created () {
    this.ref.onSnapshot((querySnapshot) => {
      this.archives = [];
      querySnapshot.forEach((doc) => {

        this.archives.push({
          key: doc.id,
          title: doc.data().title
        });
      });
    });
  },
  methods: {
    details (archive) {
      this.$router.push({ name: 'ShowArchive', params: { id: archive.key }})
    }
  }
}
</script>

<style>
  .table {
    width: 96%;
    margin: 0 auto;
  }
</style>