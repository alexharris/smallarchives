<template>
  <div>
    <div class="row mb-5 pb-4">
      <div class="col-12">
        <div class="row mb-5 py-3">
          <div class="col-12 col-md-3 mb-4 justify-content-md-center" v-if="headerImage != ''">
            <ArchiveHeaderImage />
          </div>  
          <div class="col-12 col-md-9 mb-4">      
            <h1 class="h1 pb-3">{{archive.title}}</h1>
            <p>{{archive.desc}}</p>
            <p><small>This archive contains <strong>{{assetCount}}</strong> items. <br />It was created on <strong>{{creationDate}}</strong> by <strong><a href="" @click.stop="goToUser()">{{ this.username }}</a></strong>.</small></p>            
          </div>
        </div>
        <div class="row">
          <div class="col-12">
            <switcher v-model="switcherValue" />
            <div class="visual-label">List/Grid</div> 
          </div>
        </div>
        <hr />
        <PublicListAssets v-if="switcherValue"/>  
        <PublicGridAssets v-if="!switcherValue"/>        
      </div>        
    </div>


  </div>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'
import PublicListAssets from '../components/PublicListAssets'
import PublicGridAssets from '../components/PublicGridAssets'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'
import Switcher from '../components/Switcher'


export default {
  name: 'PublicArchive',
  data () {
    return {
      uid: '',
      key: '',
      archive: {},
      username: this.$route.params.username,
      creationDate: '',
      headerImage: '',
      switcherValue: false
    }
  },
  components: {
    PublicListAssets,
    PublicGridAssets,
    ArchiveHeaderImage,
    Switcher
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
      // send to 404 when no UID matches
      if(this.uid === false) {
        this.$router.push('/404')
      }      
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
          this.$router.push('/404')
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
