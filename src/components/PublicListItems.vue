<template>
  <div>
    <div v-if="items.length == 0">
        <p>This archive has no items.</p>
        <AdminAddItemButton />
    </div>
    <div v-else>
      <div v-if="renderedItems.length !== 0" class="px-n5">
        <div class="row list-item my-3 py-3" v-for="item in renderedItems">
          <div class="col-3">
            <div class="media-display text-center">
              <!-- <div v-if="item.itemMediaType === 'image'">        -->
                <a href="" @click.stop="viewSingleItem(item.itemId)">
                  <img :src="item.itemFeatureImage" v-if="item.itemFeatureImage" :alt="item.itemTitle" />
                  <div v-else>
                    <font-awesome-icon class="mr-2" icon="file" size="9x" />
                  </div>                  
                </a>
              <!-- </div> -->
              <!-- <div v-if="item.itemMediaType === 'pdf'">      
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
              </div>                                              -->
            </div>
          </div>
          <div class="col-9">

            <div class="list-title">
              <small><font-awesome-icon class="ml-2" icon="map-marker-alt" size="1x" v-if="item.itemCoverageLat"/></small>
              <p class="my-2">
              <h4><a href="" @click.stop="viewSingleItem(item.itemId)">{{item.itemTitle}}</a></h4>
              <strong>Type: </strong>{{item.itemType}}<br />
              <strong>Tags: </strong> <span class="badge badge-pill badge-warning" v-for="tag in item.itemTags">{{tag}}</span><br />
              <strong>Added: </strong>{{item.itemCreationDate}}<br />
              <a href="#" @click.stop="itemEdit(item.itemName, item.itemId)"  v-if="confirmOwner"><small>Edit</small></a>    
              
              </p>
            </div>
                  
          </div>
        </div>
      </div>
      <div class="row" v-else>
        <div class="col-12">
          <p></p>
          <p>There are no results. Please modify filters.</p>
        </div>
      </div>
      <AdminAddItemButton />          
    </div>
  </div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'
import AdminAddItemButton from '../components/AdminAddItemButton'

export default {
  name: "PublicListItems",
  props: ['filteredCoverageLat'],
  components: {
    AdminAddItemButton
  },  
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
      //
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

          // console.log(uid)
          // console.log(archiveId)
          // console.log(doc.id)
          // console.log(doc.data().itemFeatureImage)
          // console.log(doc.data().itemFileName)
          // console.log(imagePrefix)

          // if(doc.data().itemFeatureImage != null) {
          //   featureImage = doc.data().itemFeatureImage
          // } else {
          //   featureImage = doc.data().itemFileName
          // }

          // console.log(featureImage)


          // get the item source for thumbnail image

          sa.itemFeatureStorageRef(uid, archiveId, doc.id, doc.data().itemFeatureImageName, 'thumb_').getDownloadURL().then((url) => {
            itemFeatureImageUrl = url
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
              itemFeatureImage: itemFeatureImageUrl,
              itemMediaYoutubeId: doc.data().itemMediaYoutubeId,
              itemMediaInternetArchiveId: 'https://archive.org/embed/' + doc.data().itemMediaInternetArchiveId,
              itemSrc: itemSrcUrl,
              itemCoverageLat: doc.data().itemCoverageLat,
              itemTags: doc.data().tags
            });    


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

  .list-item {
    border-bottom: 1px dotted lightgrey;
    // height: 400px;
  }

  .list-title {
    // height: 90px;
    padding-bottom: 10px;
    a:not(.btn):not(.nav-link):not(.navbar-brand):not(.btn-link) {
      text-decoration: none;
    }
  }

  // .pdf-placeholder {
  //   position: relative;
  //   border: 1px solid #000;
  //   top: 60px;
  //   left: 60px;
  //   width: 100px;
  //   padding: 10px 0;
  // }

  // .media-display {
  //   margin: 20px 0;
  //   height: 200px;
  //   img {
  //     max-height: 200px
  //   }
  // }

  @media all and (max-width : 768px) {
    .list-item {
      height: auto;
    }

    .list-title {
      height: auto
    }

    .media-display {
      height: auto;
      img {
        max-height: 500px;
      }
    }

    iframe {
      min-height: 300px;
    }
    
  }
</style>