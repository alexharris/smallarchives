<template>
    <div :class="'bg-' + color + '-' + strength" class="p-4 my-4 shadow">
        <slot></slot>
    </div>
</template>

<script>
import firebase from 'firebase/app';

export default {
    name: "AlertBox", 
    props: ['color', 'strength']

};
</script>