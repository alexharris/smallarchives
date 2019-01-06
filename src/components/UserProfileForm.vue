<template>
  <div>
    <b-form @submit="onSubmit" @reset="onReset" v-if="show">  
      <b-form-group id="exampleInputGroup2">

        <b-form-input id="exampleInput2"
                      type="text"
                      v-model="form.name"
                      size="sm"
                      required
                      placeholder="Enter name">
        </b-form-input>
      </b-form-group>
      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
    </b-form>
    {{uid}}
  </div>
</template>



<script>
import firebase from 'firebase';

export default {
  data () {
    return {
      form: {
        name: ''
      },
      uid: '123',
      user: {},
      show: true
    }
  },
  created () {

    var user = firebase.auth().currentUser;
    var email;

    if (user != null) {
      this.email = user.email;
      this.uid = user.uid;
    }

  
  },    
  methods: {
    onSubmit (evt) {
      evt.preventDefault();
      // Add a new document in collection "users"
      firebase.firestore().collection("users").doc(this.uid).set({
          displayName: this.form.name
      })
      .then(function() {
          console.log("Document successfully written!");
      })
      .catch(function(error) {
          console.error("Error writing document: ", error);
      });      
    },
    onReset (evt) {
      evt.preventDefault();
      /* Reset our form values */
      this.form.name = '';
      this.form.food = null;
      this.form.checked = [];
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => { this.show = true });
    }
  }
}
</script>

<!-- b-form-1.vue -->