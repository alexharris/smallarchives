<template>
    <div>
        <div v-if="fileMetadata.includes('image')">
            <img :src="url" />
        </div>
        <div v-if="fileMetadata.includes('audio')">
            <figure>
                <audio controls :src="url">
                    Your browser does not support the <code>audio</code> element.
                </audio>
            </figure>
        </div>
        <div v-if="fileMetadata.includes('pdf')">
            <embed :src="url" type="application/pdf" width="100%" height="600px">
        </div> 
        <div v-if="fileMetadata.includes('video')">    
            <video controls="controls" width="100%" :src="url"></video>
        </div>
        <hr />
    </div>
</template>

<script>
import firebase from 'firebase/app';
import sa from '../sa'
import mime from "mime-types";

export default {
    name: "PublicMediaFile", 
    props: ['filename', 'id', 'uid'],
    computed: {
        fileMetadata: function() {
            return mime.lookup(this.filename)
        }
    },
    created() {
        this.getFileUrls()
    },
    data() {
        return {
            url: ''
        }
    },
    methods: {
		getFileUrls: function() {
            var uid = this.uid
            var archiveId = this.$route.params.archive_id
            var itemId = this.id
            sa.itemStorageRef(uid, archiveId, itemId, this.filename).getDownloadURL().then((url) => {
                this.url = url
            })
        }
    }

};
</script>