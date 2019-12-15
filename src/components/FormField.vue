<template>
<div class="pb-4">
    <div class="form-field flex flex-col md:flex-row justify-start items-center">
        <label class="w-full md:w-1/4 pr-4" :for="id">{{label}}</label>
        <textarea v-if="type == 'textarea'"
            class="w-full md:w-3/4 p-2 rounded border border-gray-800" 
            :id="id" 
            :placeholder="placeholder" 
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"            
        >
        </textarea> 
        <input v-else-if="type == 'file'"
            class="w-full md:w-3/4 p-2"        
            :type="type" 
            :id="id" 
            :placeholder="placeholder" 
            v-on:change="fileSelected"
        />          
        <input v-else-if="type == 'checkbox'"
            class="p-4 text-2xl"
            :type="type" 
            :id="id" 
            :placeholder="placeholder" 
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"

        />                       
        <input v-else
            class="w-full md:w-3/4 p-2 rounded border border-gray-800 float-left"        
            :type="type" 
            :id="id" 
            :placeholder="placeholder" 
            v-bind:value="value"
            v-on:input="$emit('input', $event.target.value)"

        />



    </div>
    <small class="text-gray-800">{{helptext}}</small>

</div>
</template>

<script>

export default {
    name: "FormField",
    props: [
        'label',
        'id',
        'type',
        'placeholder',
        'value',
        'helptext'
    ],
    methods: {
        fileSelected(e) {
            console.log(e)
            this.$emit("input", e.target.files[0]);
        }
    }
};
</script>