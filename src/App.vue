<template>
  <div class="bg-gray-darkest">
    <Header v-if="showRunners" />
    <Notifications />

    <ScrollContainer
      class="scroll-container"
      :style="{
        'min-height': `calc(100vh - ${showRunners ? '88px' : '0px'})`,
      }"
    >
      <router-view
        :style="{
          'min-height': `calc(100vh - ${showRunners ? '88px' : '0px'})`,
        }"
      />

      <Footer v-if="showRunners" />
    </ScrollContainer>
  </div>
</template>

<script lang="ts">
  import { computed, defineComponent } from "vue";
  import { useRoute } from "vue-router";

  import Header from "@/components/common/Header/index.vue";
  import Footer from "@/components/common/Footer/index.vue";
  import Notifications from "@/components/common/Notifications/index.vue";
  import ScrollContainer from "@/components/common/ScrollContainer/index.vue";

  export default defineComponent({
    components: {
      Header,
      Footer,
      Notifications,
      ScrollContainer,
    },

    setup() {
      const route = useRoute();

      const showRunners = computed(() => route.path !== "/");

      return {
        showRunners,
      };
    },
  });
</script>
