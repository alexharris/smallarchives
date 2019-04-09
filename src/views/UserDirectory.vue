<template>
  <div>
    <h1>User Directory</h1>
    <ul v-for="user in this.users">
        <li><a href="" @click.stop="goToUser(user)">{{ user }}</a></li>
    </ul>
  </div>
</template>

<script>

import firebase from 'firebase';
import sa from '../sa'

export default {
  name: "UserDirectory",
  data() {
    return {
      users: []
    }
  },
  created () {
      sa.userCollectionDbRef()
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            this.users.push(doc.data().displayName)
        });
      });
  },
  methods: {
    goToUser: function(username) {
      this.$router.push({ name: 'PublicProfile', params: { username:  username}})
    },      
  }
};
</script>
