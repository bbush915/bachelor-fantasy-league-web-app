<template>
  <div class="flex flex-col items-center pt-6 pb-8">
    <div class="flex flex-col self-start mb-6 ml-40">
      <h1 class="text-3xl">My Fantasy Leagues</h1>
    </div>

    <div class="flex flex-col items-center w-3/5 p-8 bg-gray-dark rounded-3xl">
      <h1 class="self-start text-lg">Current Season</h1>

      <div class="flex flex-col w-full">
        <div v-if="leagues?.length > 0">
          <table class="w-full">
            <thead>
              <tr>
                <th />
                <th />
                <th>Place</th>
                <th>Lineup Set?</th>
                <th>Edit Lineup</th>
                <th />
              </tr>
            </thead>
            <tbody>
              <tr v-for="league in leagues" :key="league.id">
                <td class="w-14">
                  <div class="overflow-hidden w-14 h-14 rounded-xl">
                    <img :src="league.imageUrl" />
                  </div>
                </td>

                <td>
                  <span>{{ league.name }}</span>
                </td>

                <td align="center">
                  <span>1st</span>
                </td>

                <td align="center">
                  <div class="w-5 h-5">
                    <AlertIcon />
                  </div>
                </td>

                <td align="center">
                  <router-link :to="`/leagues/${league.id}/set-lineup`">
                    <EditIcon />
                  </router-link>
                </td>

                <td align="center">
                  <router-link
                    class="flex items-center justify-center btn-secondary"
                    :to="`/leagues/${league.id}`"
                  >
                    League Home
                  </router-link>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div v-else>
          <div class="w-16 h-16 mb-8">
            <RoseIcon />
          </div>

          <p class="mb-12 text-sm font-thin">
            You are not a member of any fantasy leagues! Search for a league to join or create a new
            league to get started.
          </p>
        </div>

        <router-link class="flex items-center justify-center mb-6 btn-primary" to="/join-league">
          Join a League
        </router-link>

        <router-link class="flex items-center justify-center btn-primary" to="/create-league">
          Create a League
        </router-link>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import gql from "graphql-tag";
import { useQuery, useResult } from "@vue/apollo-composable";
import { defineComponent } from "vue";

import AlertIcon from "@/assets/alert.svg";
import EditIcon from "@/assets/edit.svg";
import RoseIcon from "@/assets/rose.svg";

const MyLeagues = defineComponent({
  name: "MyLeagues",

  components: {
    AlertIcon,
    EditIcon,
    RoseIcon,
  },

  setup() {
    const { result } = useQuery(
      gql`
        query MyLeagues {
          myLeagues {
            id
            name
            imageUrl
          }
        }
      `
    );

    const leagues = useResult(result, null, (data) => data.myLeagues);

    return {
      leagues,
    };
  },
});

export default MyLeagues;
</script>
