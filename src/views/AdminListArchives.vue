<template>
  <div class="row">
    <div class="col-12">
      <div class="row justify-content-center mb-5">
        <div class="col-12" v-if="archives.length == 0">
          <h3>Welcome to Small Archives</h3>
          <p>You have no archives at this time. Create a new one to get started.</p>
          <a class="btn btn-dark" href="/admin/add-archive">New Archive <font-awesome-icon icon="plus" size="1x" /></a>   
        </div>
        <div class="col-12" v-else>
          <h4 class="my-4">Dashboard</h4>
          <div class="card-deck">
          <div v-for="archive in archives" class="card mb-3">
            <div class="card-body">
              <h5 class="mb-4"><a :href="'/u/' + username + '/' + archive.id">{{archive.title}}</a></h5>
              <span><strong>Description:</strong> {{archive.desc}}</span><br/>
              <span><strong>Created:</strong> {{archive.dateCreated}}</span><br />
              
            </div>
            <div class="card-footer">
              <!-- <button class="btn btn-primary btn-sm mr-2" @click.stop="details(item.key)">Manage</button> -->
              <!-- <button class="btn btn-outline-dark btn-sm mr-2" @click.stop="editarchive(item.key)">Edit</button> -->
              <a class="btn btn-primary mr-2" :href="'/u/' + username + '/' + archive.id">View</a>
              <a class="btn btn-primary" :href="'/admin/edit-archive/' + archive.id">Edit</a>
            </div>
          </div>   
          </div>      
          <a v-if="archives.length <= 2 " class="btn btn-outline-dark btn-sm my-4" href="/admin/add-archive">New Archive <font-awesome-icon icon="plus" size="1x" /></a>
          <div v-else>You have reached the limit of 3 archives.</div>
        </div>            
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
      uid: firebase.auth().currentUser.uid,
      username: firebase.auth().currentUser.displayName,
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
          dateCreated: sa.getFormattedDate(doc.data().dateCreated),
          desc: doc.data().desc,
          id: doc.id,
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
    },
  }
}
</script>

