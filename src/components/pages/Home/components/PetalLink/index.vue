<template>
  <div>
    <router-link
      class="flex items-center justify-center h-48 w-96"
      :class="['petal-link', { mirror }]"
      :to="to"
    >
      <span class="text-3xl text-center">{{ content }}</span>
    </router-link>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  const PetalLink = defineComponent({
    props: {
      to: {
        type: String,
        required: true,
      },

      content: {
        type: String,
        required: true,
      },

      mirror: {
        type: Boolean,
        required: false,
        default: false,
      },
    },
  });

  export default PetalLink;
</script>

<style lang="postcss" scoped>
  .petal-link {
    background: linear-gradient(120deg, #e21c34 20%, #500b28 80%);
    border-radius: 6rem 0;

    &.mirror {
      background: linear-gradient(240deg, #e21c34 20%, #500b28 80%);
      border-radius: 0 6rem;
    }
  }
</style>
