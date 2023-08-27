<script setup>
import { nextTick, onMounted, ref, watch } from 'vue';
import InfoElement from './InfoElement.vue';
import CalendarEntry from './CalendarEntry.vue';

const props = defineProps({
    xaxis:      [],
    yaxis:      [],
    entries:    []
});

const yaxiscontent = ref(null);
const xaxiscontent = ref(null);
const viewport = ref(null);
const hasVerticalScroll = ref(false);
const hasHorizontalScroll = ref(false);
const selectedRowIndex = ref(-1);


async function contentscroll(e) {
    await nextTick(() => {
        yaxiscontent.value.scrollTop = e.target.scrollTop;
        xaxiscontent.value.scrollLeft = e.target.scrollLeft;
    });
}

function selectRow(index) {
    selectedRowIndex.value = index;
}

function isRowSelected(index){
    return selectedRowIndex.value === index
};

onMounted(() => {
    nextTick(() => synchUi());
});

const yaxisrows = ref([]);
const contentrows = ref([]);
const xaxiscells = ref([]);

function synchUi() {
    if (viewport.value) {
        hasHorizontalScroll.value = viewport.value.scrollWidth > viewport.value.clientWidth;
        hasVerticalScroll.value = viewport.value.scrollHeight > viewport.value.clientHeight;
        yaxisrows.value.forEach((yaxisrow, index) => {
            contentrows.value[index].style.height = yaxisrow.getBoundingClientRect().height+"px";
        });
    }
}

watch(props, () => {
    nextTick(() => synchUi());
}, {
    immediate: true
});

function xaxiselemclass(elem) {
    return {        
        'hash': elem.styles.indexOf("hash") !== -1,
        'highlighted': elem.styles.indexOf("highlighted") !== -1
    };
};

function entriesForRow(rowid) {
    const reduced = [];
    props.entries.forEach(entry => {
        if (entry.rowid === rowid) {
            reduced.push(entry);
        }
    })
    return reduced;
}

function computeEntryPosition(entry) {
    if (viewport.value) {
        const start = entry.from;
        const end = entry.to;
        const position = { top: 5, bottom: 5};
        if (xaxiscells.value[start] && xaxiscells.value[end]) {
            const unitWidth = xaxiscells.value[start].getBoundingClientRect().width;
            position.left = (start-1) * unitWidth;
            position.width = (end - start + 1) * unitWidth;
            return position;
        }
    }
    return { top: -1, bottom: -1, left: -1, right: -1}
}

</script>

<template>
    <div class="calendar-wrapper">
        <div class="header" :class="{'space': hasVerticalScroll}">
            <div class="corner"></div>
            <div class="xaxis" ref="xaxiscontent">
                <div v-for="(elem, index) in xaxis" 
                    class="head" 
                    ref="xaxiscells" 
                    :class="xaxiselemclass(elem)"
                    :key="index">
                    <span> {{ elem.text }}</span>
                </div>
            </div>
        </div>
        <div class="footer">
            <div class="yaxis" ref="yaxiscontent" :class="{'space': hasHorizontalScroll}">
                <div class="content">
                    <div v-for="(yelem, index) in yaxis" 
                        class="element" 
                        :key="index" 
                        ref="yaxisrows"
                        @click="selectRow(index)"
                        :class="{'selected': isRowSelected(index)}">
                        <InfoElement
                            :title = "yelem.title"
                            :text = "yelem.text"
                        />
                    </div>
                </div>
            </div>
            <div class="viewport" @scroll="contentscroll" ref="viewport">
                <div class="content">
                    <div v-for="(yelem, index) in yaxis" 
                        class="row" 
                        :key="index" 
                        ref="contentrows"
                        @click="selectRow(index)"
                        :class="{'selected': isRowSelected(index)}">
                        <div v-for="(elem, index2) in xaxis" 
                            class="cell" 
                            :key="index2" 
                            :class="xaxiselemclass(elem)">
                        </div>
                        <CalendarEntry v-for="(entry, eindex) in entriesForRow(yelem.rowid)"
                            :key="eindex"
                            :text="entry.text"
                            :detail="entry.detail"
                            :rowid="yelem.rowid"
                            :position="computeEntryPosition(entry)"
                        />
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="less">
.calendar-wrapper {  
    width: 100%;
    height: 100%;
    .header {
        display: flex;
        &.space{
            padding-right: 17px;
        }
        .corner {
            width: 170px;
            height: 30px;
            background-color: lightgreen;
        }
        .xaxis {
            width: calc(100% - 170px);
            height: 30px;
            overflow: hidden;
            display: flex;
            .head {
                min-width: 30px;
                height: 100%;
                text-align: center;
                color: black;
                border-right: 1px solid black;
                flex-grow: 1;
                position: relative;
                &.hash {
                    background-color: lightgray;
                }

                &.highlighted {
                    position: relative;
                    > span {
                        font-weight: bolder;
                        color: white;
                        position: relative;
                    }
                    &::before {
                        content: "";
                        background-color: magenta;
                        width: 20px;
                        height: 20px;
                        border-radius: 50%;
                        position: absolute;
                        top: 2px;
                        left: calc(50% - 10px);
                    }
                }

                span {
                    min-width: 20px;
                    display: inline-block;
                }
            }
        }
    }

    .footer {
        display: flex;
        flex-direction: row;
        height: calc(100% - 30px);
        
        .yaxis {
            height: 100%;
            width: 170px;
            &.space {
                overflow-x: scroll;
            }
            overflow-y: hidden;

            .content {
                display: flex;
                flex-direction: column;
                
                .element {
                    width: 100%;
                    border-bottom: 1px solid black;
                    border-right: 1px solid black;
                    color: black;
                    padding-top: 5px;
                    padding-bottom: 5px;
                    &.selected {
                        border-top: 1px solid orange;
                        border-bottom: 1px solid orange;
                        margin-top: -1px;
                    }
                }
            }
        }

        .viewport {
            height: 100%;
            width: calc(100% - 170px);
            overflow: auto;

            .content {
                display: flex;
                flex-direction: column;
                .row {
                    display: flex;
                    position: relative;
                    .cell {
                        flex-grow: 1;
                        min-width: 30px;
                        text-align: center;
                        background-color: transparent;
                        color: black;
                        border-right: 1px solid black;
                        border-bottom: 1px solid black;
                        &.hash {
                            background-color: lightgray;
                        }

                        &.highlighted {
                            position: relative;
                            &::after {
                                content: "";
                                height: 100%;
                                border-left: 2px dotted magenta;
                                display: block;
                                left: 50%;
                                position: absolute;
                                bottom: 1px; // fixes a weird overlay when subsequent cells overlap
                                z-index: 1
                            }
                        }
                    }

                    &.selected {
                        .cell {
                            border-top: 1px solid orange;
                            border-bottom: 1px solid orange;
                            margin-top: -1px;
                        } 
                    }
                }
            };
        }
    }
}
</style>