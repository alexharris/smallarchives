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
        <nav class="navbar navbar-light bg-light">
          <a class="btn btn-secondary" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
            Filter
          </a>
            <span class="navbar-text">
              <div class="btn-group btn-group-toggle">
                <label for="grid" class="btn btn-secondary" v-bind:class="gridViewType">
                  <input type="radio" id="grid" value="grid" v-model="viewType"> <font-awesome-icon icon="th" size="1x" />
                </label>
                <label for="list" class="btn btn-secondary" v-bind:class="listViewType">
                  <input type="radio" id="list" value="list" v-model="viewType"> <font-awesome-icon icon="th-list" size="1x" />
                </label>
              </div>      
            </span>  

        </nav>        
        <div class="collapse" id="collapseExample">
          <div class="row">
            <div class="col-3">
              <form>
                <div class="form-group">
                  <label for="itemTypeFilter">Item Type</label>
                  <select class="custom-select" v-model="selectedAssetType">
                    <option :selected="true">All</option>
                    <option v-for="type in uniqueAssetTypes">{{type}}</option>
                  </select>
                </div>
              </form>
            </div> 
          </div>
        </div>

        <PublicListAssets v-show="this.viewType == 'list'" v-bind:filteredAssetType="this.selectedAssetType"/>  
        <PublicGridAssets v-show="this.viewType == 'grid'" v-bind:filteredAssetType="this.selectedAssetType"/>        
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
      assets: [],
      viewType: 'grid',
      selectedAssetType: 'All',
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
    },
    uniqueAssetTypes() {
      return [...new Set(this.assets.map(p => p.assetType))]
    },
    gridViewType() {
      return {
        active: this.viewType == 'grid'
      }
    },
    listViewType() {
      return {
        active: this.viewType == 'list'
      }
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
      this.createAssetArray()
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
    createAssetArray: function() {

      var uid = this.uid
      var archiveId = this.$route.params.archive_id
    console.log(this.selectedAssetType)
      sa.assetCollectionDbRef(uid, archiveId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.assets.push({
            fileName: doc.data().file,
            assetTitle: doc.data().assetTitle,
            assetId: doc.id,
            assetCreationDate: sa.getFormattedDate(doc.data().assetCreationDate),
            assetText: doc.data().assetText,
            assetType: doc.data().assetType,
          });
        });
        //tell the parent about how many assets there are
        this.$store.commit('setAssetCount', this.assets.length)
      });
    },    
    goToUser: function(username) {
      this.$router.push({ name: 'PublicProfile', params: { username: this.username }})
    },
    switchViewType: function(e) {
      console.log(e)
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
