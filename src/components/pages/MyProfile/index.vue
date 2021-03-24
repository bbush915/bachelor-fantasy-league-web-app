<template>
  <div v-if="profileContext" class="flex flex-col mx-40">
    <h1 class="my-8">My Profile</h1>

    <router-view :profileContext="profileContext" />
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";

import EditIcon from "@/assets/edit.svg";
import Avatar from "@/components/common/Avatar/index.vue";

type TResult = {
  me: {
    id: string;
    email: string;
    displayName: string;
    avatarUrl?: string;
  };
};

const MyProfile = defineComponent({
  name: "MyProfile",

  components: {
    Avatar,
    EditIcon,
  },

  setup() {
    const { result } = useQuery<TResult>(
      gql`
        query Me {
          me {
            id
            email
            displayName
            avatarUrl
          }
        }
      `
    );

    const profileContext = useResult(result, null, (data) => ({
      userId: data.me.id,
      email: data.me.email,
      displayName: data.me.displayName,
      avatarUrl: data.me.avatarUrl,
    }));

    return {
      profileContext,
    };
  },
});

export default MyProfile;
</script>
