<template>
  <div id="admin"> 
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
}

</script>
