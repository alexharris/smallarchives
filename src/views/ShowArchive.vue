<template>
  <b-row>
    <b-col cols="12">
      <b-btn href="/archives" variant="outline-secondary">Back</b-btn>&nbsp;
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
import ListAssets from '../components/ListAssets'

export default {
  name: 'ShowArchive',
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
    const ref = firebase.firestore().collection('archives').doc(firebase.auth().currentUser.uid).collection('userarchives').doc(this.$route.params.id);
    ref.get().then((doc) => {
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
        name: 'EditArchive',
        params: { id: id }
      })
    },
    addItemButton (id) {
      this.$router.push({
        name: 'AdminAddAsset',
        params: { id: id }
      })
    }
  }
}
</script>
