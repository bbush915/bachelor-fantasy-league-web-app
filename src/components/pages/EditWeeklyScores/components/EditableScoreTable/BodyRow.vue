<template>
  <tr>
    <td class="pl-4">
      <Avatar class="w-16 h-16 my-1" :src="headshotUrl" />
    </td>

    <td class="text-left">
      {{ name }}
    </td>

    <td>
      <div class="flex justify-center center">
        <Checkbox
          :checked="normalRose"
          @update:checked="(value: boolean) => updateSeasonWeekContestant(id, 'rose', value)"
        />
      </div>
    </td>

    <td>
      <div class="flex justify-center center">
        <Checkbox
          :checked="specialRose"
          @update:checked="(value: boolean) => updateSeasonWeekContestant(id, 'specialRose', value)"
        />
      </div>
    </td>

    <td>
      <div class="flex justify-center center">
        <Checkbox
          :checked="groupDate"
          @update:checked="(value: boolean) => updateSeasonWeekContestant(id, 'groupDate', value)"
        />
      </div>
    </td>

    <td>
      <div class="flex justify-center center">
        <Checkbox
          :checked="oneOnOneDate"
          @update:checked="(value: boolean) => updateSeasonWeekContestant(id, 'oneOnOneDate', value)"
        />
      </div>
    </td>

    <td>
      <div class="flex justify-center center">
        <Checkbox
          :checked="twoOnOneDate"
          @update:checked="(value: boolean) => updateSeasonWeekContestant(id, 'twoOnOneDate', value)"
        />
      </div>
    </td>

    <td>
      <div class="flex justify-center center">
        <Checkbox
          :checked="sentHome"
          @update:checked="(value: boolean) => updateSeasonWeekContestant(id, 'sentHome', value)"
        />
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
  import { defineComponent, toRefs } from "vue";

  import Avatar from "@/components/common/Avatar/index.vue";
  import Checkbox from "@/components/common/Checkbox/index.vue";

  const BodyRow = defineComponent({
    components: {
      Avatar,
      Checkbox,
    },

    props: {
      seasonWeekContestant: {
        type: Object,
        required: true,
      },

      updateSeasonWeekContestant: {
        type: Function,
        required: true,
      },
    },

    setup(props) {
      const { seasonWeekContestant } = toRefs(props);

      const { id, contestant, rose, specialRose, groupDate, oneOnOneDate, twoOnOneDate, sentHome } =
        toRefs(seasonWeekContestant.value);

      return {
        id,
        headshotUrl: contestant.value.headshotUrl,
        name: contestant.value.name,
        normalRose: rose,
        specialRose,
        groupDate,
        oneOnOneDate,
        twoOnOneDate,
        sentHome,
      };
    },
  });

  export default BodyRow;
</script>
