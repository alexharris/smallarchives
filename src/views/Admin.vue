<template>
  <div id="admin">
  <div>
    <!-- As a link -->
    <b-navbar variant="dark" type="dark">
      <b-navbar-brand href="#">Memory Palace</b-navbar-brand>
      <LogoutButton />
    </b-navbar>
  </div>    
  <UserNav />   
    <router-view/>
  </div>
</template>

<script>
import UserNav from '../components/UserNav'
import LogoutButton from '../components/LogoutButton'

export default {
  name: "Admin",
  components: {
    UserNav,
    LogoutButton
  }
}

</script>

