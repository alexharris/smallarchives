<template>
   <!-- <div class="card mb-5">
        <ArchiveHeaderImage v-bind:archiveId="key" class="mr-3"/>
        <div class="card-body">
            <h5 class="card-title"><a :href="'/u/' + username + '/' + archiveId">{{archiveTitle}}</a></h5>
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
    </div> -->
    <div>
        <div class="card mb-3">
            <div class="row no-gutters">
                <div class="col-lg-4 p-4">
                <ArchiveHeaderImage v-bind:archiveId="key" class="mr-3 header-image"/>
                </div>
                <div class="col-lg-8">
                    <div class="card-body">
                        <h4 class="card-title"><a :href="'/u/' + username + '/' + archiveId">{{archiveTitle}}</a></h4>
                        <p class="card-text">{{archiveDesc}}</p>
                        <ul class="list-unstyled">
                            <li><strong>Number of Items: </strong> {{numberOfItems}} <br /></li>
                            <li><strong>Custom Fields: </strong><span v-for="field in archiveCustomFields" class="badge badge-pill badge-info mr-2">{{field}}</span><br /></li>
                            <li><strong>Tags: </strong><span v-for="tag in archiveTags" class="badge badge-pill badge-warning mr-2">{{tag}}</span><br /></li>
                            
                        </ul>
                    </div>
                
                </div>
                    <div class="card-footer text-muted w-100">
                        <span>Created on: {{archiveDateCreated}}</span>
                        <a class="btn btn-primary btn-sm ml-2 float-right" :href="'/u/' + username + '/' + archiveId">View</a>
                        <a class="btn btn-outline-primary btn-sm float-right" :href="'/admin/edit-archive/' + archiveId">Edit</a> 
                    </div>      
            </div>
        </div>        
        <!-- <div class="row">
            <div class="col-xs-12 col-lg-4">
                <ArchiveHeaderImage v-bind:archiveId="key" class="mr-3 header-image"/>
            </div>
            <div class="col-xs-12 col-lg-8">
                <h3>{{archiveTitle}}</h3>
                <p>{{archiveDesc}}</p>
                <strong>Number of Items: </strong> {{numberOfItems}} <br />
                <strong>Custom Fields: </strong><span v-for="field in archiveCustomFields" class="badge badge-pill badge-info mr-2">{{field}}</span><br />
                <strong>Tags: </strong><span v-for="tag in archiveTags" class="badge badge-pill badge-warning mr-2">{{tag}}</span><br />
                <span><strong>Created:</strong> {{archiveDateCreated}}</span>
                <br />
                <hr />
                <a class="btn btn-outline-primary mr-2" :href="'/u/' + username + '/' + archiveId">View</a>
                <a class="btn btn-outline-primary" :href="'/admin/edit-archive/' + archiveId">Edit</a>            
            </div>   
        </div> -->  
    </div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'
import ArchiveHeaderImage from '../components/ArchiveHeaderImage'

export default {
    name: "AdminArchiveSnapshot",
    components: {
        ArchiveHeaderImage
    },
    props: ['archiveId'],
    data() {
        return {
            key: this.archiveId,
            uid: firebase.auth().currentUser.uid,
            username: firebase.auth().currentUser.displayName,
            archiveTitle: '',
            archiveDesc: '',
            archiveHeaderImage: '',
            archiveDateCreated: '',
            archiveCustomFields: [],
            archiveTags: [],
            numberOfItems: 0
            
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