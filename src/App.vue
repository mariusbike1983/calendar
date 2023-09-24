<script setup>
import Calendar from './components/Calendar.vue';
import { ref, computed } from 'vue';
import { createEntry, createHoliday } from './services/CalendarEntryService';

const xAxisCount = ref(31);
const yAxisCount = ref(15);

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
    
    elems.push(createEntry("eY", 1,  10, 2, "Sick leave", "", "tomato", "red"));
    elems.push(createEntry("eX", 2,  13, 3, "Work from home", "", "azure", "green"));
    elems.push(createEntry("e1", 2,  13, 4, "Work from home", "", "azure", "green"));
    elems.push(createEntry("e2", 3,  10, 4, "Holiday", "XMas holidays", "lightblue", "red"));
    elems.push(createEntry("e3", 15, 24, 4, "Meeting", "Workshop for COS", "cyan", "blue"));
    elems.push(createEntry("e5", 26, 29, 4, "Workshop", "Workshop for CSS", "magenta", "lightblue"));
    elems.push(createEntry("e4", 17, 19, 4, "Bank", "Bank holiday", "gray", "purple"));

    elems.push(createHoliday("eZ", 19, 19, "HOLIDAY", "slategray"));
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
      background-color: white;
      height: 600px;
      width: 900px;
  }

</style>
