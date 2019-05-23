<template>
    <div>
   
        <table class="table" v-if="combinedFiles.length > 0">
        <thead>
            <tr>
            <th scope="col">#</th>
            <th scope="col">Name</th>
            <th scope="col">Action</th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="(file,i) in combinedFiles">
            <th scope="row">{{i+1}}</th>
            <td>{{file}}</td>
            <td><div class="btn btn-sm btn-outline-danger" @click="removeFile(file)">Remove</div></td>
            </tr>
        </tbody>
        </table> 
        <div class="">
            <label class="btn btn-primary" v-if="existingFiles.length < 5">
                Add file <input type="file" @change="fileAdded" accept=".jpg, .jpeg, .tif, .png, .gif, .wav, .mp3, .ogg, .m4a, .pdf" hidden>
            </label>
        </div>                
    </div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'

export default {
    name: "AdminMediaUploader",
    props: ['itemId'],
    data() {
        return {
            uid: firebase.auth().currentUser.uid,
            archiveId: this.$route.params.archive_id,
            newItemId: this.itemId,
            existingFiles: [], //the files on the item at the time of loading
            newFiles: [], // new files added to the item
            newFileNames: []
        }
    },
    watch: { 
        // it takes the parent a scond to create this value, so we watch to see when it is updated
        itemId: function(newVal, oldVal) { // watch it
        this.newItemId = newVal
            // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        }
    },    
    created() {
        //send existing files to make array of File objects
        this.getExistingFiles()
    },   
    computed: {
        combinedFiles: function() {
            return this.newFileNames.concat(this.existingFiles)
        }
    }, 
    methods: {   
        //----
        // When a file is added via the UI
        //----
        fileAdded: function(e) {
            
            if(e.target.files[0].type.includes('image/') && e.target.files[0].size > 1000000) { // image file size
                alert('That image is too big! Images must be under 1MB.')
            } else if (e.target.files[0].type.includes('application/pdf') && e.target.files[0].size > 5000000) { // PDF file size
                alert('That PDF is too big! PDFs must be under 5MB.')
            } else if (e.target.files[0].type.includes('audio/') && e.target.files[0].size > 5000000) { // audio file size
                alert('That PDF is too big! Audio files must be under 5MB.')
            } else {
                this.newFiles.push(e.target.files[0]) //make array of file blobs for upload
                this.newFileNames.push(e.target.files[0].name) //make array of file name for display
            }
        },        
        // combineNewAndExistingFiles: function() {
        //     console.log(this.newFiles)
        //     console.log(this.existingFiles)
        //     this.combinedFiles = this.newFiles.concat(this.existingFiles)
        // },
        uploadFiles: function() {

            // this.combineNewAndExistingFiles()
            console.log('begin uploading files')
            for(var i in this.newFiles) {
                console.log(this.newFiles[i])
                // ----
                // This puts the file into storage
                // at some point should check to see if it already exists and tell user
                sa.itemStorageRef(this.uid, this.archiveId, this.newItemId, this.newFiles[i].name).put(this.newFiles[i]).then((snapshot) => {
                    console.log('Uploaded a blob or file!');
                });    
                // ----    
                // This puts the filename in the database 
                // at some point should check to see if it already exists and tell user
                sa.itemDocumentDbRef(this.uid, this.archiveId,this.newItemId).update({
                    itemMediaFiles: firebase.firestore.FieldValue.arrayUnion(this.newFiles[i].name)
                }) .then(() => {
                    // update the files that show to the user
                    this.getExistingFiles()
                })
            }            
        },
        removeFile: function(fileName) {
            // ----    
            // This removes the filename from the database 
            sa.itemDocumentDbRef(this.uid, this.archiveId,this.newItemId).update({
                itemMediaFiles: firebase.firestore.FieldValue.arrayRemove(fileName)
            }) .then(() => {
                sa.itemStorageRef(this.uid, this.archiveId, this.newItemId, fileName, '').delete()
                sa.itemStorageRef(this.uid, this.archiveId, this.newItemId, fileName, 'thumb_').delete()
                this.getExistingFiles()

            })
        },

        //----
        // In order to list the files that have already been uploaded
        //----        
        getExistingFiles: function() {

            if(this.newItemId !== '') {
                console.log(this.uid, this.archiveId, this.newItemId)
                // This gets all of the files currently listed in item.itemMediaFiles
                sa.itemDocumentDbRef(this.uid, this.archiveId, this.newItemId).get().then((doc) => {
                    if (doc.exists) {
                        this.existingFiles = doc.data().itemMediaFiles
                    } else {
                        // doc.data() will be undefined in this case
                        console.log("No such document!");
                    }
                }).catch(function(error) {
                    console.log("Error getting document:", error);
                });                
            } else {
                console.log('new item, no existing files')
            }


            // sa.itemStorageRef(this.uid, this.archiveId, this.itemId, fileName, '').getMetadata().then((metadata) => {
            //     // Metadata now contains the metadata for 'images/forest.jpg'
            //     console.log(metadata)
            //     this.combinedFiles.push(metadata)
            // }).catch(function(error) {
            //     console.log(error.message)
            // // Uh-oh, an error occurred!
            // });
        },
        // getFileMetadata: function(fileName) {
        //     var fileMetadata = ''
        //     sa.itemStorageRef(this.uid, this.archiveId, this.itemId, fileName, '').getMetadata().then((metadata) => {
        //         // Metadata now contains the metadata for 'images/forest.jpg'
        //         fileMetadata = metadata
        //     }).then(() => {
        //         return fileMetadata
        //     }).catch(function(error) {
        //         console.log(error.message)
        //     // Uh-oh, an error occurred!
        //     });

        // }
    },
};
</script>

<style>

.file-input {
    border: 1px solid #f00;
}

.file-input::-webkit-file-upload-button {
  visibility: hidden;
}
.file-input::before {
  content: 'Select some files';
  display: inline-block;
  background: linear-gradient(top, #f9f9f9, #e3e3e3);
  border: 1px solid #999;
  border-radius: 3px;
  padding: 5px 8px;
  outline: none;
  white-space: nowrap;
  -webkit-user-select: none;
  cursor: pointer;
  text-shadow: 1px 1px #fff;
  font-weight: 700;
  font-size: 10pt;
}
.file-input:hover::before {
  border-color: black;
}
.file-input:active::before {
  background: -webkit-linear-gradient(top, #e3e3e3, #f9f9f9);
}


</style>