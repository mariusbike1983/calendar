<script setup>
import Calendar from './components/Calendar.vue';
import { ref, computed, onMounted } from 'vue';

const xAxisCount = ref(10);
const yAxisCount = ref(10);

const xAxisElements = computed(() => {
    const elems = [];
    for(let i = 1; i <= xAxisCount.value; i++) {
        let elem = {
          text: i,
          styles: []
        }
        if (i % 7 === 0) {
          elem.styles.push('hash');
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
    for(let i = 1; i <= 30; i++) {
        const start = 1 + i;
        const end = start + 3;
        const elem = {
            rowid:  i,
            text:   "Entry text "+i,
            detail: "Entry detail"+i,
            from:   start,
            to:     end
        };
        elems.push(elem);
    }
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
