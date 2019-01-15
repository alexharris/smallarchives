<template>
	<div>
		<b-row>
			<b-col>
				<b-btn @click.stop="goBackOne">Back</b-btn>
				<hr class="my-4" />
			</b-col>
		</b-row>
		<b-row>
			<b-col>
				<h1>{{asset.assetTitle}}</h1>
				<hr class="my-4" />	
			</b-col>
		</b-row>
		<b-row>

			<b-col cols="12" class="col-md-6">


				<img :src="assetSrc" />

			</b-col>
			<b-col cols="12" class="col-md-6">
				<p>Asset ID: {{asset.assetId}}</p>
				<p>Filename: {{asset.assetName}}</p>
				<h4>Custom Fields</h4>
				<table class="table-bordered table">
					<thead>
						<tr>
						  <th scope="col">Field</th>
						  <th scope="col">Value</th>
						</tr>
					</thead>					
					<tr v-for="item in asset.customFields">
						<td>{{item.fieldLabel}}</td>
						<td>{{item.fieldValue}}</td>
					</tr>
				</table>
			</b-col>
		</b-row>
	</div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "PublicAsset",  
  data() {
  	return {
  		asset: {
	        assetTitle: '',
	        assetName: '',
	        assetId: '',
	        filePath: '',
	        customFields: ''			
  		},
  		assetSrc: '',
  		uid: ''
  	}
  },

  methods: {
    getUidFromUsername() {

      // get the user id based on the displayname from the route
      firebase.firestore().collection('users').where("displayName", "==", this.$route.params.username)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
            // doc.data() is never undefined for query doc snapshots
            // Assign the user id from the document to the uid variable

            this.uid = doc.id
            
        });

        // when this is done, we can get the assets
       this.getAssetDetails()
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });  

      
    },     	
    getAssetDetails: function() {
        
	    const ref = firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").doc(this.$route.params.archive_id).collection('assets').doc(this.$route.params.asset_id);

	    // get the fields from the database and assign to asset array
	    ref.get().then((doc) => {
	      if (doc.exists) {

	      	this.asset.filePath = this.uid + '/' + this.$route.params.archive_id + '/' + doc.data().file
	        this.asset.assetTitle = doc.data().assetTitle
	        this.asset.assetName = doc.data().file
	        this.asset.assetId = doc.id
	        this.asset.customFields = doc.data().customFields
	        console.log(doc.data().customFields)

	        this.getAssetSrc()
	      } else {
	        console.log("No such document!");
	      }
	    });      
    },  
    getAssetSrc: function() {
        firebase.storage().ref().child(this.asset.filePath).getDownloadURL().then((url) => {
            this.assetSrc = url
        }).catch(function(error) {
          console.log(error.message)
        })
    },    	
	goBackOne() {
	  this.$router.go(-1)
	},      
  },
  
  created() {
  	this.getUidFromUsername()
  	
  }
 
};
</script>

<style scoped>
img {
	max-width: 100%;
}
</style>
