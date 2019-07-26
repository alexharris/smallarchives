<template>
  <span>
    <!-- <table class="table">
      <thead>
        <tr>
          <th scope="col">Title</th>
          <th scope="col">Description</th>
          <th scope="col">Tags</th>
          <th scope="col">Type</th>
          <th scope="col">Contributor</th>
          <th scope="col">Date</th>
          <th scope="col">Coverage</th>
          <th scope="col">Latitude</th>
          <th scope="col">Longitude</th>
          <th scope="col">Creator</th>
          <th scope="col">Format</th>
          <th scope="col">Language</th>
          <th scope="col">Publisher</th>
          <th scope="col">Relation</th>
          <th scope="col">Rights</th>
          <th scope="col">Source</th>
          <th scope="col">Subject</th>
          <th scope="col">Media Files</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="item in items">
          <td>{{item.itemTitle}}</td>
          <td>{{item.itemDescription}}</td>
          <td>{{item.tags}}</td>
          <td>{{item.itemType}}</td>
          <td>{{item.itemContributor}}</td>
          <td>{{item.itemDate}}</td>
          <td>{{item.itemCoverage}}</td>
          <td>{{item.itemCoverageLat}}</td>
          <td>{{item.itemCoverageLong}}</td>
          <td>{{item.itemCreator}}</td>
          <td>{{item.itemFormat}}</td>
          <td>{{item.itemLanguage}}</td>
          <td>{{item.itemPublisher}}</td>
          <td>{{item.itemRelation}}</td>
          <td>{{item.itemRights}}</td>
          <td>{{item.itemSource}}</td>
          <td>{{item.itemSubject}}</td>
          <td>{{item.itemMediaFiles}}</td>
          </tr>
      </tbody>
    </table>     -->
    <a :href="encodedUri" :download="archiveTitle + '.csv'" v-if="items.length > 0">Download Data as CSV</a>
    <span v-else>There are no items to export.</span>
  </span>
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'

export default {
  name: 'AdminExportData',
  data () {
    return {
      items: [],
      csv: '',
      encodedUri: '',
      archiveTitle: ''
    }
  },
  created() {
    this.createItemArray()

    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
    var archiveId = this.$route.params.archive_id
    const date = new Date().toJSON().slice(0,10).replace(/-/g,'-');

    sa.archiveDocumentDbRef(currentUser.uid, archiveId).get().then((doc) => {
      this.archiveTitle = doc.data().title
    }).then(() => {
      this.archiveTitle = 'SmallArchives-' + this.archiveTitle.split(' ').join('') + '-Export-' + date
    })
  },
  methods: {  
    createItemArray: function() {

      var uid = firebase.auth().currentUser.uid
      var archiveId = this.$route.params.archive_id

      sa.itemCollectionDbRef(uid, archiveId)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          this.items.push({
            itemTitle: doc.data().itemTitle,   
            itemDescription: doc.data().itemDescription,  
            tags: doc.data().tags.join(','),            
            itemMediaFileName: doc.data().itemMediaFileName,            
            // itemMediaYoutubeId: doc.data().itemMediaYoutubeId,            
            itemType: doc.data().itemType,            
            itemContributor: doc.data().itemContributor,            
            itemDate: doc.data().itemDate,            
            itemCoverage: doc.data().itemCoverage,            
            itemCoverageLat: doc.data().itemCoverageLat,            
            itemCoverageLong: doc.data().itemCoverageLong,            
            itemCreator: doc.data().itemCreator,  
            itemFormat: doc.data().itemFormat,  
            itemIdentifier: doc.data().itemIdentifier,  
            itemLanguage: doc.data().itemLanguage,  
            itemPublisher: doc.data().itemPublisher,            
            itemRelation: doc.data().itemRelation,  
            itemRights: doc.data().itemRights,  
            itemSource: doc.data().itemSource,  
            itemSubject: doc.data().itemSubject,
            customFields: doc.data().customFields,
            itemFeatureImageName: doc.data().itemFeatureImageName,
            tags: Object.assign({}, doc.data().tags),
            itemMediaFiles: Object.assign({}, doc.data().itemMediaFiles)

          });
        });
      }).then(() => {
        if(this.items.length > 0) {
          this.convertToCsv()
        }
      })     
    },
    convertToCsv: function() {

      const items = this.items // get all the items in an array of objects
      const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
      const header = Object.keys(items[0]) // this creates an array of the field names
    
      let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join('\t')) // this takes the header values and maps them

      csv.unshift(header.join('\t'))
      csv = "data:text/csv;charset=utf-8," + csv.join('\n')
      this.csv = csv
  
      this.encodedUri = encodeURI(csv);


    },
    downloadCsv: function() {
      window.open(this.encodedUri);
    }
  }
}
</script>

