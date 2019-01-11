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
}

</script>
