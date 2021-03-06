<template>
  <div class="fixed right-0 z-50 top-28">
    <transition-group name="notification-list">
      <div
        v-for="notification in notifications"
        :key="notification.timestamp"
        class="flex items-center h-10 px-10 mb-4 text-sm font-thin rounded-l-full notification"
        :class="[notification.type]"
      >
        {{ notification.message }}
      </div>
    </transition-group>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent } from "vue";
import { useStore } from "vuex";

const Notifications = defineComponent({
  name: "Notifications",

  setup() {
    const store = useStore();

    const notifications = computed(() => store.state.notifications);

    return {
      notifications,
    };
  },
});

export default Notifications;
</script>

<style lang="postcss" scoped>
.notification-list-enter-active,
.notification-list-leave-active {
  transition: all 1s ease;
}

.notification-list-enter-from,
.notification-list-leave-to {
  opacity: 0;
  transform: translateX(200px);
}

.notification {
  min-width: 375px;

  &.error {
    background: linear-gradient(110.73deg, #e21c34 18.94%, #500b28 79.72%);
  }

  &.success {
    background: linear-gradient(92.94deg, #429634 -0.85%, #2e6125 101.08%);
  }
}
</style>
