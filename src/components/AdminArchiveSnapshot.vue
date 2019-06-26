<template>
    <div class="card mb-3 col-10">
        <div class="card-body">
            <h3 class="mb-4"><a :href="'/u/' + username + '/' + archiveId">{{archiveTitle}}</a></h3>
            <p>{{archiveDesc}}</p>
            <strong>Number of Items: </strong> {{numberOfItems}} <br />
            <strong>Custom Fields: </strong><span v-for="field in archiveCustomFields" class="badge badge-pill badge-info mr-2">{{field}}</span><br />
            <strong>Tags: </strong><span v-for="tag in archiveTags" class="badge badge-pill badge-warning mr-2">{{tag}}</span><br />
            <span><strong>Created:</strong> {{archiveDateCreated}}</span><br />

        </div>
        <div class="card-footer">
            <a class="btn btn-primary mr-2" :href="'/u/' + username + '/' + archiveId">View</a>
            <a class="btn btn-primary" :href="'/admin/edit-archive/' + archiveId">Edit</a>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'

export default {
    name: "AdminArchiveSnapshot",
    props: ['archiveId'],
    data() {
        return {
            uid: firebase.auth().currentUser.uid,
            username: firebase.auth().currentUser.displayName,
            archiveTitle: '',
            archiveDesc: '',
            archiveHeaderImage: '',
            archiveDateCreated: '',
            archiveCustomFields: [],
            archiveTags: [],
            numberOfItems: ''
            
        }
    },
    created() {
        this.getArchives()
        this.getItems()
        this.getCustomFields()
        this.getCustomTags()

    },   
    computed: {

            
    }, 
    methods: {    
        details (archiveId) {
            this.$router.push({ name: 'AdminShowArchive', params: { archive_id: archiveId }})
        },
        linkToPublicView (archive) {
            this.$router.push({ name: 'PublicArchive', params: { archive_id: archive.key, username: this.displayName }})
        },
        getArchives() {
            sa.archiveDocumentDbRef(this.uid, this.archiveId).get().then((doc) => {
                this.archiveTitle = doc.data().title
                this.archiveDesc = doc.data().desc
                this.archiveHeaderImage = doc.data().archiveHeaderImage
                this.archiveDateCreated = sa.getFormattedDate(doc.data().dateCreated)
            })
        },
        getItems() {
            sa.itemCollectionDbRef(this.uid, this.archiveId).get().then((querySnapshot) => {
                querySnapshot.forEach((doc => {
                    this.numberOfItems++
                }))
            }) 
        },
        getCustomFields () {
            sa.customFieldCollectionDbRef(this.uid, this.archiveId).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.archiveCustomFields.push(doc.id)
                });

            })
        },
        getCustomTags () {
            sa.tagCollectionDbRef(this.uid, this.archiveId).get().then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.archiveTags.push(doc.data().tagTitle)
                });

            })
        }

  
    },
};
</script>

<style scoped>



</style>