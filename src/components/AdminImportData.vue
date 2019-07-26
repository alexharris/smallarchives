<!-- DOESNT WORK!!!! -->

<template>
  <div class="">
      <label class="btn btn-primary" >
        Add file <input type="file" @change="fileAdded" accept=".csv" hidden>
      </label>
  </div> 
</template>

<script>

import firebase from 'firebase/app'
import sa from '../sa'

export default {
  name: 'AdminImportData',
  data () {
    return {
      config: {
        delimiter: "  ",	// auto-detect
        newline: "",	// auto-detect
        quoteChar: '"',
        escapeChar: '"',
        header: false,
        transformHeader: undefined,
        dynamicTyping: false,
        preview: 0,
        encoding: "",
        worker: false,
        comments: false,
        step: undefined,
        complete: undefined,
        error: undefined,
        download: false,
        downloadRequestHeaders: undefined,
        skipEmptyLines: false,
        chunk: undefined,
        fastMode: undefined,
        beforeFirstChunk: undefined,
        withCredentials: undefined,
        transform: undefined,
        delimitersToGuess: [',']
      },
      results: ''
    }
  },
  created() {

  },
  methods: {  
    fileAdded(file) {                                                       
        // var reader = new FileReader();

        // reader.readAsText(file.target.files[0]);      
        
        // reader.onload =  (event) => {
          // var csv = event.target.result;
          // console.log(csv)
          // this.results = this.$papa.parse(file.target.files[0], this.config)
          console.log(this.$papa)
          console.log(file.target.files[0])
          console.log(this.$papa.parse(file.target.files[0], this.config))
        // }
    }, 
 
  }
}
</script>

