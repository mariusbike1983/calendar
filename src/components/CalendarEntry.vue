<script setup>
import { computed } from 'vue';

const props = defineProps({
    rowid:      0,
    text:       "",
    detail:     "",
    position:   {
        top:                -1, 
        left:               -1, 
        botton:             -1, 
        width:              -1,
        intersectsLeft:     false,
        intersectsRight:    false
    },
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
    <div class="entry" 
        :style="computeStyle" 
        :class="{
            'cut-left': props.position.intersectsLeft, 
            'cut-right': props.position.intersectsRight
        }">
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
    &.cut-right {
        border-top-right-radius: 0px;
        border-bottom-right-radius: 0px;
    }
    &.cut-left {
        border-top-left-radius: 0px;
        border-bottom-left-radius: 0px;
    }

    .detail {
        font-size: 11px;
        color: slateblue;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }
    .text {
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
    }

}
</style>