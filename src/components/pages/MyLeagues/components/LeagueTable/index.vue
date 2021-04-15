<template>
  <table>
    <thead>
      <HeaderRow />
    </thead>

    <tbody>
      <BodyRow v-for="league in leagues" :key="league.id" :league="league" :isLocked="isLocked" />
    </tbody>
  </table>
</template>

<script lang="ts">
  import { computed, defineComponent, toRefs } from "vue";

  import BodyRow from "./BodyRow.vue";
  import HeaderRow from "./HeaderRow.vue";

  const LeagueTable = defineComponent({
    name: "LeagueTable",

    components: {
      BodyRow,
      HeaderRow,
    },

    props: {
      leagues: {
        type: Array,
        required: true,
      },

      isLocked: {
        type: Boolean,
        required: true,
      },
    },

    setup(props) {
      const { leagues } = toRefs(props);

      const filteredLeagues = computed(() =>
        leagues.value.filter((x: any) => x.myLeagueMember.isActive)
      );

      return {
        leagues: filteredLeagues,
      };
    },
  });

  export default LeagueTable;
</script>
