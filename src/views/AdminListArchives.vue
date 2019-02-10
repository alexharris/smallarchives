<template>
  <div >
    <div v-if="archives.length == 0">
        <h3>Welcome to Small Archives</h3>
        <p>You have no archives at this time. Create a new one to get started</p>
        <div class="btn" href="/admin/add-archive">New Archive</div>   
    </div>
    <div v-else>
      <div class="row mb-3">
        <b-button href="/admin/add-archive" class="float-right" variant="primary">Add Archive</b-button>
      </div>
      <div class="row">
        <table class="table">
          <thead>
            <tr>
              <th scope="col">Title</th>
              <th scope="col">Date Created</th>
              <th scope="col">Actions</th>
              
              <!-- <th scope="col">Actions</th> -->
            </tr>
          </thead>          
          <tr v-for="item in archives">
            <td>{{item.title}}</td>
            <td><div>{{item.dateCreated}}</div></td>
            <td>
              <a class="btn" @click.stop="details(item.key)">Details</a>
            <a class="btn" @click.stop="linkToPublicView(item)">View</a></td>
            
          </tr>
        </table>
      </div>
    </div>

  </div>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'

export default {
  name: 'AdminListArchives',
  components: {
    ArchiveHeaderImage
  },
  data () {
    return {
      fields: {
        title: { label: 'Title', sortable: true, 'class': 'text-left' },
        dateCreated: {label: 'Created'},
        actions: { label: 'Action'}
      },
      archives: [],
      errors: [],
      displayName: this.$store.getters.getUser.displayName
    }
  },
  created () {

    var uid = firebase.auth().currentUser.uid

    sa.archiveCollectionDbRef(uid).onSnapshot((querySnapshot) => {
      this.archives = [];
      querySnapshot.forEach((doc) => {

        this.archives.push({
          key: doc.id,
          title: doc.data().title,
          dateCreated: sa.getFormattedDate(doc.data().dateCreated)
        });
      });
    });   
  },
  methods: {
    details (archiveId) {
      this.$router.push({ name: 'AdminShowArchive', params: { archive_id: archiveId }})
    },
    linkToPublicView (archive) {
      this.$router.push({ name: 'PublicArchive', params: { archive_id: archive.key, username: this.displayName }})
    }
  },
}
</script>

<style>
  [v-cloak] { display: none; }
</style>
