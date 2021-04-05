<template>
  <div class="flex flex-col mx-40">
    <h1 class="my-8">Edit League</h1>

    <div class="flex flex-col px-8 pt-6 pb-8 mx-40 bg-gray-dark rounded-xl">
      <div class="flex justify-between mb-4">
        <h2>League Details</h2>

        <button v-if="isCommissioner" class="flex items-center" @click="showConfirmationModal()">
          <span class="mr-1 text-sm">Delete League</span>

          <div class="w-5 h-5 mb-2">
            <DeleteIcon />
          </div>
        </button>
      </div>
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
    <ConfirmationModal
      v-if="isModalVisible"
      :onClose="hideConfirmationModal"
      :onConfirm="handleDelete"
      :message="'Are you sure you want to permanently delete this league? This cannot be undone.'"
    />
  </div>
</template>

<script lang="ts">
import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { computed, defineComponent, PropType, ref, toRefs, watch } from "vue";
import { useRouter } from "vue-router";
import { useStore } from "vuex";
import * as Yup from "yup";

import ScrollContainer from "@/components/common/ScrollContainer/index.vue";
import Avatar from "@/components/common/Avatar/index.vue";
import { useConfirmationModal, useMutableImage } from "@/composables";
import { useField, useForm } from "vee-validate";
import Input from "@/components/common/Input/index.vue";
import { LeagueContext } from "@/types";
import DeleteIcon from "@/assets/delete.svg";
import ConfirmationModal from "@/components/common/ConfirmationModal/index.vue";

const EditLeague = defineComponent({
  name: "EditLeague",
  components: { Avatar, Input, DeleteIcon, ConfirmationModal, ScrollContainer },
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
            leagueMembers {
              id
              isActive
              isCommissioner
              user {
                id
                displayName
                avatarUrl
              }
            }
            myLeagueMember {
              id
              isActive
              isCommissioner
            }
          }
        }
      `,
      { id: leagueId }
    );

    const league = useResult(result, null, (data) => data.league);
    const isCommissioner = computed(() => league.value?.myLeagueMember?.isCommissioner);
    const { isModalVisible, showConfirmationModal, hideConfirmationModal } = useConfirmationModal();

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
    const leagueMembers = computed(
      () =>
        league.value?.leagueMembers
          .filter((x) => x.isActive)
          .sort((x, y) => x.user.displayName.localeCompare(y.user.displayName)) ?? []
    );
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

    const { mutate: deleteLeague } = useMutation(
      gql`
        mutation DeleteLeague($input: DeleteLeagueInput!) {
          deleteLeague(input: $input) {
            success
          }
        }
      `
    );

    const handleDelete = async () => {
      const { data, errors } = await deleteLeague({ input: { id: league.value.id } });
      if (data) {
        router.push({ name: "my-leagues" });

        store.dispatch("pushNotification", {
          type: "success",
          message: "League deleted successfully!",
        });
      } else {
        store.dispatch("pushNotification", {
          type: "error",
          message: "Failed to delete league.",
        });
      }
    };

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
      isCommissioner,
      showConfirmationModal,
      hideConfirmationModal,
      isModalVisible,
      handleDelete,
      leagueMembers,
    };
  },
});

export default EditLeague;
</script>
