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
        :updateSeasonWeekContestant="updateSeasonWeekContestant"
      />
    </tbody>
  </table>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import BodyRow from "./BodyRow.vue";
  import HeaderRow from "./HeaderRow.vue";

  const EditableScoreTable = defineComponent({
    props: {
      seasonWeekContestants: {
        type: Array,
        required: false,
        default: () => [],
      },

      updateSeasonWeekContestant: {
        type: Function,
        required: false,
        default: () => {},
      },
    },

    components: {
      BodyRow,
      HeaderRow,
    },
  });

  export default EditableScoreTable;
</script>
