<template>
  <div>
    <a class="btn btn-primary" :href="encodedUri" download="my-data.csv">Download CSV</a>
  </div>
</template>

<script>

import firebase from 'firebase'
import sa from '../sa'

export default {
  name: 'AdminExportData',
  data () {
    return {
      items: [],
      csv: '',
      encodedUri: ''
    }
  },
  created() {
    this.createItemArray()

    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
   
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
            fileName: doc.data().itemFileName,
            itemTitle: doc.data().itemTitle,
            itemId: doc.id,
            itemCreationDate: sa.getFormattedDate(doc.data().itemCreationDate),
            itemText: doc.data().itemText,
            itemType: doc.data().itemType
          });

        });
      }).then(() => {
        this.convertToCsv()

      });       
    },
    convertToCsv: function() {

      const items = this.items
      const replacer = (key, value) => value === null ? '' : value // specify how you want to handle null values here
      const header = Object.keys(items[0])
      let csv = items.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      csv.unshift(header.join(','))
      csv = "data:text/csv;charset=utf-8," + csv.join('\n')
      this.csv = csv
      console.log(csv)

      this.encodedUri = encodeURI(csv);


    },
    downloadCsv: function() {
      window.open(this.encodedUri);
    }
  }
}
</script>

