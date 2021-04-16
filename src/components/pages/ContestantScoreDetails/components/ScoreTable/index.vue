<template>
  <table>
    <thead>
      <HeaderRow />
    </thead>

    <tbody>
      <BodyRow
        v-for="(seasonWeekContestant, index) in seasonWeekContestants"
        :key="seasonWeekContestant.id"
        :class="{ 'bg-gray-dark': index % 2 === 0 }"
        :seasonWeekContestant="seasonWeekContestant"
        :weekNumber="weekNumber"
      />
    </tbody>
  </table>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import BodyRow from "./BodyRow.vue";
  import HeaderRow from "./HeaderRow.vue";

  const ScoreTable = defineComponent({
    props: {
      seasonWeekContestants: {
        type: Array,
        required: false,
        default: () => [],
      },

      weekNumber: {
        type: Number,
        required: false,
        default: () => 0,
      },
    },

    components: {
      BodyRow,
      HeaderRow,
    },
  });

  export default ScoreTable;
</script>
