<template>
  <form class="flex flex-col" @submit="onSubmit">
    <label for="name">Name</label>
    <Input id="name" type="text" v-model:value="name" :error="errors.name" />

    <label class="mt-2" for="description">Description</label>
    <Input
      class="h-32"
      id="description"
      type="textarea"
      v-model:value="description"
      :error="errors.description"
    />

    <label class="mt-2">League Image</label>
    <div class="relative w-48 h-48 mt-2 overflow-hidden rounded-xl bg-gray">
      <input
        class="absolute top-0 left-0 w-full h-full opacity-0 cursor-pointer"
        type="file"
        @change="handleLogoUrlChange"
      />
      <img :src="logoUrl" />
    </div>

    <Checkbox class="mt-4" id="is-public" label="Anyone can join" v-model:checked="isPublic" />

    <Checkbox
      v-if="!isPublic"
      class="mt-2"
      id="is-shareable"
      label="Members can invite new members"
      v-model:checked="isShareable"
    />

    <div class="flex self-center mt-8 space-x-4">
      <router-link class="btn-secondary" :to="{ name: 'league-info', params: { id: league.id } }">
        Cancel
      </router-link>

      <button class="btn-primary" type="submit" :disabled="!canSubmit" @click="onSubmit">
        Save
      </button>
    </div>
  </form>
</template>

<script lang="ts">
  import { useMutation } from "@vue/apollo-composable";
  import gql from "graphql-tag";
  import { useField, useForm } from "vee-validate";
  import { computed, defineComponent, PropType, toRefs, watch } from "vue";
  import { useRouter } from "vue-router";
  import { useStore } from "vuex";
  import { boolean, object, string } from "yup";

  import Checkbox from "@/components/common/Checkbox/index.vue";
  import Input from "@/components/common/Input/index.vue";
  import { useMutableImage } from "@/composables";

  type TLeague = {
    id: string;
    name: string;
    description: string;
    logoUrl: string;
    isPublic: boolean;
    isShareable: boolean;
  };

  type TUpdateLeagueResult = {
    updateLeague: {
      id: string;
      name: string;
      description: string;
      logoUrl: string;
      isPublic: boolean;
      isShareable: boolean;
    };
  };

  type TUpdateLeagueVariables = {
    input: {
      id: string;
      name: string;
      description: string;
      logo: string;
      isPublic: boolean;
      isShareable: boolean;
    };
  };

  const EditLeagueDetailsForm = defineComponent({
    components: {
      Checkbox,
      Input,
    },

    props: {
      league: {
        type: Object as PropType<TLeague>,
        required: true,
      },
    },

    setup(props) {
      const { league } = toRefs(props);

      const store = useStore();
      const router = useRouter();

      const { mutate: updateLeague } = useMutation<TUpdateLeagueResult, TUpdateLeagueVariables>(
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

      const { source: logoUrl, handleSourceChange: handleLogoUrlChange } = useMutableImage(
        league.value.logoUrl
      );

      const { errors, handleSubmit, meta, setFieldError, setFieldValue } = useForm({
        validationSchema: object({
          name: string().required("You must provide a league name."),
          description: string().required("You must provide a league description."),
          logoUrl: string().required("You must provide a league image."),
          isPublic: boolean().default(false),
          isShareable: boolean().default(false),
        }),

        initialValues: {
          name: league.value.name,
          description: league.value.description,
          logoUrl: league.value.logoUrl,
          isPublic: league.value.isPublic,
          isShareable: league.value.isShareable,
        },
      });

      const { value: name } = useField<string | undefined>("name");
      const { value: description } = useField<string | undefined>("description");
      const { value: _logoUrl } = useField<string | undefined>("logoUrl");
      const { value: isPublic } = useField<boolean>("isPublic");
      const { value: isShareable } = useField<boolean>("isShareable");

      watch(
        () => logoUrl.value,
        () => {
          setFieldValue("logoUrl", logoUrl.value);
        }
      );

      watch(
        () => isPublic.value,
        () => {
          if (isPublic.value) {
            setFieldValue("isShareable", false);
          }
        }
      );

      const canSubmit = computed(() => meta.value.valid);

      const onSubmit = handleSubmit(async (values) => {
        const { data, errors } = await updateLeague({
          input: {
            id: league.value.id,
            name: values.name!,
            description: values.description!,
            logo: values.logoUrl!,
            isPublic: values.isPublic,
            isShareable: values.isShareable,
          },
        });

        if (data) {
          router.push({
            name: "league-info",
            params: { leagueId: data.updateLeague.id },
          });

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
        name,
        description,
        logoUrl,
        handleLogoUrlChange,
        isPublic,
        isShareable,
        errors,
        canSubmit,
        onSubmit,
      };
    },
  });

  export default EditLeagueDetailsForm;
</script>
