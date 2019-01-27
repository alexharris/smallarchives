<template>
  <div>
      <b-row>
        <b-col cols="12" class="col-md-8 my-5">
          <ArchiveHeaderImage />
          <h1>{{archive.title}}</h1>
          <p>{{archive.desc}}</p>
          <p>Number of records: {{assetCount}}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          
          <PublicListAssets />
<!--           <PublicListFacets /> -->

          <!-- <a href="" @click.stop="goToUser()">Back to {{ this.username }}'s profile</a> -->
        </b-col>
    </b-row>
  </div>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'
import PublicListAssets from '../components/PublicListAssets'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'


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
    PublicListAssets,
    ArchiveHeaderImage
  },
  computed: {
    assetCount() {
      return this.$store.getters.getAssetCount
    }
  },
  created () {

    this.getUidFromUsername()
    
      
  },
  methods: {
    async getUidFromUsername() {
      this.uid = await sa.getUidFromUsername('alex')
      this.getArchiveDetails()
    },
    getArchiveDetails: function() {
      var uid = this.uid
      var archiveId = this.$route.params.archive_id

      sa.archiveDocumentDbRef(uid, archiveId).get().then((doc) => {
        if (doc.exists) {

          this.key = doc.id;
          this.archive = doc.data();
        } else {
          console.log("No such document!");
        }
      });
    },
    goToUser: function(username) {
      this.$router.push({ name: 'PublicProfile', params: { username: this.username }})
    }
  }
}
</script>
