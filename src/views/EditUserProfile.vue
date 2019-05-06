<template>

  <div>
    {{displayName}}
    <b-form @submit="onSubmit" @reset="onReset"> 
      <b-form-group id="exampleInputGroup2"
                    label="Your Username:"
                    label-for="exampleInput2">
        <b-form-input id="exampleInput2"
                      type="text"
                      v-model="form.name"
                      required
                      :state="nameState"
                      placeholder="Enter name"
                      ref="focusThis">
        </b-form-input>
        <b-form-invalid-feedback id="inputLiveFeedback">
          <!-- This will only be shown if the preceeding input has an invalid state -->
          Enter at least 3 letters
        </b-form-invalid-feedback>   
        <b-form-text id="inputLiveHelp">
          <!-- this is a form text block (formerly known as help block) -->
          This is the name by which your archives will be accessed.
        </b-form-text>
      </b-form-group>
      <div class="btn-toolbar">
        <b-button type="submit" variant="primary">Submit</b-button>&nbsp;
        <b-button type="reset" variant="danger">Reset</b-button>
      </div>      
    </b-form>
</div>
</template>



<script>
import firebase from 'firebase/app';

export default {
  data () {
    return {
      form: {
        name: ''
      }
    }
  },  
  computed: {
    displayName: function() {
      return this.$store.getters.getUser.displayName;
    }, 
    nameState () {
      return this.form.name.length > 2 ? true : false
    }    
  },   
  methods: {
    onSubmit (e) {
      e.preventDefault();
      // Add a new document in collection "users"
      firebase.auth().currentUser.updateProfile({
        displayName:  this.form.name,
        // photoURL: "https://example.com/jane-q-user/profile.jpg"
      }).then(() => {
        // Update successful.
        this.$router.push({
          name: 'Profile'
        })         
      }).catch(function(error) {
        // An error happened.
      });    
    },
    onReset (e) {
      e.preventDefault();
      /* Reset our form values */
      this.form.name = '';
      /* Trick to reset/clear native browser form validation state */
      this.show = false;
      this.$nextTick(() => { this.show = true });
    },
    focusMyElement (e) {
      this.$refs.focusThis.focus()
    }    
  }
}
</script>

<!-- b-form-1.vue -->