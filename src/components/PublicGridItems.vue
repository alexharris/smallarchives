<template>
  <div>
    <div v-if="items.length == 0">
        <p>This archive has no items.</p>
    </div>
    <div v-else>
      <div v-if="renderedItems.length !== 0" class="row px-n5">
        <div class="col-xs-12 col-sm-6 col-md-4 col-lg-3 grid-item mb-3 p-md-4" v-for="item in renderedItems">
          <div class="media-display text-center">
            <div v-if="item.itemMediaType === 'image'">       
              <a href="" @click.stop="viewSingleItem(item.itemId)"><img :src="item.itemSrc" /></a>
            </div>
            <div v-if="item.itemMediaType === 'pdf'">      
              <div class="pdf-placeholder"><a href="" @click.stop="viewSingleItem(item.itemId)"><img src="/img/pdf-page.svg" /></a> </div>
            </div>
            <div v-if="item.itemMediaType === 'audio'">       
              <figure>
                  <audio
                      controls
                      :src="item.itemSrc">
                          Your browser does not support the
                          <code>audio</code> element.
                  </audio>
              </figure>
            </div> 
            <div v-if="item.itemMediaType === 'youtube'">       
              <a href="" @click.stop="viewSingleItem(item.itemId)"><img :src="youtubeThumbnail(item)" /></a>
            </div>  
            <div v-if="item.itemMediaType === 'iaVideo'">      
              <iframe v-bind:src="item.itemMediaInternetArchiveId" width="100%" frameborder="0" webkitallowfullscreen="true" mozallowfullscreen="true" allowfullscreen></iframe>					
            </div>                                             
          </div>
          <div class="grid-title">
            <small>{{item.itemType}}<font-awesome-icon class="ml-2" icon="map-marker-alt" size="1x" v-if="item.itemCoverageLat"/></small>
            <p class="my-2"><a href="" @click.stop="viewSingleItem(item.itemId)">{{truncatedTitle(item.itemTitle, 50)}}</a><a href="#" class="ml-2" @click.stop="itemEdit(item.itemName, item.itemId)"  v-if="confirmOwner"><small>Edit</small></a>    </p>
          </div>
                
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-12">
          <p></p>
          <p>There are no results. Please modify filters.</p>
        </div>
      </div>          
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'

export default {
  name: "PublicGridItems",
  props: ['filteredCoverageLat'],
  data() {
  	return {
  	uid: '',
		url: '',
    items: [],
    renderedItems: [],
    confirmOwner: false
  	}
  },
  watch: { 
    //watch the filteredCoverageLat prop for changes, and change the item array when it does
    filteredCoverageLat: function(newVal, oldVal) { // watch it
      this.filterItemArray()
    },
    //watch tag for changes, and change the item array when it does
    '$route.query.tag': function() { // watch it
      this.filterItemArray()
    },
    //watch tag for changes, and change the item array when it does
    '$route.query.mediaType': function() { // watch it
      this.filterItemArray()
    }               
  },    
  created() {
    this.getUidFromUsername()
    this.getConfirmOwner()
  },  
  computed: {
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
    async getConfirmOwner() {
      this.confirmOwner = await sa.confirmOwner(this.$route.params.archive_id)
    },        
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

          if(doc.data().itemMediaType === 'image') {
            imagePrefix = 'thumb_'
          } else {
            imagePrefix = ''
          }
          // get the item source for thumbnail image
          sa.itemStorageRef(uid, archiveId, doc.id, doc.data().itemFileName, imagePrefix).getDownloadURL().then((url) => {
            itemSrcUrl = url
          }).catch(function(error) {
            itemSrcUrl = ''
            console.log(error.message)
          }).then(() => {
            this.items.push({
              fileName: doc.data().file,
              itemTitle: doc.data().itemTitle,
              itemId: doc.id,
              itemCreationDate: sa.getFormattedDate(doc.data().itemCreationDate),
              itemText: doc.data().itemText,
              itemType: doc.data().itemType,
              itemMediaType: doc.data().itemMediaType,
              itemFileName: doc.data().itemFileName,
              itemMediaYoutubeId: doc.data().itemMediaYoutubeId,
              itemMediaInternetArchiveId: 'https://archive.org/embed/' + doc.data().itemMediaInternetArchiveId,
              itemSrc: itemSrcUrl,
              itemCoverageLat: doc.data().itemCoverageLat,
              itemTags: doc.data().tags
            });    
            //tell the parent about how many items there are
            this.$store.commit('setItemCount', this.items.length)  

            this.items.sort(this.sortByTitle)

            // load rendered items
            this.renderedItems = this.items     
            this.filterItemArray()    
          })
        });

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
    filterItemArray: function() {

      

      this.renderedItems = []

      if(this.filteredCoverageLat === true) { //this means the box is checked and only items with location should appear
        this.renderedItems = this.items.filter((item) => {
          return item.itemCoverageLat != false
        })

        if(this.mediaType != 'All'){ // then we check to see if a specific type is selected
          this.renderedItems = this.renderedItems.filter((item) => {
            return item.itemType === this.mediaType
          })  
        }   

        if(this.tag != 'None'){ // then we check to see if a specific type is selected
          this.renderedItems = this.renderedItems.filter((item) => {
            if(item.itemTags) {
              return item.itemTags.includes(this.tag) 
            }
          })  
        }               

      } else { // this means show things with or without location


        this.renderedItems = this.items // start with all of them

        if(this.mediaType != 'All'){ // then we check to see if a specific type is selected
          console.log(this.filteredItemType)
          this.renderedItems = this.renderedItems.filter((item) => {
            return item.itemType === this.mediaType
          })  
        }

        if(this.tag != 'None'){ // then we check to see if a specific type is selected

          this.renderedItems = this.renderedItems.filter((item) => {
           if(item.itemTags) {
            return item.itemTags.includes(this.tag) 
           }
          })  
        }        
      }
    },         
    viewSingleItem: function(itemId) {
      this.$router.push({
        name: 'PublicItem',
        params: { username: this.$route.params.username, archive_id: this.$route.params.archive_id, item_id: itemId }
      })
    },
    truncatedTitle: function(string, length) {
      return sa.truncateString(string,length)
    },
    youtubeThumbnail: function(item) {
      return 'https://img.youtube.com/vi/' + item.itemMediaYoutubeId + '/sddefault.jpg';
    },
    itemEdit (itemTitle, itemId) {
      this.$router.push({
        name: 'AdminEditItem',
        params: { archive_id: this.$route.params.archive_id, item_id: itemId }
      })
    },     
       
  
  }


}
</script>

<style scoped lang="scss">


  audio {
    width: 100%;
    top: 50px;
    position: relative;
  }

  .grid-item {
    height: 400px;
  }

  .grid-title {
    height: 90px;
    padding-bottom: 10px;
  }

  // .pdf-placeholder {
  //   position: relative;
  //   border: 1px solid #000;
  //   top: 60px;
  //   left: 60px;
  //   width: 100px;
  //   padding: 10px 0;
  // }

  .media-display {
    margin: 20px 0;
    height: 200px;
    img {
      max-height: 200px
    }
  }
</style>