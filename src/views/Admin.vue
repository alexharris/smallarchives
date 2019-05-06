<template>
  <div class="row"> 
<!--     <div class="col-12 col-md-2">
      <div class="row">   
        <div class="col-12 ">     
          <ul class="nav flex-column admin-sidebar p-4">
            <li class="nav-item" v-if="!isDashboard"><a class="nav-link" v-bind:class="{ active: this.$route.name == 'AdminListArchives' }" href="/admin/archives">Dashboard</a></li>
            
          </ul>
        </div>
      </div>
    </div> -->
    <div class="col-12">
      <router-view/>
    </div>

  </div>
</template>

<script>
import firebase from 'firebase/app' 

export default {
  name: "Admin",
  created: function() {
  },
  methods: {
   setUser: function() {
      this.$store.dispatch('setUser');
    },    
  },
  computed: {
    user() {
    	return this.$store.getters.getUser;
    },
    displayName: function() {
		  return this.$store.getters.getUser.email;
    },
    isDashboard: function() {
      if(this.$route.name === 'AdminListArchives') {
        return true
      } else {
        return false
      }
    }
  },  
  beforeCreate: function() {
    // document.body.className = 'admin h-100';
  }
}

</script>

<style lang="scss" scoped>

  $blue: #0011cf;
  $pink: #fff4e6;
  $red: #824c71;

 .admin-sidebar {
  // border: 1px solid $blue;
  border-radius: 3px;
  // margin-left: 5px;
  // margin-right: -5px;
  ul {
    margin-top: 10px;
  }
 }

 .admin-sidebar .active {
  font-weight:800;
 }

 .nav-link {
  border-bottom: 0px;
  padding: 2px 0;
  &:hover {
    border-bottom: 0px;
    padding: 2px 0;
  }
 }
</style>