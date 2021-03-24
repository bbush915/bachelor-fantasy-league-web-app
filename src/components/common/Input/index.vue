<template>
  <input
    class="px-4 py-2 my-2 border border-white outline-none rounded-xl"
    v-bind="$attrs"
    :class="{ error }"
    :value="value"
    @input="$emit('update:value', $event.target.value)"
  />

  <span v-if="error" class="mb-2 text-xs text-pink-dark">{{ error }}</span>
</template>

<script lang="ts">
import { defineComponent } from "vue";

const Input = defineComponent({
  name: "Input",

  props: {
    value: {
      type: String,
      required: false,
    },

    error: {
      type: String,
      required: false,
    },
  },
});

export default Input;
</script>

<style lang="postcss" scoped>
input {
  background: transparent;

  &.error {
    @apply border-pink-dark;
  }

  &:focus {
    box-shadow: 0 0 0 2px #ffaab4;
  }
}
</style>
