<script setup>
import { computed } from 'vue';

const props = defineProps({
    rowid:      0,
    text:       "",
    detail:     "",
    position:   {},
});

const computeStyle = computed(() => {
    if (props.position.top >= 0 &&
        props.position.left >= 0 &&
        props.position.width >= 0 &&
        props.position.bottom >= 0) {
        return {
            top:    props.position.top+"px",
            left:   props.position.left+"px",
            width:  props.position.width+"px",
            bottom: props.position.bottom+"px",
            display: ''
        }
    }
    return {
        display: 'none'
    }
})
</script>

<template>
    <div class="entry" :style="computeStyle">
        <div class="text">{{ text }}</div>
        <div class="detail">{{ detail }}</div>
    </div>
</template>

<style scoped lang="less">
.entry {
    border: 1px solid red;
    border-left-width: 4px;
    border-radius: 5px;
    background-color: aquamarine;
    color: black;
    display: flex;
    flex-direction: column;
    justify-items: center;
    position: absolute;
    .detail {
        font-size: 11px;
        color: slateblue;
    }
    .text {
        font-size: 13px;
    }

}
</style>