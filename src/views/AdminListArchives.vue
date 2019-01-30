<template>
  <div>
    <div v-if="archives.length == 0">
      <b-jumbotron>
        <h3>Welcome to Small Archives</h3>
        <p>You have no archives at this time. Create a new one to get started</p>
        <b-button href="/admin/add-archive" variant="outline-primary">New Archive</b-button>

      </b-jumbotron>      

    </div>
    <div v-else>
      <b-row class="mb-3">
        <b-button href="/admin/add-archive" class="float-right" variant="outline-primary">Add Archive</b-button>
      </b-row>
      <b-row>
        <b-table hover :items="archives" :fields="fields" class="table-bordered" head-variant="dark">
          <template slot="actions" scope="row">
            <b-btn size="sm" variant="outline-secondary" @click.stop="details(row.item.key)">Details</b-btn>&nbsp;
            <b-btn size="sm" variant="outline-secondary" @click.stop="linkToPublicView(row.item)">View</b-btn>&nbsp;
          </template>
        </b-table>
      </b-row>
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
