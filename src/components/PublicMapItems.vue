<template>
  <div class=""> 
    <div v-if="items.length == 0">
        <p>This archive has no results with location data.</p>
    </div>
    <div v-else>
      <div class="row justify-content-center">
        <div class="col-12 m-0 p-0">
          <div class="map-container">
            <l-map :zoom="zoom" :center="center">
              <l-tileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tileLayer>
                <template v-for="item in renderedItems">
                  <l-marker v-if="item.itemCoverageLat != ''" :lat-lng="[item.itemCoverageLat, item.itemCoverageLong]">
                    <l-popup>
                  
                    <img :src="item.itemFeatureImage" />
                    <a @click.stop="viewSingleItem(item.itemId)">{{item.itemTitle}}</a>
                    </l-popup>
                  </l-marker>
                </template>
            </l-map>
          </div>
        </div>
      </div>         
    </div>
	</div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'
import {LMap, LTileLayer, LMarker, LPopup } from 'vue2-leaflet';

export default {
  name: "DisplayArchiveItems",
  data() {
  	return {
  	uid: '',
		url: '',
    items: [],
    renderedItems: [],
  	}
  },
  props: {
    mapLat: Number,
    mapLong: Number,
    zoom: Number
  },
  components: {
    LMap,
    LTileLayer,
    LMarker,
    LPopup     
  },
  watch: { 
    //watch tag for changes, and change the item array when it does
    '$route.query.tag': function() { // watch it
      // this.tag = this.$route.query.tag
      this.filterItemArray()
    },
    //watch tag for changes, and change the item array when it does
    '$route.query.mediaType': function() { // watch it
      this.filterItemArray()
    }       
  },  
  created() {
    this.getUidFromUsername()
  },   
  computed: {
    center: function() {
      var center =  L.latLng(this.mapLat, this.mapLong)
      return center
    },
    tag() {
      if(this.$route.query.tag === undefined) {
        return 'None' 
      } else {
        return this.$route.query.tag
      }
    },
    mediaType() {
      if(this.$route.query.mediaType === undefined) {
        return 'All' 
      } else {
        return this.$route.query.mediaType
      }      
    }      
  },  
  methods: {     
    async getUidFromUsername() {
      var username = this.$route.params.username
      this.uid = await sa.getUidFromUsername(username)
      this.createItemArray()
    },
    createItemArray: function() {
      var uid = this.uid
      var archiveId = this.$route.params.archive_id
      var itemSrcUrl = ''

       // clear it so it resets each time this is called
      this.items = []      

      sa.itemCollectionDbRef(uid, archiveId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {

          var imagePrefix = '';
          var featureImage = '';
          var itemFeatureImageUrl = '';

          if(doc.data().itemMediaType === 'image') {
            imagePrefix = 'thumb_'
          } else {
            imagePrefix = ''
          }

          
          sa.itemStorageRef(uid, archiveId, doc.id, doc.data().featureImage, 'thumb_').getDownloadURL().then((url) => {
            itemFeatureImageUrl = url
          }).catch(function(error) {
            itemSrcUrl = ''
            console.log(error.message)
          }).then(() => {
            this.items.push({
              fileName: doc.data().file,
              itemTitle: doc.data().itemTitle,
              itemId: doc.id,
              itemCreationDate: doc.data().itemCreationDate,
              itemText: doc.data().itemText,
              itemType: doc.data().itemType,
              itemMediaType: doc.data().itemMediaType,
              itemFeatureImage: itemFeatureImageUrl,
              itemMediaYoutubeId: doc.data().itemMediaYoutubeId,
              itemMediaInternetArchiveId: 'https://archive.org/embed/' + doc.data().itemMediaInternetArchiveId,
              itemSrc: itemSrcUrl,
              itemCoverageLat: doc.data().itemCoverageLat,
              itemCoverageLong: doc.data().itemCoverageLong,
              itemTags: doc.data().tags
            }); 
        
            // sort the results
            this.items.sort(this.sortByTitle)

            // load rendered items
            this.renderedItems = this.items     
            this.filterItemArray()  
            
          })
        })
  
      }).then(() => {
        this.filterItemArray()
      })
    },
    // this just does some quick sorting
    sortByTitle: function(a,b) {
      if (a.itemTitle < b.itemTitle)
        return -1;
      if (a.itemTitle > b.itemTitle)
        return 1;
      return 0;
    },    
    viewSingleItem: function(itemId) {
      this.$router.push({
        name: 'PublicItem',
        params: { username: this.$route.params.username, archive_id: this.$route.params.archive_id, item_id: itemId }
      })
    },       
    filterItemArray: function() {
      this.renderedItems = []

      this.renderedItems = this.items.filter((item) => {
        return item.itemCoverageLat != false
      })

      if(this.mediaType != 'All'){ // then we check to see if a specific type is selected
        this.renderedItems = this.renderedItems.filter((item) => {
          return item.itemType === this.mediaType
        })  
      }   

      if(this.tag != 'None'){ // then we check to see if a specific tag is selected
        this.renderedItems = this.renderedItems.filter((item) => {
          if(item.itemTags) {
            return item.itemTags.includes(this.tag) 
          }
        })
      }   

    },
    viewSingleItem: function(itemId) {
      this.$router.push({
        name: 'PublicItem',
        params: { username: this.$route.params.username, archive_id: this.$route.params.archive_id, item_id: itemId }
      })
    },
  },

};
</script>

<style scoped lang="scss">

  .leaflet-popup-content {
    border: 1px solid #f00;
    width:200px !important;
  }

  .vue2leaflet-map {
    //height: 515px;
  }

  img {width: 200px;}

  .map-container {
    width: 100%;
    height: 700px;
  }

  @media only screen and (max-width: 767px) { 
      .map-container {
          height: 100vw
      }
  }

</style>