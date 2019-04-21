<template>
  <div class="row px-sm-5 justify-content-center">
    <div class="col-12">
      <div class="btn btn-outline-dark" @click.stop="goBack">Back</div>
      <div class="btn btn-outline-dark float-right" @click.stop="linkToPublicView(key)">View</div>
  
      <hr class="my-4" />     
      <div class="card my-4"> 
        <div class="card-header">
          <h4 class="mb-0">Basic Info<div class="btn btn-link" @click.stop="editarchive(key)">Edit</div> </h4>
        </div>
        <div class="card-body">
          <p><strong>Title:</strong> {{archive.title}}</p>
          <p><strong>Description:</strong> {{archive.desc}}</p>
        </div>
      </div>          

      <div class="row mt-5">
          <div class="col">
            <h2>Items <div class="btn btn-link" @click.stop="addItemButton(key)"><font-awesome-icon icon="plus" size="1x" /></div></h2>
            
          </div>
      </div>
      <!-- <ListItems />   -->
      <PublicListItems />  
      <div class="btn btn-dark" @click.stop="addItemButton(key)"><font-awesome-icon class="mr-2" icon="plus" size="1x" />Add Item</div>

    </div>
  </div>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'
import ListItems from '../components/ListItems'
import PublicListItems from '../components/PublicListItems'


export default {
  name: 'AdminShowArchive',
  components: {
    ListItems,
    PublicListItems
  },  
  data () {
    return {
      key: '',
      archive: {}
    }
  },
  created () {

    var uid = firebase.auth().currentUser.uid
    var archiveId = this.$route.params.archive_id
    sa.archiveDocumentDbRef(uid, archiveId).get().then((doc) => {
      if (doc.exists) {
        this.key = doc.id;
        this.archive = doc.data();
      } else {
        alert("No such document!");
      }
    });
  },
  methods: {
    editarchive (id) {
      this.$router.push({
        name: 'AdminEditArchive',
        params: { id: id }
      })
    },
    linkToPublicView (id) {
      this.$router.push({
        name: 'PublicArchive',
        params: { id: id, username: this.$store.getters.getUser.displayName }
      })
    },    
    addItemButton (id) {
      this.$router.push({
        name: 'AdminCreateItem',
        params: { id: id }
      })
    },
    goBack() {
      this.$router.push({ name: 'AdminListArchives', params: { archive_id: this.$route.params.archive_id }})
    },    
  }
}
</script>
