<template>
    <div class="mt-5">
        <h4>Custom Fields</h4>
        <p>Add custom fields that can be filled out across all items.</p>
        <table class="table" v-if="customFields.length > 0">
            <thead>
                <th>Name</th>
                <th>Type</th>
                <th>Hint</th>
                <th>Action</th>
            </thead>
            <tr v-for="field in customFields">
                <td>{{field.id}}</td>
                <td>{{field.customFieldType}}</td>
                <td>{{field.customFieldHint}}</td>
                <td><button class="btn btn-sm btn-outline-primary" @click="deleteCustomField(field.id)">Delete</button></td>
            </tr>
        </table>
        <div v-else>
            <p>You have not added any custom fields yet. Fill out the form below to add one.</p>
        </div>
        <hr class="my-4" />
        <template v-if="errors.length > 0">
            <div class="alert alert-danger" show>
                <h3>Errors</h3>
                <ul>
                <li v-for="error in errors">{{error}}</li>
                </ul>
            </div>
        </template>        
        <p><strong>Add new Custom Field</strong></p>
        <div class="form-row my-3">
            <div class="form-group col-12 col-md-3">
                <label for="fieldName">Field Name</label>
                <input class="form-control" id="fieldName" v-model="customFieldName">
            </div>
            <div class="form-group col-12 col-md-3">
                <label for="fieldType">Field Type</label>
                <select id="fieldType" class="form-control" v-model="customFieldType">
                    <option selected>Text</option>
                </select>
            </div>
            <div class="form-group col-12 col-md-3">
                <label for="fieldHint">Hint Text</label>
                <input class="form-control" id="fieldHint" v-model="customFieldHint">
            </div>
        </div>        
        <button class="btn btn-primary" @click="addCustomField">Add Field</button>
    </div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'

export default {
    name: "AdminCustomFields",
    data() {
        return {
            uid: '',
            currentUser: '',
            customFields: [],
            customFieldName: '',
            customFieldNameError: false,
            customFieldType: '',
            customFieldTypeError: false,
            customFieldHint: '',
            newCustomFields: [],
            errors: 0
        }
    },
    created() {
        this.currentUser = firebase.auth().currentUser
        this.uid = firebase.auth().currentUser.uid
        this.archiveId = this.$route.params.archive_id



        this.getCustomFields();
    },   
    computed: {

            
    }, 
    methods: {    
        addCustomField: function() {

            console.log('custom name: ' + this.customFieldName)
            console.log('custom type: ' + this.customFieldType)

            // empty the error variable to get rid of old errors
            this.errors = []

            // check the form for completeness
            if (!this.customFieldName || this.customFieldName === '') { // title is mandatory
                this.errors.push('Field name is required')
                this.customFieldNameError = true
            }  else {
                this.customFieldNameError = false
            }
            
            // check the form for completeness
            if (!this.customFieldType || this.customFieldType === '') { // title is mandatory
                this.errors.push('Field type is required')
                this.customFieldTypeError = true
            }  else {
                this.customFieldTypeError = false
            }              

            if(!(this.errors.length > 0)) {
                sa.customFieldDocumentDbRef(this.uid, this.archiveId, this.customFieldName).set({
                    customFieldType: this.customFieldType,
                    customFieldHint: this.customFieldHint
                }).catch((error) => {
                    alert("Error adding document: ", error);
                }).then(() => {
                    // reset the form
                    this.customFieldName = ''
                    this.customFieldType = ''
                    this.customFieldHint = ''
                    // refresh the list
                    this.getCustomFields();
                })      
            }  
        },
        getCustomFields: function() {
            this.customFields = [];     
            sa.customFieldCollectionDbRef(this.uid, this.archiveId, this.customFieldName)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    this.customFields.push({
                        id: doc.id,
                        customFieldType: doc.data().customFieldType,
                        customFieldHint: doc.data().customFieldHint
                    });
                });
            });     
        }, 
        // When deleting a custom field, it needs to be deleted from both the customFields collection and from individual items customFields objects
        deleteCustomField: function(fieldName) {
            // Set some variables
            var uid = firebase.auth().currentUser.uid
            var archiveId = this.$route.params.archive_id

            // delete from the archive
            sa.customFieldDocumentDbRef(uid, archiveId, fieldName).delete().then(function() {
                // console.log("Custom Field on archive successfully deleted!");
            }).catch(function(error) {
                // console.error("Error removing custom field on archive: ", error);
            }).then(() => {
                // delete existing instances on items

                // get a reference to the collection of items and go through each one
                sa.itemCollectionDbRef(uid, archiveId)
                .get()
                .then((querySnapshot) => {
                    querySnapshot.forEach((doc) => {
                        //now we are in the document
                        //this is the initial customFields objects

                        // console.log(doc.id)

                        var customFields = doc.data().customFields

                        if(customFields == null ) {
                            // console.log('no custom field on this item')
                            

                        } else if (customFields.length === 0) {
                              //delete field object   
                                // console.log('delete empty field')
                                sa.itemDocumentDbRef(uid, archiveId, doc.id).update({
                                    customFields: firebase.firestore.FieldValue.delete()
                                })  
                        } else {
                            // console.log('rebuild with exsiting fields')
                            // rebuild the object by going through each field
                            for( var i = 0; i < customFields.length; i++){ 
                                // and checking to see if the key matches the field being deleted
                                if (Object.keys(customFields[i])[0] == fieldName) {
                                    // if it matches, splice it out of the array
                                    customFields.splice(i,1)
                                }
                            }
                            // replace the old object with the new one
                            sa.itemDocumentDbRef(uid, archiveId, doc.id).update({
                                "customFields": customFields
                            })                        
                        }

                    })
                }).then(() => {
                    // console.log('reload fields')
                    this.getCustomFields()
                })
            })


        }    
    },
};
</script>

<style scoped>



</style>