<template>
	<div>
		{{url}}
		{{archive.title}}
    <img id="myimg" />
	</div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "DisplayArchiveItems",  
  data() {
  	return {
  		uid: '',
		key: '',
		archive: {},
		url: ''  		
  	}
  },
  methods: {
  	getFilesFromStorage: function() {
  		var filename = this.archive.file
  		console.log(filename)
  		var folder = this.uid
  		console.log(folder)
      var imagePath = folder + '/' + '46058814_2182707708620896_8672212500384517648_n.jpg'
      console.log(imagePath)

      // Get a reference to the storage service, which is used to create references in your storage bucket
      var storage = firebase.storage();

      // Create a storage reference from our storage service
      var storageRef = storage.ref();      

      var spaceRef = storageRef.child(imagePath);

      console.log(spaceRef.fullPath)
      // /////////////////

      spaceRef.getDownloadURL().then(function(url) {
        // `url` is the download URL for 'images/stars.jpg'

        // // This can be downloaded directly:
        // var xhr = new XMLHttpRequest();
        // xhr.responseType = 'blob';
        // xhr.onload = function(event) {
        //   var blob = xhr.response;
        // };
        // xhr.open('GET', url);
        // xhr.send();
        console.log(url)
        // Or inserted into an <img> element:
        var img = document.getElementById('myimg');
        console.log(img)
        img.src = url;
        console.log(img.src)
      }).catch(function(error) {
        console.log('hello')
        console.log(error)
        // Handle any errors
      });    

  	},
    getArchiveDetails: function() {

      const ref = firebase.firestore().collection('archives').doc(this.uid).collection('userarchives').doc(this.$route.params.id);


      ref.get().then((doc) => {
        if (doc.exists) {

        	

          this.key = doc.id;
          this.archive = doc.data();


          this.getFilesFromStorage();
        } else {
          alert("No such document!");
        }
      });
    },  	
  },

  created() {
    var currentUser = firebase.auth().currentUser;
    this.uid = currentUser.uid;
    this.getArchiveDetails();
  },  
};
</script>