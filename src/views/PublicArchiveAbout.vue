<template>
  <div>

    <div class="m-5">
      <a :href="'/u/' + username + '/' + archiveId">Back</a>
      <ArchiveHeaderImage v-bind:archiveId="key" class="mr-3 pt-5 header-image pb-5" v-if="ready"/>
      <div class="justify-content-left">
        <h1>{{archive.title}}</h1>
        <p class="lead">{{archive.desc}}</p>  
        <p class="pt-5">This archive was created on <strong>{{creationDate}}</strong> by <strong>{{ this.username }}</strong>.</p>
      </div>       
    </div>
  </div>
</template>

<script>
  import firebase from 'firebase/app';
  import sa from '../sa'
  import ArchiveHeaderImage from '../components/ArchiveHeaderImage'

  export default {
    name: 'PublicArchiveAbout',
    data() {
      return {
        uid: '',
        key: '',
        archive: {},
        archiveId: this.$route.params.archive_id, 
        username: this.$route.params.username,
        ready: false
      }
    },
    components: {
      ArchiveHeaderImage
    },
    beforeMount () {
      this.getUidFromUsername()
    },
    methods: {
      async getUidFromUsername() {
        var username = this.$route.params.username
        this.uid = await sa.getUidFromUsername(username)

        // send to 404 when no UID matches
        if(this.uid === false) {
          this.$router.push('/404')
        }      
        this.getArchiveDetails()
      },      
      getArchiveDetails: function() {
        
        sa.archiveDocumentDbRef(this.uid, this.archiveId).get().then((doc) => {
          console.log(doc)
          if (doc.exists) {
            this.key = doc.id;
            this.archive = doc.data();
            this.creationDate = sa.getFormattedDate(doc.data().dateCreated)
            this.headerImage = doc.data().headerImage
            this.showMap = doc.data().showMap
            this.showList = doc.data().showList
            // this.showGrid = doc.data().showGrid // show grid is always set to true since it is the default
            this.mapLat = doc.data().mapLat
            this.mapLong = doc.data().mapLong
            this.zoom = doc.data().zoom
            this.ready = true
          } else {
            this.$router.push('/404')
          }
        });
      },      
    } 
  }
</script>
