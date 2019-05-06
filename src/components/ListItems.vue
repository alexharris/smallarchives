<template>
  <div>
      <div v-if="items.length == 0">
          <p>This archive has no items.</p>    
      </div>
      <div v-else>  
        <table bordered="true" id="example-1" class="table table-sm" >
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Date Added</th>
              <th scope="col">Item Type</th>
              <th scope="col">Action</th>
            </tr>
          </thead>          
          <tr v-for="item in items">
            <td>{{item.itemTitle}}</td>
            <td>{{item.itemCreationDate}}</td>
            <td>{{item.itemType}}</td>
            <td >
              <button class="btn mr-2 btn-sm btn-outline-dark" @click.stop="itemEdit(item.itemName, item.itemId)">Edit</button>          
            </td>
          </tr>
        </table> 
      </div> 
  </div>
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'

export default {
  name: 'ListItems',
  data () {
    return {
      items: [],
      renderedItems: [],
      uid: ''
    }
  },
  created() {
    this.createItemArray()

    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
   
  },
  methods: {
    createItemArray: function() {

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id

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
            itemType: doc.data().itemType
          });

        });
      });       
    },
    itemEdit (itemTitle, itemId) {
      this.$router.push({
        name: 'AdminEditItem',
        params: { archive_id: this.$route.params.archive_id, item_id: itemId }
      })
    }
  }
}
</script>



<style scoped>
  table {
    width:100%;
  }
  img { 
    height:100px;
  }
</style>
