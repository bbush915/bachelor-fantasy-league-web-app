<template>
  <footer class="relative z-10 flex items-center justify-center py-6 bg-gray-dark">
    <span class="absolute text-left left-8">
      Bachelor Fantasy League is not owned by, affiliated with, or operated under ABC.
      <br />
      ABC owns all rights to contestant photos, footage, and other related assets.
    </span>

    <span class="text-center">
      Copyright &copy; 2021 by Bachelor Fantasy League. All rights reserved.
    </span>

    <span class="absolute text-right right-8">
      Icons made by
      <a class="underline" href="https://www.freepik.com">Freepik</a>
      from
      <a class="underline" href="https://www.flaticon.com/">www.flaticon.com</a>

      <br />

      Icons made by
      <a class="underline" href="https://www.flaticon.com/authors/pixel-perfect">Pixel perfect</a>
      from
      <a class="underline" href="https://www.flaticon.com/">www.flaticon.com</a>
    </span>
  </footer>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  const Footer = defineComponent({
    name: "Footer",
  });

  export default Footer;
</script>

<style scoped>
  footer {
    box-shadow: 0 0 6px black;
  }

  footer > span {
    font-size: 10px;
    line-height: 150%;
  }
</style>
