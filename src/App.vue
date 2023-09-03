<script setup>
import Calendar from './components/Calendar.vue';
import { ref, computed } from 'vue';
import { createEntry } from './services/CalendarEntryService';

const xAxisCount = ref(31);
const yAxisCount = ref(10);

const xAxisElements = computed(() => {
    const elems = [];
    let isWeekend = false;
    for(let i = 1; i <= xAxisCount.value; i++) {
        let elem = {
          text: i,
          styles: []
        }
        if (i % 7 === 0) {
          elem.styles.push('hash');
          isWeekend = true;
        } else if (isWeekend) {
          elem.styles.push('hash');
          isWeekend = false;
        }
        if (i === 5) {
          elem.styles.push('highlighted');
        }
        elems.push(elem);
    }
    return elems;
});

const yAxisElements = computed(() => {
    const elems = [];
    for(let i = 1; i <= yAxisCount.value; i++) {
        elems.push({
            title:  "Title"+i,
            text:   "Text"+i,
            rowid:  i
        });
    }
    return elems;
});


const entries = computed(() => {
    const elems = [];
    elems.push(createEntry("e1", 8, 16, 4,  "entry1"));
    elems.push(createEntry("e2", 3, 10, 4,  "entry2"));
    elems.push(createEntry("e3", 13, 20, 4, "entry3"));
    //elems.push(createEntry("e4", 1, 19, 4,  "entry4"));
    return elems;
});

</script>

<template>
  <div class="wrapper">
    <Calendar
      :xaxis    = "xAxisElements"
      :yaxis    = "yAxisElements"
      :entries  = "entries"
    />
  </div>
</template>

<style scoped lang="less">
  .wrapper {
      padding: 20px;
      width: 900px;
      height: 600px;
      background-color: white;
  }

</style>
