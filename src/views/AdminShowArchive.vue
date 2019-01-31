<template>
  <b-row>
    <b-col cols="12">
      <b-btn @click.stop="goBack" variant="outline-secondary">Back</b-btn>
      <b-btn class="float-right" variant="outline-primary" @click.stop="linkToPublicView(key)">View</b-btn>  
      <b-btn class="float-right" variant="outline-primary" @click.stop="editarchive(key)">Edit</b-btn>   
      <hr my="4" />      
      <h1>{{archive.title}}</h1>
      <p>{{archive.desc}}</p>
      <hr class="my-4" />          
      
          
      

    <b-row class="my-4">
        <b-col><h2>Items</h2></b-col>
        <b-col><b-btn @click.stop="addItemButton(key)" variant="outline-primary" class="float-right">Add Item</b-btn></b-col>
    </b-row>

      <ListAssets />  
      
    
    </b-col>
  </b-row>
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
