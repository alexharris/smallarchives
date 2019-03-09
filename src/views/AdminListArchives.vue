<template>
  <div class="row px-sm-5 justify-content-center">
    <div class="col-12">
      <div class="row">
        <div class="col-8" v-if="archives.length == 0">
          <h3>Welcome to Small Archives</h3>
          <p>You have no archives at this time. Create a new one to get started.</p>
          <a class="btn btn-dark" href="/admin/add-archive">New Archive</a>   
        </div>
        <div class="col-12 col-md-8" v-else>
          <h4>Your Archives:</h4>
          <div v-for="item in archives" class="card mb-3">
            <div class="card-header">{{item.title}}</div>
            <div class="card-body">
              <p><strong>Description:</strong> {{item.desc}}</p>
              <p><strong>Created:</strong> {{item.dateCreated}}</p>
              
            </div>
            <div class="card-footer">
              <button class="btn btn-outline-dark btn-sm mr-2" @click.stop="details(item.key)">Details</button>
              <button class="btn btn-outline-dark btn-sm" @click.stop="linkToPublicView(item)">View</button>
            </div>
          </div>              
          <a class="btn btn-dark btn-sm mb-4" href="/admin/add-archive">New Archive</a>
        </div>            
        <div class="col-12 col-md-4">
          <div class="card mb-3">
            <div class="card-header">
              Account Info
            </div>
            <div class="card-body">
              <ul class="list-unstyled">
                <li><strong>Username:</strong> {{displayName}}</li>
                <li><strong>Email:</strong> {{emailAddress}} <span v-if="emailVerified"><span class="badge badge-success">Verified</span></span><span v-else><a class="#" @click="resendEmailVerification()" data-toggle="modal" data-target="#exampleModal"><small>Send Verification</small></a></span></li>
                <li><strong>Joined:</strong> {{joinDate}}</li>
                <li><strong>ID:</strong><small> {{uid}} </small></li>
              </ul>
              
            </div>
          </div>
          <div class="card">
            <div class="card-header">
              Stats
            </div>
            <div class="card-body">
              <div class="row">
                <div class="col-6">
                  Archives<br/>
                  <span class="display-4">{{this.archives.length}}</span>
                </div>
                <div class="col-6">
                  Items<br/>
                  <span class="display-4">{{numberOfItems}}</span>
                </div>
              </div>
            </div>
          </div>  
        </div>
      </div>
    </div>
    <!-- Modal -->
    <div class="modal fade" id="exampleModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
      <div class="modal-dialog modal-dialog-centered" role="document">
        <div class="modal-content">
          <div class="modal-body">
            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
              <span aria-hidden="true">&times;</span>
            </button>            
            Email Verification Sent
          </div>
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
      displayName: this.$store.getters.getUser.displayName,
      emailAddress: this.$store.getters.getUser.email,
      numberOfItems: 0,
      joinDate: firebase.auth().currentUser.metadata.creationTime,
      uid: firebase.auth().currentUser.uid
    }
  },
  created () {


    var uid = firebase.auth().currentUser.uid

    this.getNumberOfItems()

    sa.archiveCollectionDbRef(uid).onSnapshot((querySnapshot) => {
      this.archives = [];
      querySnapshot.forEach((doc) => {

        this.archives.push({
          key: doc.id,
          title: doc.data().title,
          dateCreated: sa.getFormattedDate(doc.data().dateCreated),
          desc: doc.data().desc,
          assets: sa.assetCollectionDbRef(uid,doc.id)
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
    getNumberOfItems () {
  
      sa.userArchivesDocumentDbRef(firebase.auth().currentUser.uid).onSnapshot((doc) => {
        
        if(doc.exists != false ) {
          this.numberOfItems = doc.data().numberOfItems;
        }
      });
      
    },
    resendEmailVerification() {
                        //send verification email
                  firebase.auth().currentUser.sendEmailVerification().then(function() {
                    // Email sent.
                  }).catch(function(error) {
                    // An error happened.
                  });
    }  
  },
  computed: {
    emailVerified () {
      return firebase.auth().currentUser.emailVerified 
    }
  }
}
</script>
