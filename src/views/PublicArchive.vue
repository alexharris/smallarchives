<template>
  <div>

    <div class="row mb-5 px-md-5 pb-4 justify-content-center">
      <div class="col-12 col-xl-10">
        <div class="row mb-5 py-3">
          <div class="col-12 col-md-3 mb-4 justify-content-md-center" v-if="headerImage != ''">
            <ArchiveHeaderImage v-bind:archiveId="this.archiveId"/>
          </div>  
          <div class="col-12 col-md-9 mb-4">      
            <h1 class="h1 pb-3">{{archive.title}}</h1>
            <p>{{archive.desc}}</p>
            <p><small>This archive contains <strong>{{assetCount}}</strong> items. <br />It was created on <strong>{{creationDate}}</strong> by <strong><a href="" @click.stop="goToUser()">{{ this.username }}</a></strong>.</small></p>            
          </div>
        </div>
        <nav class="navbar nav-light">
           <span class="navbar-text">
            <a class="btn btn-outline-secondary mr-3" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample">
              Filter <font-awesome-icon icon="filter" size="1x" />
              <!-- <font-awesome-icon icon="times" size="1x" /> -->
            </a>
            <div class="btn-group btn-group-toggle">
              <label for="grid" class="btn btn-outline-secondary" v-bind:class="gridViewType">
                <input type="radio" id="grid" value="grid" v-model="viewType"> <font-awesome-icon icon="th" size="1x" />
              </label>
              <label for="list" class="btn btn-outline-secondary" v-bind:class="listViewType">
                <input type="radio" id="list" value="list" v-model="viewType"> <font-awesome-icon icon="th-list" size="1x" />
              </label>

<!--               <label for="map" class="btn btn-outline-secondary" v-bind:class="mapViewType">
                <input type="radio" id="map" value="map" v-model="viewType"> <font-awesome-icon icon="map-marker-alt" size="1x" />
              </label>  -->             
            </div>      
          </span>  
        </nav>        
        <div class="collapse py-4" id="collapseExample">
          <div class="row">
            <div class="col-12 col-md-3">
              <form>
                <div class="form-group">                
                  <div class="input-group input-group-sm">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect02">Type</label>
                    </div> 
                    <select class="custom-select mediaTypeFilter" v-on:change="updateQueryParams" :value="selectedMediaType" ref="mediaTypeFilter">
                      <option :selected="true">All</option>
                      <option v-for="type in uniqueAssetTypes">{{type}}</option>
                    </select>
                    <div class="input-group-append" v-if="selectedMediaType != 'All'">
                      <button class="btn btn-danger" type="button" id="button-addon1" @click="clearMediaTypeFilter()"><font-awesome-icon icon="times" size="1x" /></button>
                    </div>
                  </div>
                </div>
              </form>
            </div> 

            <div class="col-12 col-md-3">
              <form>
                <div class="form-group">                
                  <div class="input-group input-group-sm">
                    <div class="input-group-prepend">
                      <label class="input-group-text" for="inputGroupSelect02">Tags</label>
                    </div> 
                    <select class="custom-select tagFilter" v-on:change="updateQueryParams" :value="selectedTag" ref="tagFilter">
                      <option>None</option>
                      <option v-for="tag in tags">{{tag.tagTitle}}</option>
                    </select>
                    <div class="input-group-append" v-if="selectedTag != 'None'">
                      <button class="btn btn-danger" type="button" id="button-addon1" @click="clearTagFilter()"><font-awesome-icon icon="times" size="1x" /></button>
                    </div>
                  </div>
                </div>
              </form>
            </div>
            <div class="col-12 col-md-3">
              <div class="form-group form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="selectedHasLocation">
                <label class="form-check-label" for="exampleCheck1">Has location</label>
              </div>              
            </div>            
          </div>
        </div> 
        <PublicListAssets v-show="this.viewType == 'list'" v-bind:filteredCoverageLat="this.selectedHasLocation" />  
        <PublicGridAssets v-show="this.viewType == 'grid'" v-bind:filteredCoverageLat="this.selectedHasLocation" />
        <PublicMapAssets v-show="this.viewType == 'map'" v-bind:filteredCoverageLat="this.selectedHasLocation"/>                   
      </div>        
    </div>


  </div>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'
import PublicListAssets from '../components/PublicListAssets'
import PublicGridAssets from '../components/PublicGridAssets'
import PublicMapAssets from '../components/PublicMapAssets'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'
import Switcher from '../components/Switcher'



export default {
  name: 'PublicArchive',
  data () {
    return {
      uid: '',
      key: '',
      archive: {},
      archiveId: this.$route.params.archive_id, 
      username: this.$route.params.username,
      creationDate: '',
      headerImage: '',
      assets: [],
      viewType: 'grid',
      selectedHasLocation: false,
      tags: [],

    }
  },
  components: {
    PublicListAssets,
    PublicGridAssets,
    PublicMapAssets,
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
    },
    mapViewType() {
      return {
        active: this.viewType == 'map'
      }
    },
    selectedTag() {
      if(this.$route.query.tag === undefined) {
        return 'None' 
      } else {
        return this.$route.query.tag
      }
    }, 
    selectedMediaType() {
      if(this.$route.query.mediaType === undefined) {
        return 'All' 
      } else {
        return this.$route.query.mediaType
      }
    },   
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
      this.getArchiveTags()
      this.createAssetArray()
    },
    getArchiveDetails: function() {
      var uid = this.uid

      sa.archiveDocumentDbRef(uid, this.archiveId).get().then((doc) => {
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
    getArchiveTags: function() {
      var uid = this.uid
      var archiveId = this.$route.params.archive_id
      this.tags = [];   

      sa.tagCollectionDbRef(uid,archiveId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.tags.push({
            tagTitle: doc.data().tagTitle
          });
        });
      });
    },
    createAssetArray: function() {

      var uid = this.uid

      sa.assetCollectionDbRef(uid, this.archiveId)
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
    updateQueryParams(e) {
  

      // build new object of various parameters

      // // First, get the existing values from the URL
      var currentTag = this.$route.query.tag
      var currentMediaType = this.$route.query.mediaType

      // // Then, update based on which filter was changed
      if(e.target.classList.contains('tagFilter')) {
        currentTag = e.target.value
      }

      if(e.target.classList.contains('mediaTypeFilter')) {
        currentMediaType = e.target.value
      }

      var queryObject = {
        tag: currentTag,
        mediaType: currentMediaType
      }

      this.$router.push({
        name: 'PublicArchive',
        query: queryObject
      })        

    },           
    clearMediaTypeFilter: function() {
      this.$refs.mediaTypeFilter.value = 'All'
      this.$router.push({
        name: 'PublicArchive',
        query: { 
          mediaType: 'All',
          tag: this.$route.query.tag
        }
      })      
    },
    clearTagFilter: function() {
      this.$refs.tagFilter.value = 'None'
      this.$router.push({
        name: 'PublicArchive',
        query: { 
          tag: 'None',
          mediaType: this.$route.query.mediaType
        }
      })
    }    
  }
}
</script>

<style lang="scss" scoped>

  $blue: #0011cf;
  $pink: #fff4e6;

  a svg:hover {
    color: inherit;
  }

  // .btn-outline-secondary {
  //   color: $blue;
  //   border: 1px solid $blue;
  //   &:not(:disabled):not(.disabled).active {
  //     background-color: $blue;
  //     color: $pink;
  //   }
  //   &:hover {
  //       color: $pink;
  //       background-color: $blue;
  //       border: 1px solid $blue;
  //   }
  // }

  // .collapse {
  //   border-top: 2px solid $blue;
  //   border-bottom: 2px solid $blue;
  // }
</style>
