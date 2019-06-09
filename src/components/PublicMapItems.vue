<template>
  <div class="mt-5"> 
    <div v-if="items.length == 0">
        <p>This archive has no results with location data.</p>
    </div>
    <div v-else>
      <div class="row justify-content-center">
        <div class="col-11">
          <div class="map-container">
            <l-map :zoom="zoom" :center="center">
              <l-tileLayer url="http://{s}.tile.osm.org/{z}/{x}/{y}.png"></l-tileLayer>
                <template v-for="item in renderedItems">
                  <l-marker v-if="item.itemCoverageLat != ''" :lat-lng="[item.itemCoverageLat, item.itemCoverageLong]">
                    <l-popup><a @click.stop="viewSingleItem(item.itemId)">{{item.itemTitle}}</a></l-popup>
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

       // clear it so it resets each time this is called
      this.items = []      

      sa.itemCollectionDbRef(uid, archiveId).where("itemTitle.length", '>', 0)
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
            itemCoverageLat: doc.data().itemCoverageLat,
            itemCoverageLong: doc.data().itemCoverageLong,
            itemTags: doc.data().tags
          });
        })

        //tell the parent about how many items there are
        this.$store.commit('setItemCount', this.items.length)

        // sort the results
        this.items.sort(this.sortByTitle)
  
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

<style scoped>

  img {
    height: 300px;
  }

  .vue2leaflet-map {
    //height: 515px;
  }

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