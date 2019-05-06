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
            customFieldType: '',
            customFieldHint: '',
            newCustomFields: []
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
            console.log(this.customFieldName)
            sa.customFieldDocumentDbRef(this.uid, this.archiveId, this.customFieldName).set({
                customFieldType: this.customFieldType,
                customFieldHint: this.customFieldHint
            }).catch((error) => {
                alert("Error adding document: ", error);
            }).then(() => {
                this.getCustomFields();
            })        
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
                console.log("Document successfully deleted!");
            }).catch(function(error) {
                console.error("Error removing document: ", error);
            });

            // delete existing instances on items
            // get a reference to the collection of items and go through each one
            sa.itemCollectionDbRef(uid, archiveId)
            .get()
            .then((querySnapshot) => {
                querySnapshot.forEach((doc) => {
                    //now we are in the document

                    //this is the initial customFields objects
                    var customFields = doc.data().customFields

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


                })

            }).then(() => {
                this.getCustomFields()
            })

        }    

    },

};
</script>

<style scoped>



</style>