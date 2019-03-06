<template>
  <div class="row px-sm-5 justify-content-center">
    <div class="col-12">
      <div class="btn btn-dark" @click.stop="goBack">Back</div>
      <div class="btn btn-outline-dark float-right" @click.stop="linkToPublicView(key)">View</div>
      <div class="btn btn-outline-dark float-right mr-2" @click.stop="editarchive(key)">Edit</div>   
      <hr class="my-4" />     
      <div class="card"> 
        <div class="card-body">
          <p><strong>Title:</strong> {{archive.title}}</p>
          <p><strong>Description:</strong> {{archive.desc}}</p>
        </div>
      </div>          

      <div class="row my-4">
          <div class="col"><h2>Items</h2></div>
          <div class="col">
            <div class="btn btn-warning float-right" @click.stop="addItemButton(key)">Add Item</div>
          </div>
      </div>
      <ListAssets />  

    </div>
  </div>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'
import ListAssets from '../components/ListAssets'


export default {
  name: 'AdminShowArchive',
  components: {
    ListAssets
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
        name: 'AdminCreateAsset',
        params: { id: id }
      })
    },
    goBack() {
      this.$router.push({ name: 'AdminListArchives', params: { archive_id: this.$route.params.archive_id }})
    },    
  }
}
</script>
