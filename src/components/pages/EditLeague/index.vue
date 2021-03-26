<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">Edit League</h1>

    <div class="flex flex-col px-8 pt-6 pb-8 mx-40 bg-gray-dark rounded-xl">
      <h2 class="mb-4">League Details</h2>
      <form class="flex flex-col" @submit="onSubmit">
        <label class="mb-2">League Name</label>
        <Input id="name" class="w-1/2" type="text" v-model:value="name" :error="errors.name" />

        <label class="mb-2">League Description</label>
        <Input
          id="name"
          class="w-1/2 h-32 resize-none"
          type="textarea"
          v-model:value="description"
          :error="errors.description"
        />
        <label class="mb-2">Upload Logo</label>
        <div class="relative w-48 h-48 mb-4 overflow-hidden rounded-xl bg-gray">
          <input
            class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
            type="file"
            @change="handleLogoChange"
          />
          <img :src="logoUrl" />
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
          <router-link
            class="btn-secondary"
            :to="{ name: 'league-details', params: { leagueId: leagueId } }"
          >
            Cancel
          </router-link>

          <button type="submit" class="self-end btn-primary" @click="onSubmit">Save</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { defineComponent, PropType, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as Yup from "yup";

import { useMutableImage } from "@/composables";
import { useField, useForm } from "vee-validate";
import Input from "@/components/common/Input/index.vue";
import { LeagueContext } from "@/types";

const EditLeague = defineComponent({
  name: "EditLeague",
  components: { Input },
  props: {
    leagueContext: {
      type: Object as PropType<LeagueContext>,
      required: true,
    },
  },
  setup(props) {
    const { leagueContext } = toRefs(props);
    const { leagueId } = leagueContext.value;
    const router = useRouter();
    const store = useStore();

    const { result } = useQuery(
      gql`
        query LeagueDetails($id: ID!) {
          league(id: $id) {
            id
            name
            description
            logoUrl
            isPublic
            isShareable
          }
        }
      `,
      { id: leagueId }
    );

    const league = useResult(result, null, (data) => data.league);

    const { errors, handleSubmit, meta, setFieldError, setFieldValue } = useForm({
      validationSchema: Yup.object({
        logoUrl: Yup.string().nullable(),
        name: Yup.string().required("Please enter a name."),
        description: Yup.string().required("Please enter a description."),
        isPublic: Yup.boolean(),
        isShareable: Yup.boolean(),
      }),
    });

    watch(
      () => league.value,
      () => {
        if (!league.value) {
          return;
        }

        setFieldValue("name", league.value.name);
        setFieldValue("description", league.value.description);
        setFieldValue("isPublic", league.value.isPublic);
        setFieldValue("isShareable", league.value.isShareable);
        setFieldValue("logoUrl", league.value.logoUrl);
        logoUrl.value = league.value.logoUrl;
      }
    );

    const { value: name } = useField("name");
    const { value: description } = useField("description");
    const { value: _logoUrl } = useField("logoUrl");
    const { value: isPublic } = useField("isPublic");
    const { value: isShareable } = useField("isShareable");

    const { source: logoUrl, handleSourceChange: handleLogoChange } = useMutableImage(
      league.value?.logoUrl
    );

    watch(
      () => logoUrl.value,
      () => {
        setFieldValue("logoUrl", logoUrl.value);
      }
    );
    const { mutate: updateLeague } = useMutation(
      gql`
        mutation UpdateLeague($input: UpdateLeagueInput!) {
          updateLeague(input: $input) {
            id
            name
            description
            logoUrl
            isPublic
            isShareable
          }
        }
      `
    );

    const onSubmit = handleSubmit(async (values) => {
      const { data, errors } = await updateLeague(
        {
          input: {
            id: league.value.id,
            name: name.value,
            description: description.value,
            logo: logoUrl.value,
            isPublic: isPublic.value,
            isShareable: isShareable.value,
          },
        },
        { errorPolicy: "all" }
      );

      if (data) {
        router.push({ name: "league-home", params: { leagueId: league.value.id } });

        store.dispatch("pushNotification", {
          type: "success",
          message: "League updated successfully!",
        });
      } else {
        if (errors?.some((x) => x.extensions?.code === "LEAGUE_ALREADY_EXISTS")) {
          setFieldError("name", "A league with that name already exists.");
        }
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to update league.",
        });
      }
    });
    return {
      league,
      leagueId,
      name,
      description,
      logoUrl,
      isPublic,
      isShareable,
      handleLogoChange,
      onSubmit,
      errors,
    };
  },
});

export default EditLeague;
</script>
