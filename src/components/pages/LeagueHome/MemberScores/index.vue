<template>
  <div class="relative py-8 bg-gray rounded-xl">
    <h1 class="pl-8 text-lg">Week {{ week }} Scores</h1>

    <button class="absolute top-8 right-8">
      <MoreIcon />
    </button>

    <div class="mt-8 font-thin">
      <div
        v-for="(member, index) in members"
        :key="index"
        class="flex items-center px-8 py-2"
        :class="{ 'bg-gray-dark': index === 3 }"
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

const MemberScores = defineComponent({
  name: "MemberScores",

  components: {
    MoreIcon,
  },

  setup() {
    const members: any[] = [
      {
        place: 1,
        name: "Anne Marie L.",
        profile_url:
          "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNzYxNzE1MDMsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiYXpMZnRyNFRSQU9VNkZIem92d2gifQ==,signature:3854f58e345cb9dae4d850e7a460f3a311eb416ee4a850007ac7ece978898d53/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/azLftr4TRAOU6FHzovwh",
        score: 30,
      },
      {
        place: 2,
        name: "Karli B.",
        profile_url:
          "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNzMxODc3MTksImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiaXV4aHl6aVJpMkgyUWI4b1YwQmcifQ==,signature:68d3d18d493ab4c47c0c88debc165505e37282453d16f403a8729a98d99de648/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/iuxhyziRi2H2Qb8oV0Bg",
        score: 24,
      },
      {
        place: 3,
        name: "Bryan B.",
        profile_url:
          "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNDkyNjE1MjUsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoic2xXbUpzS1RUMTZJdlE2Q3RhbWkifQ==,signature:737b8a54f72b7ae56632b7b3285ad6d939b2526ef999c0ed9d93b451330a1b71/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/slWmJsKTT16IvQ6Ctami",
        score: 18,
      },
      {
        place: 6,
        name: "You",
        profile_url:
          "https://cdn.filestackcontent.com/AchUBPpbtR12UdA8r3ilwz/security=policy:eyJleHBpcnkiOjIxNjkwNzI5ODIsImNhbGwiOlsicmVhZCIsImNvbnZlcnQiXSwiaGFuZGxlIjoiU2hvNGVmTXRUVnUzdG9kTDl2T3cifQ==,signature:f2962b59b3b6372edf6b86d01091e4b66924818c46fbc731b55bc8f31550d0a5/resize=w:300,h:300,fit:crop,align:faces/rotate=d:exif/Sho4efMtTVu3todL9vOw",
        score: 12,
      },
    ];

    return {
      members,
      getOrdinal,
      week: 6,
    };
  },
});

export default MemberScores;
</script>