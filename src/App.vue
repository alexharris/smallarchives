<template>
  <div id="app">    
    <router-view/>
  </div>
</template>

<script>
import UserNav from './components/UserNav'

export default {
  name: "App",
  components: {
    UserNav
  }
}

</script>
