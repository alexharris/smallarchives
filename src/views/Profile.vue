<template>
  <div class="profile">
    <h1>Profile</h1>
    <ul>
      <li><strong>Username:</strong> {{ displayName }} <!--(<router-link to="/admin/edit-profile">edit</router-link>) -->
      <li><strong>Email Address:</strong> {{ email }}</li>
      <li><strong>User ID:</strong> {{ uid }}</li>
</li>
    </ul>
  </div>
</template>

<script>

import firebase from 'firebase';

export default {
  name: "Profile",
  data() {
    return {
      email: '',
      uid: ''
    }
  },
  created () {
    var currentUser = firebase.auth().currentUser;
    var email;
    if (currentUser != null) {
      this.email = currentUser.email;
      this.uid = currentUser.uid;
    }
  },
  computed: {
    displayName: function() {
      return this.$store.getters.getUser.displayName;
    },   
  },   
};
</script>
