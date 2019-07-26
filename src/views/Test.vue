<template>
  <div class="container py-4">
    <div class="row">
      <div class="btn btn-primary" @click="testDB()">Test</div>
    </div>
  </div>
</template>

 <script>
  import firebase from 'firebase/app'
  import sa from '../sa'

  export default {
    name: 'Test',
    data() {
      return {

      }
    },
    methods: {
      testDB: function() {
        // var testQuery = firebase.firestore().collection("users").where('displayName', '==', 'demo')

   

        // testQuery
        // .get()
        // .then(function(querySnapshot) {
        //     querySnapshot.forEach(function(doc) {
        //         console.log(doc.id, " => ", doc.data());
        //         // Build doc ref from doc.id
        //         firebase.firestore().collection("users").doc(doc.id).update({foo: "bar"});
        //     });
        // })



    var today = new Date();
    var nextweek = new Date(today.getFullYear(), today.getMonth(), today.getDate()+7);

    console.log(today)
    console.log(nextweek)




      }
    }  
  }
</script>
