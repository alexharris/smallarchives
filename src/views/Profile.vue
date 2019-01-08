<template>
  <div class="profile">
    <h1>Profile</h1>
    <ul>
      <li>{{ email }}</li>
      <li>{{ uid }}</li>
      <li>{{ displayName }}</li>
    </ul>

    <UserProfileForm />

  </div>
</template>

<script>

import firebase from 'firebase';
import UserProfileForm from '../components/UserProfileForm'

export default {
  name: "Profile",
  components: {
    UserProfileForm
  },
  data() {
    return {
      email: '',
      uid: '',
      displayName: ''
    }
  },
  created () {

    var currentUser = firebase.auth().currentUser;
    var email;
    if (currentUser != null) {
      this.email = currentUser.email;
      this.uid = currentUser.uid;
    }
    //get user id from auth
    // console.log(this.uid);

    //get the doc for the current user
    var userRef = firebase.firestore().collection("users").doc(this.uid);

    //update it
    userRef.get().then((doc) => {
        if (doc.exists) {
            this.displayName = doc.data().displayName
        } else {
            // doc.data() will be undefined in this case
            console.log("No such document!");
        }
    }).catch(function(error) {
        console.log("Error getting document:", error);
    });

  },
  computed: {
    getUserIdFromDisplayName: function() {
      return 'alex'
    }
  }
};
</script>
