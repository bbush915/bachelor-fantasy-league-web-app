<template>
  <section class="flex flex-col px-8 pb-8 bg-gray-dark rounded-xl">
    <div class="flex justify-between mt-6 mb-4">
      <h2>League Members ({{ leagueMembers.length }})</h2>

      <router-link
        v-if="canEdit"
        class="flex items-center"
        :to="{
          name: 'edit-league-members',
        }"
      >
        <span class="mr-2 txt-label">Edit League Members</span>

        <div class="w-5 h-5 mb-0.5">
          <EditIcon />
        </div>
      </router-link>
    </div>

    <ScrollContainer class="px-4 bg-gray rounded-xl league-members__list">
      <div
        v-for="leagueMember in leagueMembers"
        :key="leagueMember.id"
        class="flex items-center my-2"
      >
        <Avatar class="w-16 h-16 mr-4" :src="leagueMember.avatarUrl" />
        <span class="txt-body">{{ leagueMember.displayName }}</span>
      </div>
    </ScrollContainer>
  </section>
</template>

<script lang="ts">
  import { defineComponent, PropType } from "vue";

  import EditIcon from "@/assets/edit.svg";
  import Avatar from "@/components/common/Avatar/index.vue";
  import ScrollContainer from "@/components/common/ScrollContainer/index.vue";

  type TLeagueMember = {
    id: string;
    avatarUrl?: string;
    displayName: string;
  };

  const LeagueMembers = defineComponent({
    components: {
      Avatar,
      EditIcon,
      ScrollContainer,
    },

    props: {
      leagueMembers: {
        type: Array as PropType<TLeagueMember[]>,
        required: true,
      },

      canEdit: {
        type: Boolean,
        required: true,
      },
    },
  });

  export default LeagueMembers;
</script>

<style scoped>
  .league-members__list {
    max-height: 75vh;
    overflow-y: auto;
  }
</style>
