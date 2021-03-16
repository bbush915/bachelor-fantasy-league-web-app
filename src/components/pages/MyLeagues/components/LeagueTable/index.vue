<template>
  <table>
    <thead>
      <HeaderRow />
    </thead>

    <tbody>
      <BodyRow v-for="league in leagues" :key="league.id" :league="league" />
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

import BodyRow from './BodyRow.vue';
import HeaderRow from './HeaderRow.vue';

const LeagueTable = defineComponent({
  name: 'LeagueTable',

  props: {
    leagues: {
      type: Array,
      required: true,
    },
  },

  components: {
    BodyRow,
    HeaderRow,
  },
});

export default LeagueTable;
</script>
