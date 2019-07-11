<template>
    <div class="btn btn-info btn-sm mr-2" @click.stop="addItem()" v-if="confirmOwner">
        <font-awesome-icon class="mr-2" icon="plus" size="1x" />Add Item
    </div>
</template>


<script>
    import firebase from 'firebase/app'
    import sa from '../sa'

    export default {
        name: "AdminAddItemButton", 
        data () {
            return {
                confirmOwner: false,
                archiveId: this.$route.params.archive_id
            }
        },
        created() {
            this.getConfirmOwner();
        },
        methods: {
            addItem: function() {
                this.$router.push({
                    name: 'AdminCreateItem',
                    params: { id: this.archiveId }
                })            
            },
            async getConfirmOwner() {
                this.confirmOwner = await sa.confirmOwner(this.$route.params.archive_id)
            },           
        }
    };
</script>