<template>
  <div class="px-0">
    <div class="sticky-top">
      <!-- Top Nav Bar -->
      <nav class="navbar bg-white px-4 row d-flex shadow">
        <div class="col-12 order-1 order-sm-2 p-0 justify-content-left text-left">
          <span class="navbar-brand h3 m-0 p-0 mr-4"><strong>{{archive.title}}</strong></span>
        <!-- </div>
        <div class="col-2 order-2 order-sm-2 p-0 text-right"> -->
          <span class="btn btn-sm btn-outline-dark float-md-none float-right" @click="menuIsVisible = !menuIsVisible; closeFilters()" v-if="!menuIsVisible">Menu</span>
        </div>         
      </nav>  
       <!-- Filter Menu  -->
      <transition name="slide-fade" >
        <nav class="navbar p-2 pl-4 row archive-navbar shadow" v-if="menuIsVisible">
          <button type="button" class="btn btn-sm btn-outline-dark mr-3" @click="toggleFilters()">
            <font-awesome-icon icon="filter" v-if="!filterIsVisible" size="1x" /><font-awesome-icon icon="times" v-if="filterIsVisible" size="1x" /> Filters 
          </button>
          <div class="btn-group btn-group-toggle mr-3">
            <label for="grid" class="btn btn-sm btn-outline-dark" v-bind:class="gridViewType" v-if="showGrid">
              <input type="radio" id="grid" value="grid" v-model="viewType"> <font-awesome-icon icon="th" size="1x" /> <span class="ml-1">Grid</span>
            </label>
            <label for="list" class="btn btn-sm btn-outline-dark" v-bind:class="listViewType" v-if="showList">
              <input type="radio" id="list" value="list" v-model="viewType"> <font-awesome-icon icon="th-list" size="1x" /> <span class="ml-1">List</span>
            </label>
            <label for="map" class="btn btn-sm btn-outline-dark" v-bind:class="mapViewType" v-if="showMap">
              <input type="radio" id="map" value="map" v-model="viewType" @click.stop="forceRerender()"> <font-awesome-icon icon="map-marker-alt" size="1x" /> <span class="ml-1">Map</span>
            </label>       
          </div> 
          <a type="button" class="btn btn-sm btn-outline-dark mr-3 mr-auto" :href="'/u/' + username + '/' + archiveId + '/about'">
            About
          </a>   
          <div class="ml-md-2 my-1 pr-5 float-md-right pt-sm-0 pt-xs-2">
            <!-- <div class="btn btn-info btn-sm mr-2" @click.stop="addItemButton(key)" v-if="confirmOwner"><font-awesome-icon class="mr-2" icon="plus" size="1x" />Add Item</div> -->
            <button class="btn btn-info btn-sm mr-2" @click.stop="editarchive(archive.key)"  v-if="confirmOwner">Edit</button>
            <AdminAddItemButton />
            <span class="btn btn-link close-filter-menu mx-3" @click="menuIsVisible = !menuIsVisible; closeFilters()">
              <!-- <font-awesome-icon icon="ellipsis-h" size="1x" v-if="!menuIsVisible" /> -->
              <font-awesome-icon icon="times" size="1x" v-if="menuIsVisible" />
            </span>            
          </div>                 
        </nav>
      </transition>
      <!-- Filter Panel  -->
      <transition name="slide-fade" >
        <div class="row filter-collapse p-4 shadow" v-if="filterIsVisible">
          <div class="pt-2 col-12">
            <div class="pb-3 filter-title"><strong>FILTERS</strong><span class="float-right btn btn-link p-0 close-filter-panel" @click="toggleFilters()"><font-awesome-icon  icon="times" size="1x" v-if="filterIsVisible" /></span></div>
            <!-- <nav class="navbar"> -->
              <div class="row">
                <div class="col-12 col-sm-6">
                  <form class="mr-2">
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
                <div class="col-12 col-sm-6">
                  <form class="mr-2">
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

              </div>
              <div class="form-group form-check">
                <input type="checkbox" class="form-check-input" id="exampleCheck1" v-model="selectedHasLocation">
                <label class="form-check-label" for="exampleCheck1" >Has location</label>
              </div> 
              <div class="form-group">
                <button class="btn btn-sm btn-outline-danger" href="#" @click.stop="clearAllFilters()">Clear All</button>                                                  
              </div>
          </div>           
        </div>
      </transition>
      <!-- End filter panel -->
      <!-- About Archive Panel  -->
      <!-- <transition name="slide-fade" >
        <div class="row p-4 filter-about bg-white" v-if="aboutIsVisible">
   
            <ArchiveHeaderImage v-bind:archiveId="key" class="mr-3 header-image"/>

            <span class="float-right btn btn-link p-0 close-filter-panel" @click="toggleAbout()"><font-awesome-icon  icon="times" size="1x" v-if="aboutIsVisible" /></span>
            <p>{{archive.desc}}</p>  
            <p class="text-muted">This archive was created on <strong>{{creationDate}}</strong> by <strong><a href="" @click.stop="goToUser()">{{ this.username }}</a></strong>.</p>
            
        </div>
      </transition> -->
      <!-- End About Archive panel -->      
      <!-- Filter indicators -->
      <div class="row filter-indicator shadow" v-if="filterIndicatorIsVisible">
        <div class="col-12">
          <nav class="navbar navbar-expand-lg " v-if="selectedTag != 'None' || selectedMediaType != 'All'">
              <span><strong>Active Filters</strong></span>
              <a class="ml-2 float-right" href="#" @click.stop="clearAllFilters()">
                  <small>Clear</small>
              </a>
          </nav>             
          <div class="float-left mr-2 ml-3 pb-2" v-if="selectedTag != 'None'"><small>Tag: </small> <span class="badge badge-pill badge-warning">{{selectedTag}}</span> </div>
          <div class="float-left ml-3 pb-2" v-if="selectedMediaType != 'All'"><small> Type: </small><span class="badge badge-pill badge-warning">{{selectedMediaType}}</span></div>
        </div> 
      </div>      
      <!-- end filter indicators -->
    </div>
    <div class="row mb-2 px-md-2 pt-4 justify-content-center mt-4">
      <div class="col-12">                  
        <PublicListItems v-show="this.viewType == 'list'" v-if="showList" v-bind:filteredCoverageLat="this.selectedHasLocation" />  
        <PublicGridItems v-show="this.viewType == 'grid'" v-bind:filteredCoverageLat="this.selectedHasLocation" />
        <PublicMapItems v-show="this.viewType == 'map'" v-if="showMap" :key="mapComponentKey" :mapLat="mapLat" :mapLong="mapLong" :zoom="zoom"/>       
        <div class="row mt-5 py-5 justify-content-center">  
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
import AdminAddItemButton from '../components/AdminAddItemButton'



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
      filterIsVisible: false,
      menuIsVisible: false,
      aboutIsVisible: false,
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
    Switcher,
    AdminAddItemButton   
  },
  computed: {
    filterIndicatorIsVisible() {
      // console.log(this.selectedMediaType)
      // console.log(this.selectedTag)
      if(this.filterIsVisible == true) {
        return false
      } else {
        if(this.selectedMediaType == 'All' && this.selectedTag == 'None') {
          return false
        } else {
          return true
        }
      }
        
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
        console.log('there is a tag value')
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
      this.filterIsVisible = !this.filterIsVisible
    },
    toggleAbout: function() {
      this.aboutIsVisible = !this.aboutIsVisible
    },    
    closeFilters: function() {
      this.filterIsVisible = false
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
          // this.showGrid = doc.data().showGrid // show grid is always set to true since it is the default
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
            itemCreationDate: doc.data().itemCreationDate,
            itemText: doc.data().itemText,
            itemType: doc.data().itemType,
          });
        });
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
        console.log('hello')
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
    clearAllFilters: function() {
      console.log('clear')
      this.clearMediaTypeFilter()
      this.clearTagFilter()
      this.clearLocationFilter()
      this.filterIsVisible = false
      this.filterIndicatorIsVisible = false
    },         
    clearMediaTypeFilter: function() {
      this.$router.push({
        name: 'PublicArchive',
        query: { 
          mediaType: 'All',
          tag: this.$route.query.tag
        }
      })      
    },
    clearTagFilter: function() {
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
    // addItemButton (id) {
    //   this.$router.push({
    //     name: 'AdminCreateItem',
    //     params: { id: id }
    //   })
    // },
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
  $grey: #efefef;

  /* Enter and leave animations */

  .slide-fade-enter-active, .slide-fade-leave-active {
    transition: all .05s ease;
  }
  .slide-fade-enter, .slide-fade-leave-to {
    transform: translateY(4px);
    opacity: 0;
  }

  .archive-navbar {
    background: $grey;
    
  }

  .filter-collapse {
    // border-bottom: 2px solid black;
    // border-top: 1px solid darken($grey, 20%);
    background-color: $grey;
  }

  .filter-indicator .col-12 {
    // border-top: 1px solid darken($grey, 20%);
    background-color: $grey;
    
  }

  .close-filter-menu {
    position: absolute;
    right: 0;
    top: 0;
  }

  .close-filter-panel {
    position: absolute;
    right: -12px;
    top: 0;
  }

  .filter-about {
    position: fixed;
    top: 0;
    bottom: 0;
    z-index: 1100;    
  }

  @media all and (max-width : 768px) {

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
