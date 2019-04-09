<template>
	<div class="switcher-wrapper">
		<div class="switcher">
	      <input type="checkbox" id="switch" :checked="shouldBeChecked" :value="value" @change="updateInput"/><label for="switch">Toggle</label>
	    </div>
		   
    </div> 
</template>

<script>

export default {
	name: "Switcher",
	model: {
		prop: 'modelValue',
		event: 'change'
	},
	props: {
		value: {
		  type: String,
		},
		modelValue: {
		  default: false
		},
		// We set `true-value` and `false-value` to the default true and false so
		// we can always use them instead of checking whether or not they are set.
		// Also can use camelCase here, but hyphen-separating the attribute name
		// when using the component will still work
		trueValue: {
		  default: true
		},
		falseValue: {
		  default: false
		}
	},
	computed: {
		shouldBeChecked() {
		  if (this.modelValue instanceof Array) {
		    return this.modelValue.includes(this.value)
		  }
		  // Note that `true-value` and `false-value` are camelCase in the JS
		  return this.modelValue === this.trueValue
		}
	},
	methods: {
		updateInput(event) {
		  let isChecked = event.target.checked

		  if (this.modelValue instanceof Array) {
		    let newValue = [...this.modelValue]

		    if (isChecked) {
		      newValue.push(this.value)
		    } else {
		      newValue.splice(newValue.indexOf(this.value), 1)
		    }

		    this.$emit('change', newValue)
		  } else {
		    this.$emit('change', isChecked ? this.trueValue : this.falseValue)
		  }
		}
	}
}


</script>


<style lang="scss">

  // $blue: #0011cf;
  // $pink: #fff4e6;
  // $red: #ff0000;

.visual-label {
	display: inline-block;
	float: right;
	padding-top: 12px;
	padding-right: 10px;
}
.switcher {
	float: right;
	width: 60px;
	display: inline-block;
	line-height: 0;
	input[type=checkbox]{
	  height: 0;
	  width: 0;
	  visibility: hidden;
	}

	label {
	  cursor: pointer;
	  text-indent: -9999px;
	  width: 60px;
	  height: 35px;
	  background: grey;
	  display: block;
	  border-radius: 100px;
	  position: relative;
	}

	label:after {
	  content: '';
	  position: absolute;
	  top: 5px;
	  left: 5px;
	  width: 25px;
	  height: 25px;
	  background: white;
	  border-radius: 25px;
	  transition: 0.3s;
	}

	input:checked + label {
	  // background: $blue;
	  background: black;
	}

	input:checked + label:after {
	  left: calc(100% - 5px);
	  transform: translateX(-100%);
	}

	label:active:after {
	  width: 25px;
	}

}
</style>