<template>
  <div class="flex flex-col py-10 mx-40">
    <h1>My Profile</h1>
    <router-view />
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import EditIcon from "@/assets/edit.svg";
import { useStore } from "vuex";

const Profile = defineComponent({
  name: "Profile",

  components: {
    EditIcon,
  },

  setup() {
    const router = useRouter();
    const store = useStore();

    const { result } = useQuery(
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

    const user = useResult(result, null, (data) => data.me);

    return {
      user,
    };
  },
});

export default Profile;
</script>
