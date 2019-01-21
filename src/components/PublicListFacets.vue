<template>
  <b-row>
    <b-col cols="12">
      <div v-if="facets.length == 0">
          <p>This archive has no facets.</p>    
      </div>   
      <div v-else>            
       <ul>
          <li v-for="item in facets">
            
            <span @click.stop='selectFacet(item.label)'>{{item.label}}</span>: 
            <span @click.stop='selectFacetValue(item.value)'>{{item.value}}</span>

          </li>
        </ul>
                            
      </div> 
    </b-col>
  </b-row>


  </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "PublicListFacets",  
  data() {
    return {
    uid: '',
    url: '',
    facets: []
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
        this.createFacetArray()
      })
      .catch(function(error) {
          console.log("Error getting documents: ", error);
      });  
    },    
    // This function creates an array called 'facets' that contains 
    // all of the facets that have been added to a particular archive.

    createFacetArray: function() {
                
      firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").doc(this.$route.params.id).collection('assets')
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          var label = Object.keys(doc.data().customFields)[0]
          
          var value = Object.values(doc.data().customFields)[0]
          
          this.facets.push({label,value})

        });
      })     
    }, 
    countFacetArray: function() {

      this.uniqueFacetArray.forEach((facet) => {
        console.log(firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").doc(this.$route.params.id).collection('assets'));
        var item = firebase.firestore().collection("archives").doc(this.uid).collection("userarchives").doc(this.$route.params.id).collection('assets').where("assetType", "==", "text");
        console.log(item.assetTitle)
      })
      
    },
    selectFacet: function(item) {
      this.$store.commit('setSelectedFacet', item)
    },
    selectFacetValue: function(item) {
      this.$store.commit('setSelectedFacetValue', item)
    }          
  },
  computed: {
    selectedFacet: function() {
      return this.$store.getters.getSelectedFacet
    },
    selectedFacetValue: function() {
      return this.$store.getters.getSelectedFacetValue
    },    
    // uniqueFacetLabelArray: function() {
    //   return [...new Set(this.facets.map(p => p.fieldLabel))]
    // },
    // uniqueFacetValueArray: function() {
    //   return [...new Set(this.facets.map(p => p.fieldValue))]
    // }, 
  },
  created() {
    this.getUidFromUsername()
  },  
};
</script>