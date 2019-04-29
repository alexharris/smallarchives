<template>
    <div v-if="!loading">
        <hr class="my-4" />
        <div class="btn btn-primary mr-2" v-on:click="loading = !loading; $emit('submit')">Submit</div>
        <a class="btn btn-outline-primary" v-on:click="loading = !loading; $emit('cancel')">Cancel</a>
    </div>
    <div v-else>
        <hr class="my-4" />
        <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase';

export default {
  name: "SubmitButton", 
  data() {
      return {
          loading: false
      }
  }
};
</script>