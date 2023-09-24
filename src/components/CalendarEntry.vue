<script setup>
import { computed } from 'vue';

const props = defineProps({
    rowid:      0,
    text:       "",
    detail:     "",
    position:   {
        top:    -1, 
        left:   -1, 
        botton: -1, 
        width:  -1,
    },
    intersectsLeft:     false,
    intersectsRight:    false,
    backgroundColor: "",
    accent: "",
    selected: false
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
            display:            '',
            backgroundColor:    props.backgroundColor,
            borderColor:        props.accent
        }
    }
    return {
        display: 'none'
    }
});

const emits = defineEmits(['click']);

</script>

<template>
    <div class="entry" 
        :style="computeStyle" 
        :class="{
            'cut-left': props.intersectsLeft, 
            'cut-right': props.intersectsRight,
            'selected': props.selected
        }"
        @click="emits('click')">
        <div class="text">{{ text }}</div>
        <div class="detail">{{ detail }}</div>
    </div>
</template>

<style scoped lang="less">
.entry {
    border-width: 1px;
    border-style: solid;
    border-left-width: 4px;
    border-radius: 5px;
    padding-left: 6px;
    padding-right: 3px;
    color: black;
    display: flex;
    flex-direction: column;
    justify-items: center;
    position: absolute;

    &.selected {
        border-color: orange !important;
    }

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
        color: slategray;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        justify-self: center;
    }
    .text {
        font-size: 13px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        user-select: none;
        justify-self: center;
    }
}
</style>