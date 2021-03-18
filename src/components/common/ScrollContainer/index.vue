<template>
  <div ref="rootElement">
    <div class="simplebar-wrapper">
      <div class="simplebar-height-auto-observer-wrapper">
        <div class="simplebar-height-auto-observer" />
      </div>

      <div class="simplebar-mask">
        <div class="simplebar-offset">
          <div class="simplebar-content-wrapper" ref="scrollElement">
            <div class="simplebar-content" ref="contentElement">
              <slot></slot>
            </div>
          </div>
        </div>
      </div>

      <div class="simplebar-placeholder" />
    </div>

    <div class="simplebar-track simplebar-horizontal">
      <div class="simplebar-scrollbar" />
    </div>

    <div class="simplebar-track simplebar-vertical">
      <div class="simplebar-scrollbar" />
    </div>
  </div>
</template>

<script lang="ts">
import SimpleBar from "simplebar";
import { defineComponent, onMounted, onUnmounted, ref } from "vue";

const ScrollContainer = defineComponent({
  name: "ScrollContainer",

  setup() {
    const rootElement = ref<HTMLElement>();
    const scrollElement = ref<HTMLElement>();
    const contentElement = ref<HTMLElement>();

    const simpleBar = ref<any>();

    onMounted(() => {
      const options = SimpleBar.getOptions(rootElement.value!.attributes);
      simpleBar.value = new SimpleBar(rootElement.value, options);
    });

    onUnmounted(() => {
      simpleBar.value.unMount();
    });

    return {
      rootElement,
      scrollElement,
      contentElement,
    };
  },
});

export default ScrollContainer;
</script>

<style lang="postcss" scoped>
.simplebar-scrollbar::before {
  @apply bg-white;
}

.simplebar-scrollbar.simplebar-visible:before {
  @apply opacity-75;
}

.simplebar-track.simplebar-vertical {
  @apply w-4;
}
</style>
