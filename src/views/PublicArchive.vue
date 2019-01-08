<template>
  <b-row>
    <b-col cols="8">



          <h1>{{archive.title}}</h1>

          <p>{{archive.desc}}</p>

    </b-col>
  </b-row>
</template>

<script>

import firebase from 'firebase'

export default {
  name: 'PublicArchive',
  data () {
    return {
      key: '',
      archive: {}
    }
  },
  created () {
    const ref = firebase.firestore().collection('archives').doc(this.$route.params.user_id).collection('userarchives').doc(this.$route.params.doc_id);
    ref.get().then((doc) => {
      if (doc.exists) {
        this.key = doc.id;
        this.archive = doc.data();
      } else {
        alert("No such document!");
      }
    });
  }
}
</script>
