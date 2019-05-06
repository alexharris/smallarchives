<template>
  <div class="profile row justify-content-center">
    <div class="col-10">
      <h3 class="my-4">User Info</h3>
      <ul>
        <li><strong>Username:</strong> {{ displayName }}</li>
        <li><strong>User ID:</strong> {{ uid }}</li>
      </ul>
      <h3 class="my-4">Archives</h3>
      <ul class="list-unstyled">

        <li v-for="item in archives" class="media">
          <ArchiveHeaderImage v-bind:archiveId="item.key" class="mr-3"/>
          <div class="media-body">
            <h5 class="mt-0 mb-1"><a href="#" @click.stop="details(item)">{{ item.title }}</a></h5>
            <p>{{item.desc}}</p>
          </div>
        </li>
      </ul>  
    </div>      
  </div>
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'

export default {
  name: "PublicProfile",
  data() {
    return {   
      archives: [],
      uid: '',
    }
  },
  components: {
    ArchiveHeaderImage
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
