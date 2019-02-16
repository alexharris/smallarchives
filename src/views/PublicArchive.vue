<template>
  <div>
    <div class="row mb-5 pb-4">
      <div class="col-12">
        <div class="row">
          <div class="col-12 col-md-4 mb-4 justify-content-md-center" v-if="headerImage != ''">
            <ArchiveHeaderImage />
          </div>  
          <div class="col-12 col-md-8 mb-4">      
            <h1 class="h1 pb-3">{{archive.title}}</h1>
            <p>{{archive.desc}}</p>
            <p><small>This archive contains <strong>{{assetCount}}</strong> items. <br />It was created on <strong>{{creationDate}}</strong> by <strong><a href="" @click.stop="goToUser()">{{ this.username }}</a></strong>.</small></p>            
          </div>
        </div>
        <PublicListAssets />        
      </div>        
    </div>


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
      creationDate: '',
      headerImage: ''
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
          this.headerImage = doc.data().headerImage
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

<style>
  .table-dark {
    color: #000;
    background-color: #fffade;
    border: 1px solid #000;
    border-top: 1px solid #000;
  }

  .table-dark thead th {
    background-color: #f7f2d7 !important;
    border:0;
    border-bottom: 1px solid #d8d4bc;
    font-weight: 400;
  }

  .table-dark td {
    border: 1px solid #000;
  }
</style>
