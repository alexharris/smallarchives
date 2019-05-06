<template>
  <div class="container">
    <div class="row mb-2 px-md-2 pb-2 justify-content-center">
      <div class="col-12">
        <div class="row">
          <div class="col-12 mx-0 px-0 my-4">
            <h1 class="h2 mb-4">{{archive.title}}</h1>
            <div class="btn btn-primary btn-sm mr-2 mb-2" @click.stop="addItemButton(key)" v-if="confirmOwner"><font-awesome-icon class="mr-2" icon="plus" size="1x" />Add Item</div>
            <button class="btn btn-primary btn-sm mr-2 mb-2" @click.stop="editarchive(archive.key)"  v-if="confirmOwner">Edit</button>
          </div>
        </div>
        <div class="row sticky-top">
          <nav class="navbar navbar-light col-12"  style="background-color: #ffffff;">
            <span class="navbar-text">
              <button type="button" class="btn btn-sm btn-outline-dark mr-3" data-toggle="collapse" href="#collapseExample" role="button" aria-expanded="false" aria-controls="collapseExample" @click="toggleFilters()">
                Filters <font-awesome-icon icon="filter" v-if="filterState" size="1x" /><font-awesome-icon icon="times" v-if="!filterState" size="1x" />
              </button>
              <button type="button" class="btn btn-sm btn-outline-dark mr-3" data-toggle="modal" data-target="#basicInfoModal">
                About
              </button>             
              <div class="btn-group btn-group-toggle mr-3">
                <label for="grid" class="btn btn-sm btn-outline-dark" v-bind:class="gridViewType" v-if="showGrid">
                  <input type="radio" id="grid" value="grid" v-model="viewType"> <font-awesome-icon icon="th" size="1x" />
                </label>
                <label for="list" class="btn btn-sm btn-outline-dark" v-bind:class="listViewType" v-if="showList">
                  <input type="radio" id="list" value="list" v-model="viewType"> <font-awesome-icon icon="th-list" size="1x" />
                </label>

                <label for="map" class="btn btn-sm btn-outline-dark" v-bind:class="mapViewType" v-if="showMap">
                  <input type="radio" id="map" value="map" v-model="viewType" @click.stop="forceRerender()"> <font-awesome-icon icon="map-marker-alt" size="1x" />
                </label>       
              </div>  
              
            </span>  
          </nav>        
        </div>    
        <!-- Filter collapse  -->
        <div class="row sticky-top filter-collapse bg-white">
          <div class="collapse pt-2  bg-white" id="collapseExample">
            <div class="row">
              <div class="col-11 col-md-3">
                <form>
                  <div class="form-group">                
                    <div class="input-group input-group-sm">
                      <div class="input-group-prepend">
                        <label class="input-group-text" for="inputGroupSelect02">Type</label>
                      </div> 
                      <select class="custom-select mediaTypeFilter" v-on:change="updateQueryParams" :value="selectedMediaType" ref="mediaTypeFilter">
                        <option :selected="true">All</option>
                        <option v-for="type in uniqueItemTypes">{{type}}</option>
                      </select>
                      <div class="input-group-append" v-if="selectedMediaType != 'All'">
                        <button class="btn btn-danger" type="button" id="button-addon1" @click="clearMediaTypeFilter()"><font-awesome-icon icon="times" size="1x" /></button>
                      </div>
                    </div>
                  </div>
                </form>
              </div> 
              <div class="col-11 col-md-3">
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
              <div class="col-11 col-md-3">
                <div class="form-group form-check">
                  <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="selectedHasLocation">
                  <label class="form-check-label" for="exampleCheck1">Has location</label>
                </div>              
              </div>            
            </div>
          </div>           
        </div>
        <div class="modal fade" id="basicInfoModal" tabindex="-1" role="dialog" aria-labelledby="basicInfoModalTitle" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              <div class="modal-header">
                <h5 class="modal-title" id="basicInfoModalTitle">{{archive.title}}</h5>
                <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div class="modal-body">
                <p>{{archive.desc}}</p>  
                <hr />
                <p>This archive contains <strong>{{itemCount}}</strong> items.</p> 
                <p>It was created on <strong>{{creationDate}}</strong> by <strong><a href="" @click.stop="goToUser()">{{ this.username }}</a></strong>.</p>
              </div>
            </div>
          </div>
        </div>             
        <PublicListItems v-show="this.viewType == 'list'" v-bind:filteredCoverageLat="this.selectedHasLocation" />  
        <PublicGridItems v-show="this.viewType == 'grid'" v-bind:filteredCoverageLat="this.selectedHasLocation" />
        <PublicMapItems v-show="this.viewType == 'map'" v-if="showMap" :key="mapComponentKey" :mapLat="mapLat" :mapLong="mapLong" :zoom="zoom"/>       
        <div class="row mt-5 pt-5 justify-content-center">  
          <small>Made with <a href="/">Small Archives</a></small>
        </div>                      
      </div>    

    </div>


  </div>
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'
import PublicListItems from '../components/PublicListItems'
import PublicGridItems from '../components/PublicGridItems'
import PublicMapItems from '../components/PublicMapItems'
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
      items: [],
      viewType: 'grid',
      selectedHasLocation: false,
      tags: [],
      showMap: false,
      showList: true,
      showGrid: true,
      mapComponentKey: 0,
      confirmOwner: false,
      filterState: true,
      mapLat: 1,
      mapLong: 1,
      zoom: 16

    }
  },
  components: {
    PublicListItems,
    PublicGridItems,
    PublicMapItems,
    ArchiveHeaderImage,
    Switcher   
  },
  computed: {
    itemCount() {
      return this.$store.getters.getItemCount
    },
    uniqueItemTypes() {
      return [...new Set(this.items.map(p => p.itemType))]
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
    this.getConfirmOwner();
    
  },
  methods: {
    toggleFilters: function() {
      this.filterState = !this.filterState
      this.clearMediaTypeFilter()
      this.clearTagFilter()
      this.clearLocationFilter()
    },
    async getConfirmOwner() {
      
      this.confirmOwner = await sa.confirmOwner(this.$route.params.archive_id)
      
    },     
    forceRerender() {
      this.mapComponentKey += 1;  
    },    
    async getUidFromUsername() {
      var username = this.$route.params.username
      this.uid = await sa.getUidFromUsername(username)
      // send to 404 when no UID matches
      if(this.uid === false) {
        this.$router.push('/404')
      }      
      this.getArchiveDetails()
      this.getArchiveTags()
      this.createItemArray()
    },
    getArchiveDetails: function() {
      var uid = this.uid

      sa.archiveDocumentDbRef(uid, this.archiveId).get().then((doc) => {
        if (doc.exists) {

          this.key = doc.id;
          this.archive = doc.data();
          this.creationDate = sa.getFormattedDate(doc.data().dateCreated)
          this.headerImage = doc.data().headerImage
          this.showMap = doc.data().showMap
          this.showList = doc.data().showList
          this.showGrid = doc.data().showGrid
          this.mapLat = doc.data().mapLat
          this.mapLong = doc.data().mapLong
          this.zoom = doc.data().zoom
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
    createItemArray: function() {

      var uid = this.uid

      sa.itemCollectionDbRef(uid, this.archiveId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.items.push({
            fileName: doc.data().file,
            itemTitle: doc.data().itemTitle,
            itemId: doc.id,
            itemCreationDate: sa.getFormattedDate(doc.data().itemCreationDate),
            itemText: doc.data().itemText,
            itemType: doc.data().itemType,
          });
        });
        //tell the parent about how many items there are
        this.$store.commit('setItemCount', this.items.length)
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
    },
    clearLocationFilter: function() {
      this.selectedHasLocation = false
    },
    addItemButton (id) {
      this.$router.push({
        name: 'AdminCreateItem',
        params: { id: id }
      })
    },
    editarchive (id) {
      this.$router.push({
        name: 'AdminEditArchive',
        params: { id: id }
      })
    },            
  }
}
</script>

<style lang="scss" scoped>

  $blue: #0011cf;
  $pink: #fff4e6;

  // a svg:hover {
  //   color: inherit;
  // }

  .navbar {
    // border-top: 1px solid black;
    z-index: 1000;

    padding-left: 0;
    
  }

  .filter-collapse {
    border-bottom: 2px solid black;
  }

  .filter-collapse.sticky-top {
    top: 63px;
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
