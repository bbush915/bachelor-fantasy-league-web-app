<template>
  <div class="flex items-center">
    <input
      v-bind="$attrs"
      hidden
      type="checkbox"
      :checked="checked"
      :disabled="disabled"
      @input="$emit('update:checked', $event.target.checked)"
    />

    <div
      :tabindex="disabled ? undefined : 0"
      class="w-4 h-4 border-2 border-white rounded-md outline-none checkbox"
      :class="{ disabled }"
      @keyup.space="disabled ? undefined : $emit('update:checked', !checked)"
      @click="disabled ? undefined : $emit('update:checked', !checked)"
    >
      <CheckIcon v-if="checked" />
    </div>

    <label class="block pt-0.5 ml-2" :for="$attrs.id">{{ label }}</label>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import CheckIcon from "@/assets/check.svg";

const Checkbox = defineComponent({
  name: "Checkbox",

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

    disabled: {
      type: Boolean,
      required: false,
      default: false,
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

  &.disabled {
    box-shadow: none;
  }
}
</style>
