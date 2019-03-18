<template>
  <div class="row justify-content-center">
  <div class="col-12 col-md-8">  
<h1>About Small Archives</h1>

<p class="lead">Small Archives is a platform for publishing collections on the web. The goal of the site is to make it easy to create nice looking, easy to use digital archives that can help individuals and institutions display their collections, whatever they may be, in an organized and thoughtful way.</p>

<h2>History</h2>

<p>I initially created Small Archives out of a desire to display a personal collection of materials obtained while researching a local wildlife refuge in Oakland, Ca (this is now the demo collection). I knew from my time working as a web developer at a museum and archive that most of the tools for this sort of thing were either geared toward large institutional collections, cobbled together from general tools like Wordpress or Drupal, or else people used social tools like Instagram or Tumblr, whose focus on the “timeline” is not conducive to presenting time-insensitive collections.</p>
  <h2>Features</h2>
<ul>
  <li>Modern, mobile-friendly display</li>
  <li>List and grid view</li>
  <li>Multimedia assets include audio, video, images, and PDFs</li>
  <li>Basic filtering</li>
  <li>Easy admin interface</li>
  <li>Metadata hints</li>
</ul>
    <h2>Roadmap</h2>
<p>There is also a roadmap of future features that are either planned or currently under development, including:</p>
<ul>
  <li>Custom metadata fields per archive</li>
  <li>Tagging</li>
  <li>More supported content types</li>
  <li>Bulk import</li>
  <li>Export</li>
  <li>Technology</li>
</ul>
<p>Small Archives is built using the Javascript framework called Vue, and is hosted with Google Firebase. I hope to open source the code for it once it is has been a little more thoroughly tested and is slightly more thoroughly commented.</p>

<h2>Contact</h2>
<p>You can reach me at smallarchives@gmail.com or @smallarchives on twitter.</p>

  </div>
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
