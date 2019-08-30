<template>
    <div>
        <table class="table" v-if="combinedFiles.length > 0">
            <thead> 
                <tr>
                    <th scope="col">#</th>
                    <th scope="col">Name</th>
                    <th scope="col">Delete</th>
                    <th scope="col" class="text-center">
                        Feature
                        <popper
                            trigger="click"
                            :options="{
                            placement: 'bottom',
                            modifiers: { offset: { offset: '0,0' } }
                            }">
                            <div class="popper">
                            The feature image will display on the archive page.
                            </div>
                        
                            <button class="btn btn-link" slot="reference">
                            <font-awesome-icon icon="question-circle" size="1x" />
                            </button>
                        </popper>                          
                    </th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(file,i) in combinedFiles">
                <th scope="row">{{i+1}}</th>
                <td>{{file}}</td>
                <!-- <td><input type="checkbox" @change="manageDeleteArray(file)"></td> -->
                <td><div class="btn btn-sm btn-outline-danger" @click="deleteFile(file)">Delete</div></td>
                <td class="text-center">
                    <div class="form-check" v-if="mimeType(file).includes('image')">
                       
                    <input class="form-check-input" type="radio" name="exampleRadios" :id="file" :value="file" @change="setFeatureImage(file)" :checked="isThisImageCurrentlyFeatured(file)"/>
                    </div>                 
                </td>
                </tr>
            </tbody>
        </table>  
        <div class="">
            <label class="btn btn-primary btn-sm" >
                Add file <input type="file" @change="fileAdded" accept=".jpg, .jpeg, .tif, .png, .gif, .wav, .mp3, .ogg, .m4a, .pdf, .mov, .mpg, .mpeg" hidden>
            </label>
        </div>                
    </div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'
import mime from "mime-types";
import Popper from 'vue-popperjs';
import 'vue-popperjs/dist/vue-popper.css';

export default {
    name: "AdminMediaUploader",
    components: {
        'popper': Popper
    },
    props: ['itemId'],
    data() {
        return {
            uid: firebase.auth().currentUser.uid,
            archiveId: this.$route.params.archive_id,
            newItemId: this.itemId,
            existingFiles: [], //the files on the item at the time of loading
            newFiles: [], // new files added to the item
            newFileNames: [],
            filesToBeDeleted: [],
            featureImage: '',
            existingFeatureImage: '',
            truth: true
        }
    },
    watch: { 
        // it takes the parent a scond to create this value, so we watch to see when it is updated
        itemId: function(newVal, oldVal) { // watch it
        this.newItemId = newVal
            // console.log('Prop changed: ', newVal, ' | was: ', oldVal)
        },    
    },    
    created() {
        //send existing files to make array of File objects
        // nothing is happening here because we wait, in the parent, for the itemid for new items to be created, and then getExistingFiles is called from there when its ready
    },   
    computed: {
        combinedFiles: function() {
            return this.newFileNames.concat(this.existingFiles)
        },
        numberOfFiles: function() {
            if(this.existingFiles != []) {
                return this.existingFiles.length
            } else {
                return 0
            }
        }
    }, 
    methods: {  
        mimeType: function(file) {
            return mime.lookup(file)
        },             
        // Determine if the image is currently featured
        isThisImageCurrentlyFeatured: function(file) {
            if(file === this.existingFeatureImage) {
                this.featureImage = file
                return true
            } else {
                return false
            }
        } ,    
        //----
        // When a file is added via the UI
        //----
        fileAdded: function(e) {
            
            if(e.target.files[0].type.includes('image/') && e.target.files[0].size > 2000000) { // image file size
                alert('That image is too big! Images must be under 2MB.')
            } else if (e.target.files[0].type.includes('application/pdf') && e.target.files[0].size > 5000000) { // PDF file size
                alert('That PDF is too big! PDFs must be under 5MB.')
            } else if (e.target.files[0].type.includes('audio/') && e.target.files[0].size > 5000000) { // audio file size
                alert('That PDF is too big! Audio files must be under 5MB.')
            } else if (e.target.files[0].type.includes('video/') && e.target.files[0].size > 25000000) { // audio file size
                alert('That PDF is too big! Audio files must be under 25MB.')
            }else {
                this.newFiles.push(e.target.files[0]) //make array of file blobs for upload
                this.newFileNames.push(e.target.files[0].name) //make array of file name for display
            }
        },        

        uploadFiles: function() {
            // this.combineNewAndExistingFiles()
            console.log('begin uploading files')
            for(var i in this.newFiles) {
            console.log('Name: ' + this.newFiles[i].name)
            console.log('File: ' + this.newFiles[i])

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
                    itemMediaFiles: firebase.firestore.FieldValue.arrayUnion(this.newFiles[i].name),
                }) 
            }   
            // ----   
            // This puts the name of the feature image into the DB         
            sa.itemDocumentDbRef(this.uid, this.archiveId,this.newItemId).update({
                featureImage: this.featureImage
            }) 
        },

        deleteFile: function(fileName) {

            // vvvvvvvvvvvvvvvvvvv
            // console.log('deleteFiles called')
            // if(this.filesToBeDeleted.length > 0) {
            //     // console.log('there are some files to be deleted')
            //     // go through the files
            //     for (var i in this.filesToBeDeleted) {
            //         // check to see if this file has already been uploaded previously
            //         // console.log(this.existingFiles)
            //         // console.log(this.filesToBeDeleted[i])
            //         if(this.existingFiles.includes(this.filesToBeDeleted[i])) {
            //             //this means it has, so we need to delete from DB and Storage
            //             console.log('delete from storage: ' + this.filesToBeDeleted[i])
            //         } else {
            //             console.log('remove from newFiles: ' + this.filesToBeDeleted[i])
            //         }
            //     }              
            // } else {
            //     console.log('there are no files to be deleted')
            // }
            /// ^^^^^^^^^^^^^^^^^^^^^
            if(this.existingFiles.includes(fileName)) {
                //this means it has, so we need to delete from DB and Storage
                console.log('delete from storage: ' + fileName)
                // This removes the filename from the database 
                sa.itemDocumentDbRef(this.uid, this.archiveId,this.newItemId).update({
                    itemMediaFiles: firebase.firestore.FieldValue.arrayRemove(fileName)
                }) .then(() => {
                    sa.itemStorageRef(this.uid, this.archiveId, this.newItemId, fileName, '').delete()
                    sa.itemStorageRef(this.uid, this.archiveId, this.newItemId, fileName, 'thumb_').delete()
                    this.getExistingFiles()

                })                
            } else {
                console.log('remove from newFiles: ' + fileName)
                console.log('new files: ' + this.newFiles)
                
                // var index = this.newFiles.indexOf(fileName);
                // if (index !== -1) this.newFiles.splice(index, 1); 
                 
                // remove the file blob from the file list
                this.newFiles = this.newFiles.filter(function( obj ) {
                    return obj.name !== fileName;
                });

                //remove from the filename list
                var index = this.newFileNames.indexOf(fileName);
                if (index !== -1) this.newFileNames.splice(index, 1); 

                console.log(this.newFiles)
                console.log(this.newFileNames)

            }

        },

        //----
        // In order to list the files that have already been uploaded
        //----        
        getExistingFiles: function(itemId = this.newItemId) {

            // This gets all of the files currently listed in item.itemMediaFiles
            sa.itemDocumentDbRef(this.uid, this.archiveId, itemId).get().then((doc) => {
                if (doc.exists) {
                    if (doc.data().itemMediaFiles != undefined) {
                        this.existingFiles = doc.data().itemMediaFiles
                    }                    
                } else {
                    // doc.data() will be undefined in this case
                    console.log("No such document!");
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            }).then(() => {

                this.getFeatureImage()
            })               

        },
        //----
        // Get the feature image for the item
        //----        
        getFeatureImage: function() {
            sa.itemDocumentDbRef(this.uid, this.archiveId, this.newItemId).get().then((doc) => {
                if (doc.exists) {
                    this.existingFeatureImage = doc.data().featureImage
                }
            }).catch(function(error) {
                console.log("Error getting document:", error);
            });
        },          
        //----
        // Set the feature image on the item record
        //----        
        setFeatureImage: function(featureImage) {
            this.featureImage = featureImage
        },        

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