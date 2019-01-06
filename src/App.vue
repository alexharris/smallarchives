<template>
  <div id="app">
  <b-nav pills>
    <b-nav-item>
        <router-link class="nav-link" active-class="active" to="/home">Home</router-link>
    </b-nav-item>
    <b-nav-item>
        <router-link class="nav-link" active-class="active" to="/profile">Profile</router-link>
    </b-nav-item>
    <b-nav-item>
        <router-link class="nav-link" active-class="active" to="/archives">Archives</router-link>
    </b-nav-item>
  </b-nav>  
    <router-view/>
  </div>
</template>

<style lang="scss">
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  padding: 10px;
}
#nav {
  padding: 30px;
  a {
    font-weight: bold;
    color: #2c3e50;
    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
