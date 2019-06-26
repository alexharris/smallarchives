<template>
  <div class="row">
    <div class="col-12">
      <div class="row justify-content-center mb-5">
        <div class="col-12" v-if="archives.length == 0">
          <h3>Welcome to Small Archives</h3>
          <p>You have no archives at this time. Create a new one to get started.</p>
          <a class="btn btn-dark" href="/admin/add-archive">New Archive <font-awesome-icon icon="plus" size="1x" /></a>   
        </div>
        <div class="col-12 justify-content-center" v-else>
          <div class="row justify-content-center my-4">
            <div class="col-10 m-0 p-0">
              <h4>Your Dashboard –</h4>
            </div>
          </div>
          <div class="row justify-content-center">
          
            <template v-for="archive in archives">
              <AdminArchiveSnapshot :archiveId="archive.id" />
            </template>   
          </div>
          <div class="row justify-content-center my-4">
            <div class="col-10 m-0 p-0">
              <a v-if="archives.length <= 2 " class="btn btn-outline-dark btn-sm my-4" href="/admin/add-archive">New Archive <font-awesome-icon icon="plus" size="1x" /></a>
              <div v-else>You have reached the limit of 3 archives.</div>
            </div>
          </div>          


        </div>            
      </div>
    </div>
  </div>
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'
import AdminArchiveSnapshot from '../components/AdminArchiveSnapshot'

export default {
  name: 'AdminListArchives',
  components: {
    ArchiveHeaderImage,
    AdminArchiveSnapshot
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
      username: firebase.auth().currentUser.displayName
    }
  },
  created () {

    
    this.getArchives()

    
  },
  methods: {
        getArchives() {
            sa.archiveCollectionDbRef(this.uid).get().then((querySnapshot) => {
                this.archives = [];
                querySnapshot.forEach((doc) => {
                    this.archives.push({
                        id: doc.id
                    });
                });
            })
        },
  }
}
</script>

