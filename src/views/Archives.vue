<template>
  <div>
    <b-row class="mb-3">
      <b-button href="/admin/add-archive" variant="primary">New Archive</b-button>
    </b-row>
    <b-row>
      <b-table striped hover :items="archives" :fields="fields">
        <template slot="actions" scope="row">
          <b-btn size="sm" @click.stop="details(row.item)">Details</b-btn>&nbsp;
          <b-btn size="sm" @click.stop="linkToPublicView(row.item)">View</b-btn>&nbsp;
        </template>
      </b-table>
    </b-row>
  </div>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'Archives',

  data () {
    return {
      fields: {
        title: { label: 'Title', sortable: true, 'class': 'text-left' },
        actions: { label: 'Action', 'class': 'text-center' }
      },
      archives: [],
      errors: [],
      ref: firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives'),
      displayName: ''
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

    // //get the doc for the current user
    var userRef = firebase.firestore().collection("users").doc(firebase.auth().currentUser.uid);
    // get the display name from the uid
    userRef.get().then((doc) => {
      if (doc.exists) {
        this.displayName = doc.data().displayName
      } else {
        console.log("No such document!");
      }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

   
  },
  methods: {
    details (archive) {
      this.$router.push({ name: 'ShowArchive', params: { id: archive.key }})
    },
    linkToPublicView (archive) {
      this.$router.push({ name: 'PublicArchive', params: { id: archive.key, username: this.displayName }})
    }  
  },
}
</script>
