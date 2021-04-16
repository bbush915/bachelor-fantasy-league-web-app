<template>
  <tr class="h-20">
    <td>
      <div class="overflow-hidden w-14 h-14 rounded-xl">
        <img :src="logoUrl" />
      </div>
    </td>

    <td>
      <span class="pl-4">
        {{ name }}
      </span>
    </td>

    <td class="text-center">{{ ordinal }}</td>

    <td>
      <div class="flex justify-center">
        <div class="w-6 h-6">
          <OkIcon v-if="isLineupSet" />
          <ActionRequiredIcon v-else />
        </div>
      </div>
    </td>

    <td>
      <div class="flex justify-center">
        <div v-if="isLocked" class="w-6 h-6">
          <LockIcon />
        </div>

        <router-link v-else :to="`/leagues/${id}/set-lineup`">
          <div class="w-6 h-6">
            <EditIcon />
          </div>
        </router-link>
      </div>
    </td>

    <td>
      <div class="flex justify-center">
        <router-link class="btn-secondary" :to="`/leagues/${id}`">League Home</router-link>
      </div>
    </td>
  </tr>
</template>

<script lang="ts">
  import { defineComponent, toRefs } from "vue";

  import ActionRequiredIcon from "@/assets/action-required.svg";
  import EditIcon from "@/assets/edit.svg";
  import LockIcon from "@/assets/lock.svg";
  import OkIcon from "@/assets/ok.svg";
  import { getOrdinal } from "@/utils";

  const BodyRow = defineComponent({
    components: {
      ActionRequiredIcon,
      EditIcon,
      LockIcon,
      OkIcon,
    },

    props: {
      league: {
        type: Object,
        required: true,
      },

      isLocked: {
        type: Boolean,
        required: true,
      },
    },

    setup(props) {
      const { league } = toRefs(props);

      const { id, name, logoUrl, myLeagueMember } = league.value;
      const { isLineupSet, leagueMemberScore } = myLeagueMember;
      const { cumulativeRank } = leagueMemberScore;

      return {
        id,
        name,
        logoUrl,
        ordinal: cumulativeRank ? getOrdinal(cumulativeRank) : "-",
        isLineupSet,
      };
    },
  });

  export default BodyRow;
</script>
