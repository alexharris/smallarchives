<template>
    <div v-if="formIsLoading == false">
        <hr class="my-4" />
        <div class="btn btn-primary mr-2" v-on:click="$emit('submit')">Submit</div>
        <a class="btn btn-outline-primary" v-on:click="$emit('cancel')">Cancel</a>
    </div>
    <div v-else>
        <hr class="my-4" />
        <div class="spinner-border" role="status">
        <span class="sr-only">Loading...</span>
        </div>
    </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
    name: "SubmitButton", 
    // data () {
    //     return {
    //         newLoading: false
    //     }
    // },
    props: ['formErrors', 'formIsLoading'],
    // computed: {
    //     isLoading: {
    //         get: function() {
    //             return this.loading
    //         },
    //         set: function(newValue) {
    //             this.newLoading = true
    //         }
    //     }
    // }
    // computed: {
    //     hasErrors: function() {
    //         console.log(this)
    //         return this
    //     }
    // }
};
</script>