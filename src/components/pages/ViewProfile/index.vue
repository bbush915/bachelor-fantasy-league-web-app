<template>
  <div v-if="user" class="relative px-8 pt-4 pb-16 mt-8 ml-40 rounded-3xl bg-gray-dark">
    <h2 class="mb-4">Details</h2>

    <div class="absolute top-6 right-6">
      <router-link class="flex items-center" :to="{ name: 'edit-profile' }">
        <span class="mr-3 text-xs">Edit Details</span>
        <EditIcon />
      </router-link>
    </div>

    <div class="flex items-center">
      <div class="w-48 h-48 mr-20 overflow-hidden rounded-full">
        <img :src="user.avatarUrl" />
      </div>

      <div class="flex flex-col">
        <label class="mb-1">Display name</label>
        <span class="mb-4 txt-body">{{ user.displayName }}</span>

        <label class="mb-1">Email</label>
        <span class="mb-4 txt-body">{{ user.email }}</span>

        <button class="btn-primary" @click="logout">Logout</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent } from "vue";
import { useRouter } from "vue-router";

import EditIcon from "@/assets/edit.svg";
import { useStore } from "vuex";

const ViewProfile = defineComponent({
  name: "ViewProfile",

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

    function logout() {
      store.commit("logout");
      router.push("/");
    }

    return {
      user,
      logout,
    };
  },
});

export default ViewProfile;
</script>
