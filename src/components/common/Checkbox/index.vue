<template>
  <div class="flex items-center" :class="$attrs.class">
    <input
      v-bind="$attrs"
      hidden
      type="checkbox"
      :checked="checked"
      @input="$emit('update:checked', $event.target.checked)"
    />

    <div
      :tabindex="0"
      class="w-4 h-4 border-2 border-white rounded-md outline-none checkbox"
      @keyup.space="$emit('update:checked', !checked)"
      @click="$emit('update:checked', !checked)"
    >
      <CheckIcon v-if="checked" />
    </div>

    <label class="block pt-1 ml-2" :for="$attrs.id">{{ label }}</label>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import CheckIcon from "@/assets/check.svg";

  const Checkbox = defineComponent({
    components: {
      CheckIcon,
    },

    inheritAttrs: false,

    props: {
      checked: {
        type: Boolean,
        required: true,
      },

      label: {
        type: String,
        required: true,
      },
    },
  });

  export default Checkbox;
</script>

<style lang="postcss" scoped>
  .checkbox {
    &:focus {
      box-shadow: 0 0 0 2px #ffaab4;
    }
  }
</style>
