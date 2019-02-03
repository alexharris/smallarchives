<template>
  <div>
      <b-row>
        <b-col cols="2" class="col-md-2 my-5">
          <ArchiveHeaderImage />
        </b-col>
        <b-col cols="7" class="col-md-7 my-5">
          <h1>{{archive.title}}</h1>
          <p>{{archive.desc}}</p>
          
        </b-col>
        <b-col cols="3" class="col-md-3 my-5">
          <p>Number of records: {{assetCount}}</p>
          <p>Created on: {{creationDate}}</p>
        </b-col>
      </b-row>
      <b-row>
        <b-col>
          <PublicListAssets />
        </b-col>
      </b-row>
      <hr class="my-4" />
      <b-row class="my-5">
        <b-col>
          <div>This Small Archive was created by <a href="" @click.stop="goToUser()">{{ this.username }}</a></div>
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
      username: this.$route.params.username,
      creationDate: ''
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
      var username = this.$route.params.username
      this.uid = await sa.getUidFromUsername(username)
      this.getArchiveDetails()
    },
    getArchiveDetails: function() {
      var uid = this.uid
      var archiveId = this.$route.params.archive_id

      sa.archiveDocumentDbRef(uid, archiveId).get().then((doc) => {
        if (doc.exists) {

          this.key = doc.id;
          this.archive = doc.data();
          this.creationDate = sa.getFormattedDate(doc.data().dateCreated)
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
