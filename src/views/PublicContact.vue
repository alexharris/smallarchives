<template>
  <div class="login">  
    <h1 class="h3">Contact Us</h1>
    <ul>
      <li><strong>Email:</strong> smallarchives at gmail dot com</li> 
      <li><strong>Twitter:</strong> @smallarchives</li>
      <li><strong>Instagram:</strong> @smallarchives</li>
    </ul>
  </div>
</template>

<script>
  import firebase from 'firebase';
  export default {
    name: 'PublicContact',
    data() {
      return {
        email: '',
        password: ''
      }
    },
    methods: {
      submit: function(e) {
      e.preventDefault();
      window.open('mailto:test@example.com');
      }
    }
  }
</script>
