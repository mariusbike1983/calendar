<script setup>
import { computed } from 'vue';

const props = defineProps({
    rowid:      0,
    position:   {
        top:    -1, 
        left:   -1, 
        botton: -1, 
        width:  -1,
    },
    backgroundColor: ""
});

const computeStyle = computed(() => {
    if (props.position.top >= 0 &&
        props.position.left >= 0 &&
        props.position.width >= 0 &&
        props.position.bottom >= 0) {
        return {
            top:                props.position.top+"px",
            left:               props.position.left+"px",
            width:              props.position.width+"px",
            bottom:             props.position.bottom+"px",
            backgroundColor:    props.backgroundColor,
            display:            ''
        }
    }
    return {
        display: 'none'
    }
});

</script>

<template>
    <div class="entry cover" 
        :style="computeStyle">
    </div>
</template>

<style scoped lang="less">
.entry {
    position: absolute;
}
</style>