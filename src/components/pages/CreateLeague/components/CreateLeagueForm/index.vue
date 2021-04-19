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

    <button
      class="self-center mt-8 btn-primary"
      type="submit"
      :disabled="!canSubmit"
      @click="onSubmit"
    >
      Save
    </button>
  </form>
</template>

<script lang="ts">
  import { useField, useForm } from "vee-validate";
  import { computed, defineComponent, watch } from "vue";
  import { boolean, object, string } from "yup";

  import Checkbox from "@/components/common/Checkbox/index.vue";
  import Input from "@/components/common/Input/index.vue";
  import { useMutableImage } from "@/composables";
  import gql from "graphql-tag";
  import { useMutation } from "@vue/apollo-composable";
  import { useStore } from "vuex";
  import { useRouter } from "vue-router";

  type TCreateLeagueResult = { createLeague: { id: string } };

  type TCreateLeagueVariables = {
    input: {
      name: string;
      description: string;
      logo: string;
      isPublic: boolean;
      isShareable: boolean;
    };
  };

  const CreateLeagueForm = defineComponent({
    components: {
      Checkbox,
      Input,
    },

    setup() {
      const store = useStore();
      const router = useRouter();

      const { mutate: createLeague } = useMutation<TCreateLeagueResult, TCreateLeagueVariables>(
        gql`
          mutation CreateLeague($input: CreateLeagueInput!) {
            createLeague(input: $input) {
              id
            }
          }
        `
      );

      const { source: logoUrl, handleSourceChange: handleLogoUrlChange } = useMutableImage();

      const { errors, handleSubmit, meta, setFieldError, setFieldValue } = useForm({
        validationSchema: object({
          name: string().required("You must provide a league name."),
          description: string().required("You must provide a league description."),
          logoUrl: string().required("You must provide a league image."),
          isPublic: boolean().default(false),
          isShareable: boolean().default(false),
        }),

        initialValues: {
          name: undefined,
          description: undefined,
          logoUrl: undefined,
          isPublic: true,
          isShareable: false,
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
        const { data, errors } = await createLeague({
          input: {
            name: values.name!,
            description: values.description!,
            logo: values.logoUrl!,
            isPublic: values.isPublic,
            isShareable: values.isShareable,
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
          if (errors?.some((x) => x.extensions?.code === "LEAGUE_ALREADY_EXISTS")) {
            setFieldError("name", "A league with that name already exists.");
          }

          store.dispatch("pushNotification", {
            type: "error",
            message: "Failed to create league.",
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

  export default CreateLeagueForm;
</script>
