<script setup>
import { computed, nextTick, onMounted, ref, watch } from 'vue';
import InfoElement from './InfoElement.vue';
import CalendarEntry from './CalendarEntry.vue';
import { handleNewSegment } from '../services/CalendarService';
import HolidayEntry from './HolidayEntry.vue';

const props = defineProps({
    xaxis:      [],
    yaxis:      [],
    entries:    []
});

const yaxiscontent = ref(null);
const xaxiscontent = ref(null);
const yaxisrows = ref([]);
const contentrows = ref([]);
const xaxiscells = ref([]);
const viewport = ref(null);
const hasVerticalScroll = ref(false);
const hasHorizontalScroll = ref(false);
const selectedCalEntry = ref("");
const rowEntries = ref(new Map());
const entriesById = new Map();

async function contentscroll(e) {
    await nextTick(() => {
        yaxiscontent.value.scrollTop = e.target.scrollTop;
        xaxiscontent.value.scrollLeft = e.target.scrollLeft;
    });
}

onMounted(() => {
    nextTick(() => {
        synchUi();
        distributeEntries();
        intersectEntries(props.xaxis.length);
    });
});

watch(props, () => {
    nextTick(() => synchUi());
}, {
    immediate: true
});

const selectEntry = urid => { selectedCalEntry.value = urid; }
const isCalEntrySelected = urid => selectedCalEntry.value === urid;
const entriesForRow = rowid => rowEntries.value.get(rowid);
const coverEntries = () => props.entries.filter(entry => entry.rowid === null);
const isCalendarEmpty = computed(() => props.entries? props.entries.length === 0: true);

/**
 * Distribute entries by row
 */
function distributeEntries() {
    if (props.entries) {
        props.entries.forEach(entry => {
            entriesById.set(entry.urid, entry);
            let rowdata = []; 
            if (rowEntries.value.has(entry.rowid)) {
                rowdata = rowEntries.value.get(entry.rowid);
            } else {
                rowEntries.value.set(entry.rowid, rowdata);
            }
            rowdata.push(entry);
        });
    }
}

function intersectEntries(rowsize) {
    const rowTemplate = Array(rowsize).fill("-1");
    for (let rowdata of rowEntries.value.values()){
        if (rowdata.length <= 1) {
            // row contains at most one entry, doesn't make sense to search for segments
            continue;
        }
        // row contains at least two entries that might overlap
        // construct the template overlapping structure (one pass for all possible segments)
        rowdata.forEach(entry => {
            rowTemplate.fill(entry.urid, entry.from-1, entry.to);
        });
        // compute segments and constucts temporary entries
        let pId = "", newStart = -1;
        const segments = new Map();
        rowTemplate.forEach((cell, index) => {
            if (cell !== "-1") {
                // as soon as we find an occupied cell and the start of a new segment has not been marked
                if (newStart === -1) {
                    // mark it
                    pId = cell;
                    newStart = index + 1;
                }
            }
            if (cell === "-1" || cell !== pId) {
                // the segment has ended (either by finding an unoccupied cell or by the start of a new segment)
                if (newStart !== -1) { // theoretically could not happen... but still
                    const tEntry = entriesById.get(pId);
                    handleNewSegment(tEntry, segments, newStart, index);
                    if (cell !== "-1") {
                        // a new segment already starts here
                        newStart = index+1;
                        pId = cell;
                    } else {
                        // reset the segment, waiting for a new one
                        newStart = -1;
                        pId = "";
                    }
                }
            }
        });
        // potentially, a segment ended at the edge of the row
        if (pId !== "" && newStart !== -1) {
            const tEntry = entriesById.get(pId);
            handleNewSegment(tEntry, segments, newStart, tEntry.to);
        }

        // replace row data entries with their segments
        for(let segmentKey of segments.keys()) {
            const tEntry = entriesById.get(segmentKey);
            const segmentdata = segments.get(segmentKey);
            if (segmentdata.length === 1 && 
                segmentdata[0].from === tEntry.from && segmentdata[0].to === tEntry.to) {
                    // this segment is the same size as the initial entry. doesn't make sense to 
                    // replace the entry with the segment
                continue;
            }
            const ndx = rowdata.indexOf(tEntry);
            rowdata.splice(ndx, 1, ...segmentdata);
        }

        if (rowdata.length > 1) {
            rowdata.forEach(entry => {
                rowdata.forEach(nextEntry => {
                    if (entry.from === nextEntry.to + 1) {
                        entry.intersectsLeft = true;
                        nextEntry.intersectsRight = true;
                    }
                    if (entry.to === nextEntry.from - 1) {
                        entry.intersectsRight = true;
                        nextEntry.intersectsLeft = true;
                    }
                });
            });
        }
        // reset template
        rowTemplate.fill("-1", 0, rowTemplate.length);
    }
}

function synchUi() {
    if (viewport.value) {
        hasHorizontalScroll.value = viewport.value.scrollWidth > viewport.value.clientWidth;
        hasVerticalScroll.value = viewport.value.scrollHeight > viewport.value.clientHeight;
        yaxisrows.value.forEach((yaxisrow, index) => {
            contentrows.value[index].style.height = yaxisrow.getBoundingClientRect().height+"px";
        });
    }
}

const xaxiselemclass = elem => {
    return {
        'hash': elem.styles.indexOf("hash") !== -1,
        'highlighted': elem.styles.indexOf("highlighted") !== -1
    };
};

function computeEntryPosition(entry) {
    const position = { top: -1, bottom: -1, left: -1, width: -1};
    const start = entry.from;
    const end = entry.to;
    if (viewport.value && xaxiscells.value[start-1] && xaxiscells.value[end-1]) {
        if (entry.rowid) {
            position.top = 5;
            position.bottom = 5;
        } else {
            position.top = 0;
            position.bottom = 0;
        }
        const unitWidth = xaxiscells.value[start-1].getBoundingClientRect().width;
        position.left = (start - 1) * unitWidth;
        position.width = (end - start + 1) * unitWidth;
    }
    return position;
}

</script>

<template>
    <div 
        class="calendar-wrapper"
        :id="'calendar123'"
    >
        <div v-if="!isCalendarEmpty" class="calendar">
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
                <div class="yaxis" 
                    @scroll="contentscroll"
                    ref="yaxiscontent" 
                    :class="{'space': hasHorizontalScroll}">
                    <div class="content">
                        <div v-for="(yelem, index) in yaxis" 
                            class="element" 
                            :key="index" 
                            ref="yaxisrows">
                            <InfoElement
                                :title = "yelem.title"
                                :text = "yelem.text"
                            />
                        </div>
                    </div>
                </div>
                <div class="viewport" 
                    @scroll="contentscroll" 
                    ref="viewport">
                    <div class="content">
                        <div v-for="(yelem, index) in yaxis" 
                            class="row" 
                            :key="index" 
                            ref="contentrows">
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
                                :intersectsLeft="entry.intersectsLeft"
                                :intersectsRight="entry.intersectsRight"
                                :background-color="entry.backgroundcolor"
                                :accent="entry.accent"
                                :selected="isCalEntrySelected(entry.urid)"
                                @click="selectEntry(entry.urid)"
                            />
                        </div>
                        <HolidayEntry v-for="(entry, eindex) in coverEntries()"
                            :key="eindex"
                            :position="computeEntryPosition(entry)"
                            :background-color="entry.backgroundcolor"
                        />
                    </div>
                </div>
            </div>
        </div>
        <div v-else>
            {{ 'NO CONTENT' }}
        </div>
    </div>
</template>

<style scoped lang="less">
.calendar-wrapper {  
    width: 100%;
    height: 100%;
}

.calendar {
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
            border-right: 1px solid black;
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
                position: relative;

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
                position: relative;
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