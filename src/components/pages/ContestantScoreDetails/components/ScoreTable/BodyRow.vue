<template>
  <tr>
    <td class="pl-4">
      <div class="w-16 h-16 my-1 overflow-hidden rounded-full">
        <img :src="headshotUrl" />
      </div>
    </td>

    <td class="text-left">
      {{ name }}
    </td>

    <td class="text-center">
      {{ normalRose }}
    </td>

    <td class="text-center">
      {{ specialRose }}
    </td>

    <td class="text-center">
      {{ groupDate }}
    </td>

    <td class="text-center">
      {{ oneOnOneDate }}
    </td>

    <td class="text-center">
      {{ twoOnOneDate }}
    </td>

    <td class="text-center">
      {{ sentHome }}
    </td>

    <td class="pr-4 text-right">
      {{ totalScore }}
    </td>
  </tr>
</template>

<script lang="ts">
import { defineComponent, toRefs } from "vue";

const ScoreTableRow = defineComponent({
  name: "ScoreTableRow",

  props: {
    seasonWeekContestant: {
      type: Object,
      required: true,
    },

    weekNumber: {
      type: Number,
      required: true,
    },
  },

  setup(props) {
    const { seasonWeekContestant, weekNumber } = toRefs(props);

    const {
      contestant,
      rose,
      specialRose,
      groupDate,
      oneOnOneDate,
      twoOnOneDate,
      sentHome,
      score,
    } = seasonWeekContestant.value;

    return {
      headshotUrl: contestant.headshotUrl,
      name: contestant.name,
      normalRose: rose ? `+${weekNumber.value}` : "-",
      specialRose: specialRose ? "+5" : "-",
      groupDate: groupDate ? "+5" : "-",
      oneOnOneDate: oneOnOneDate ? "+10" : "-",
      twoOnOneDate: twoOnOneDate ? "-5" : "-",
      sentHome: sentHome ? "-10" : "-",
      totalScore: score ?? "-",
    };
  },
});

export default ScoreTableRow;
</script>
