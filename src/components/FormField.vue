<template>
<div class="pb-4">
    <div class="form-field flex flex-col md:flex-row justify-start">
        <div class="w-full md:w-1/4 pr-4">
            <label :for="id">{{label}}</label><br />
            
        </div>
        <div class="w-full md:w-3/4 flex flex-col">
            <textarea v-if="type == 'textarea'"
                class="p-2 rounded border border-gray-800" 
                :id="id" 
                :placeholder="placeholder" 
                v-bind:value="value"
                v-on:input="$emit('input', $event.target.value)"            
            >
            </textarea> 
            <input v-else-if="type == 'file'"
                class="p-2"        
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
                v-on:input="$emit('input', $event.target.checked)"  

            />      
            <template v-else-if="type == 'select'">
                <select 
                    class="p-2 rounded border border-gray-800" 
                    :id="id" 
                    v-bind:value="value"
                    v-on:input="$emit('input', $event.target.value)"  
                >   
                    <template v-for="option in options">
                        <option :value="option">{{option}}</option>
                    </template>          
                </select>
            </template>                       
            <input v-else
                class="p-2 rounded border border-gray-800 float-left"        
                :type="type" 
                :id="id" 
                :placeholder="placeholder" 
                v-bind:value="value"
                v-on:input="$emit('input', $event.target.value)"
                :min="min"
                :max="max"

            /> <br />
            <small class="text-gray-800 pt-2">{{helptext}}</small>
        </div>

    </div>
   

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
        'helptext',
        'min',
        'max',
        'options'
    ],
    methods: {
        fileSelected(e) {
            console.log(e)
            this.$emit("input", e.target.files[0]);
        },
    }
};
</script>