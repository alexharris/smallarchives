<template

>
<div class="mt-5">
      <div v-if="items.length == 0">
          <p>This archive has no items.</p>
      </div>
      <div v-else>
        <div v-if="renderedItems.length !== 0" class="row">
          <table class="table table-public">
            <thead>
              <tr>
                <th scope="col">Title</th>
                <th scope="col">Item Type</th>
                <th scope="col">Date Added</th>
                <th scope="col" v-if="confirmOwner">Action</th>
                <!-- <th scope="col">Actions</th> -->
              </tr>
            </thead>
            <tr v-for="item in renderedItems">
              <td><a href="" @click.stop="viewSingleItem(item.itemId)">{{item.itemTitle}}</a><font-awesome-icon class="ml-2" icon="map-marker-alt" size="1x" v-if="item.itemCoverageLat"/></td>
              <td><div>{{item.itemType}}</div></td>
              <td>{{item.itemCreationDate}}</td>
              <td v-if="confirmOwner">
                <button class="btn mr-2 btn-sm btn-outline-dark" @click.stop="itemEdit(item.itemName, item.itemId)">Edit</button>          
              </td>              
            </tr>
          </table>
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
import firebase from 'firebase';
import sa from '../sa'

export default {
  name: "DisplayArchiveItems",
  props: ['filteredItemType', 'filteredCoverageLat'],
  data() {
  	return {
  	uid: '',
		url: '',
    items: [],
    renderedItems: [],
    currentUser: '',
    confirmOwner: false
    // tag: this.$route.query.tag
  	}
  },
  watch: { 
    //watch the filteredCoverageLat prop for changes, and change the item array when it does
    filteredCoverageLat: function(newVal, oldVal) { // watch it
      console.log('location toggled')
      this.filterItemArray()
    },
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
    this.currentUser = firebase.auth().currentUser;
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
    },   
         
  }, 
  methods: {    
    async getConfirmOwner() {
      this.confirmOwner = await sa.confirmOwner(this.$route.params.archive_id)
    }, 
    async getUidFromUsername() {
      // Since this component is used for admin and public purposes, we need two options for getting user id
      // 1. We can get it from the username in the route params
      if(this.$route.params.username != null) {
        var username = this.$route.params.username
        this.uid = await sa.getUidFromUsername(username)
      } else {
        // 2. Or, we can get it from the logged in user
        this.uid = firebase.auth().currentUser.uid
      }
      
      this.createItemArray()
    },
    createItemArray: function() {

      var uid = this.uid
      var archiveId = this.$route.params.archive_id

       // clear it so it resets each time this is called
      this.items = []      

      sa.itemCollectionDbRef(uid, archiveId)
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
            itemTags: doc.data().tags
          });
        });
        //tell the parent about how many items there are
        this.$store.commit('setItemCount', this.items.length)

        // sort the results
        this.items.sort(this.sortByTitle)

        // load rendered items
        this.renderedItems = this.items   
        this.filterItemArray()
      });
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
    itemEdit (itemTitle, itemId) {
      this.$router.push({
        name: 'AdminEditItem',
        params: { archive_id: this.$route.params.archive_id, item_id: itemId }
      })
    },
 
  },

};
</script>

<style scoped>

  img {
    height: 300px;
  }
</style>