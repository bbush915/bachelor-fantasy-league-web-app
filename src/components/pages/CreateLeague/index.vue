<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">Create a League</h1>

    <div class="flex flex-col px-8 pt-6 pb-8 mx-40 bg-gray-dark rounded-xl">
      <h2 class="mb-4">League Details</h2>

      <label class="mb-2">League Name</label>
      <input class="w-1/2 mb-4 input" type="text" v-model="name" />

      <label class="mb-2">League Description</label>
      <textarea class="w-1/2 h-32 mb-4 resize-none input" v-model="description" />

      <label class="mb-2">Upload Logo</label>
      <div class="relative w-48 h-48 mb-4 overflow-hidden rounded-xl bg-gray">
        <input
          class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
          type="file"
          @change="handleLogoChange"
        />
        <img :src="logo" />
      </div>

      <div class="flex items-center mb-2">
        <input id="is-public" type="checkbox" v-model="isPublic" />
        <label class="ml-2 txt-body" for="is-public"> Anyone can join</label>
      </div>

      <div class="flex items-center mb-8">
        <input id="is-shareable" type="checkbox" v-model="isShareable" />
        <label class="ml-2 txt-body" for="is-shareable"> Members can invite new members </label>
      </div>

      <div class="flex self-end space-x-4">
        <router-link class="btn-secondary" :to="{ name: 'my-leagues' }"> Cancel </router-link>

        <button class="self-end btn-primary" :disabled="!canCreate" @click="handleCreateClick">
          Save
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { computed, defineComponent, ref } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";

  import { useMutableImage } from "@/composables";

  const CreateLeague = defineComponent({
    name: "CreateLeague",

    setup() {
      const router = useRouter();
      const store = useStore();

      const { source: logo, handleSourceChange: handleLogoChange } = useMutableImage();

      const { mutate: createLeague } = useMutation(
        gql`
          mutation CreateLeague($input: CreateLeagueInput!) {
            createLeague(input: $input) {
              id
            }
          }
        `
      );

      const name = ref<string>();
      const description = ref<string>();

      const isPublic = ref(false);
      const isShareable = ref(false);

      const canCreate = computed(() => name.value && description.value && logo.value);

      async function handleCreateClick() {
        const { data } = await createLeague({
          input: {
            name: name.value,
            description: description.value,
            logo: logo.value,
            isPublic: isPublic.value,
            isShareable: isShareable.value,
          },
        });

        if (data) {
          router.push({
            name: "league-home",
            params: { leagueId: data.createLeague.id },
          });

          store.dispatch("pushNotification", {
            type: "success",
            message: "League created successfully!",
          });
        } else {
          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to create league. Try again later",
          });
        }
      }

      return {
        name,
        description,
        logo,
        isPublic,
        isShareable,
        handleLogoChange,
        canCreate,
        handleCreateClick,
      };
    },
  });

  export default CreateLeague;
</script>
