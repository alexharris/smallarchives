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
import sa from '../sa'

export default {
  name: "PublicProfile",
  data() {
    return {   
      archives: [],
      uid: '',
    }
  },
  created() {
    this.getUidFromUsername()
  },
  computed: {
    displayName: function() {
      return this.$route.params.username
    }  
  },
  methods: {
    async getUidFromUsername() {
      var username = this.$route.params.username
      this.uid = await sa.getUidFromUsername(username)
      // send to 404 when no UID matches
      if(this.uid === false) {
        this.$router.push('/404')
      }
      this.getUserArchives()
    },       
    details (item) {
      this.$router.push({ name: 'PublicArchive', params: { archive_id: item.key, username: this.displayName }})
    },
    getUserArchives: function() {

      var uid = this.uid
      sa.archiveCollectionDbRef(uid)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.archives.push({
            key: doc.id,
            title: doc.data().title,
            desc: doc.data().desc
          });
        });
      });       
    }     
  }   
};
</script>
