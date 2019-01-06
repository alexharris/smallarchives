<template>
  <div class="home">
    <h1>Welcome</h1>
    <ul>
      <li>{{ email }}</li>
      <li>{{ uid }}</li>
      <li>{{ displayName }}</li>
    </ul>


    <button @click="logout">Logout</button>

    <UserProfileForm />

  </div>
</template>

<script>

import firebase from 'firebase';
import UserProfileForm from '../components/UserProfileForm'

export default {
  name: "home",
  components: {
    UserProfileForm
  },
  data() {
    return {
      email: 'hello',
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
    console.log(this.uid);

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
  methods: {
  	logout: function() {
  		firebase.auth().signOut().then(() => {
  			this.$router.replace('login')
  		})
  	}
  }
};
</script>
