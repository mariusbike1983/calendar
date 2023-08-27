<script setup>

const props = defineProps({
    title: "",
    text: ""
})

</script>

<template>
    <div class="container">
        <div class="title"> {{ title }}</div>
        <div class="text"> {{ text }}</div>
    </div>

</template>

<style scoped lang="less">
.container {
    display: flex;
    flex-direction: column;
    padding-top: 5px;
    padding-bottom: 5px;

    .title {
        font-size: 13px;
    }

    .text {
        font-size: 11px;
        color: slategray;
    }
    
}
</style>