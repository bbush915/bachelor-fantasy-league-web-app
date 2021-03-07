<template>
  <div class="relative pt-8 bg-gray rounded-xl">
    <h1 class="pl-8 text-lg">Leaderboard</h1>

    <router-link class="absolute top-8 right-8" :to="{ name: 'leaderboard-details' }">
      <MoreIcon />
    </router-link>

    <div class="pr-8 mt-8 font-thin">
      <div
        v-for="(member, index) in members"
        :key="index"
        class="flex items-center h-10 pl-8 pr-4 my-8 member"
        :style="{ width: `${member.width}%` }"
      >
        <span class="w-7">{{ getOrdinal(member.place) }}</span>
        <div class="w-16 h-16 ml-5 overflow-hidden rounded-full">
          <img :src="member.profile_url" />
        </div>
        <span class="ml-5">{{ member.name }}</span>
        <div class="flex-grow" />
        <span>{{ member.score }}</span>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

import MoreIcon from "@/assets/more.svg";
import { getOrdinal } from "@/utils";

const Leaderboard = defineComponent({
  name: "Leaderboard",

  components: {
    MoreIcon,
  },

  setup() {
    function getWidth(min: number, max: number, value: number): number {
      return (0.5 + 0.5 * ((value - min) / (max - min))) * 100;
    }

    const members: any[] = [
      {
        place: 1,
        name: "Anne Marie L.",
        profile_url:
          "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNzYxNzE1MDMsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiYXpMZnRyNFRSQU9VNkZIem92d2gifQ==,signature:3854f58e345cb9dae4d850e7a460f3a311eb416ee4a850007ac7ece978898d53/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/azLftr4TRAOU6FHzovwh",
        score: 197,
      },
      {
        place: 2,
        name: "Karli B.",
        profile_url:
          "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNzMxODc3MTksImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiaXV4aHl6aVJpMkgyUWI4b1YwQmcifQ==,signature:68d3d18d493ab4c47c0c88debc165505e37282453d16f403a8729a98d99de648/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/iuxhyziRi2H2Qb8oV0Bg",
        score: 181,
      },
      {
        place: 3,
        name: "Bryan B.",
        profile_url:
          "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNDkyNjE1MjUsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoic2xXbUpzS1RUMTZJdlE2Q3RhbWkifQ==,signature:737b8a54f72b7ae56632b7b3285ad6d939b2526ef999c0ed9d93b451330a1b71/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/slWmJsKTT16IvQ6Ctami",
        score: 177,
      },
      {
        place: 6,
        name: "You",
        profile_url:
          "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNjkwNzI5ODIsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiU2hvNGVmTXRUVnUzdG9kTDl2T3cifQ==,signature:f2962b59b3b6372edf6b86d01091e4b66924818c46fbc731b55bc8f31550d0a5/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/Sho4efMtTVu3todL9vOw",
        score: 145,
      },
    ];

    const minScore = Math.min(...members.map((x) => x.score));
    const maxScore = Math.max(...members.map((x) => x.score));

    return {
      members: members.map((x) => ({
        ...x,
        width: getWidth(minScore, maxScore, x.score),
      })),
      getOrdinal,
    };
  },
});

export default Leaderboard;
</script>

<style scoped>
.member {
  background: linear-gradient(
    267.01deg,
    rgba(226, 28, 52, 0.86) -10.04%,
    rgba(226, 28, 52, 0.1) 128.31%
  );
}
</style>
