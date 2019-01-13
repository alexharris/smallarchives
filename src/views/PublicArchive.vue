<template>
  <div>

          <h1>{{archive.title}}</h1>
          <p>{{archive.desc}}</p>
<hr class="my-4">
          <PublicDisplayAssets />
<hr class="my-4">
  <!-- <a href="" @click.stop="goToUser()">Back to {{ this.username }}'s profile</a> -->
</div>
</template>

<script>

import firebase from 'firebase'
import PublicDisplayAssets from '../components/PublicDisplayAssets'

export default {
  name: 'PublicArchive',
  data () {
    return {
      uid: '',
      key: '',
      archive: {},
      username:''
    }
  },
  components: {
    PublicDisplayAssets
  },
  created () {
    this.getUidFromUsername()
  },
  methods: {
    getUidFromUsername() {
      this.username = this.$route.params.username
      // get the user id based on the displayname from the route
      firebase.firestore().collection('users').where("displayName", "==", this.$route.params.username)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // Assign the user id from thd document to the uid variable
            this.uid = doc.id
            // Pass the id to getArchiveDetails to populate this archives details
            this.getArchiveDetails(doc.id)
        });
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });      
    },
    getArchiveDetails: function() {
      const ref = firebase.firestore().collection('archives').doc(this.uid).collection('userarchives').doc(this.$route.params.id);

      ref.get().then((doc) => {
        if (doc.exists) {

          this.key = doc.id;
          this.archive = doc.data();
        } else {
          alert("No such document!");
        }
      });
    },
    goToUser: function(username) {
      this.$router.push({ name: 'PublicProfile', params: { username: this.username }})
    }
  }
}
</script>
