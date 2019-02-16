<template>
  <div> 
    <router-view/>
  </div>
</template>

<script>

export default {
  name: "Admin",
  computed: {
    user() {
    	return this.$store.getters.getUser;
    },
    displayName: function() {
		  return this.$store.getters.getUser.email;
    }
  },  
  beforeCreate: function() {
    document.body.className = 'admin';
  }
}

</script>

