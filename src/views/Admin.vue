<template>
  <div id="admin"> 
    <router-view/>
  </div>
</template>

<script>
import UserNav from '../components/UserNav'


export default {
  name: "Admin",
  components: {
    UserNav
  }, 
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
