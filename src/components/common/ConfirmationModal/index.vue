<template>
  <Teleport to="body">
    <div class="fixed top-0 left-0 z-50 w-screen h-screen overlay" @click="onClose">
      <div class="relative flex flex-col px-16 pb-8 modal bg-gray-darkest rounded-xl" @click.stop>
        <button class="absolute right-4 top-4" @click="onClose">
          <div class="w-8 h-8">
            <CloseIcon />
          </div>
        </button>

        <h2 class="absolute top-4 left-8">Are you sure?</h2>

        <div class="relative flex flex-col mt-20">
          <div class="mb-8">
            <body>
              {{ message }}
            </body>
          </div>
          <div class="flex self-end space-x-4">
            <button class="btn-secondary" @click="onClose">No</button
            ><button class="self-end btn-primary" @click="onConfirm">Yes</button>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import CloseIcon from "@/assets/close.svg";

  const ConfirmationModal = defineComponent({
    name: "ConfirmationModal",

    components: {
      CloseIcon,
    },

    props: {
      onClose: {
        type: Function,
        required: true,
      },

      onConfirm: {
        type: Function,
        required: true,
      },

      message: {
        type: String,
        required: true,
      },
    },
  });

  export default ConfirmationModal;
</script>

<style scoped>
  .overlay {
    background-color: rgba(0, 0, 0, 0.5);
  }

  .modal {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
</style>
