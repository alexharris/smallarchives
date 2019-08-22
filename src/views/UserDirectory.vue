<template>
  <div>
    <h1>User Directory</h1>
    <table class="table" v-if="isSuperAdmin === true">
      <th>User</th><th>Admin</th>
    <tr v-for="user in this.users" >
        
        <td>
          <a :href="'/u/' + user.displayName" @click.stop="goToUser(user.displayName)">{{ user.displayName }}</a>
        </td>
        <td>
          <a v-if="user.displayName != 'demo'" href="#" class="btn btn-sm btn-danger" @click.stop="deleteUser(user.id)">Delete</a>
        </td>
    </tr>
    </table>
    <div v-else>
      Not a super user.
    </div>
  </div>
</template>

<script>

import firebase from 'firebase/app';
import sa from '../sa'

export default {
  name: "UserDirectory",
  data() {
    return {
      users: [],
      isSuperAdmin: false
    }
  },
  created () {

      this.getUsers()

      var currentUser = firebase.auth().currentUser;
      
      if (currentUser.email === 'smallarchives@gmail.com') {
        this.isSuperAdmin = true
      }
  },
  methods: {
    getUsers: function() {

      this.users = []

      sa.userCollectionDbRef()
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

          this.users.push({
            displayName: doc.data().displayName,
            id: doc.id
          });
        });
      });
    },
    goToUser: function(username) {
      this.$router.push({ name: 'PublicProfile', params: { username:  username}})
    },
    deleteUser: function(userId) {
      sa.userCollectionDbRef().doc(userId).delete().then(() => {
          console.log("Document successfully deleted!");
          this.getUsers()
      }).catch(function(error) {
          console.error("Error removing document: ", error);
      });
    }      
  }

};
</script>
