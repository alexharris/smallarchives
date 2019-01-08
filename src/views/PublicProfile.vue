<template>
  <div class="profile">
    <h1>Profile</h1>
    <ul>
      <li>{{ displayName }}</li>
      <li>{{ uid }}</li>
    </ul>
    <ul id="example-1">
      <li v-for="item in archives">
        <a href="#" @click.stop="details(item)">{{ item.title }}</a>
      </li>
    </ul>        
  </div>
</template>

<script>

import firebase from 'firebase'

export default {
  name: "PublicProfile",
  data() {
    return {   
      archives: [],
      uid: '',
    }
  },
  created() {
    // get the user id based on the displayname from the route
    firebase.firestore().collection('users').where("displayName", "==", this.displayName)
    .get()
    .then((querySnapshot) => {
      querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // Assign the user id from thd document to the uid variable
          this.uid = doc.id
          // Pass the id to getUserArchives to populate that users archives
          this.getUserArchives(doc.id)
      });
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  },
  computed: {
    displayName: function() {
      return this.$route.params.username
    },
    getUserArchives: function() {
          // use the user id to get the archives associated with that user
      firebase.firestore().collection("archives").doc(this.uid).collection("userarchives")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          // console.log(doc.id, " => ", doc.data());
          this.archives.push({
            key: doc.id,
            title: doc.data().title,
            desc: doc.data().desc
          });
        });
      });       
    }   
  },
  methods: {
    details (item) {
      this.$router.push({ name: 'PublicArchive', params: { id: item.key, username: this.displayName }})
    }
  }   
};
</script>
