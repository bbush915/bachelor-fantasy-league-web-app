<template>
  <div>
    <GradientOverlay class="z-0" />
    <SteamOverlay class="z-10" />

    <section class="relative flex flex-col items-center mx-40">
      <h1 class="self-start my-8">How it works</h1>

      <div class="w-2/3 mb-12">
        <section>
          <h2 class="my-4">Joining or creating a league</h2>
          <p>
            To play you must join a league. You can search for a league to join or create your own.
            The person who creates the league is the League Commissioner and can invite other
            players to join their league. New players can join a league any time during the season.
          </p>
        </section>

        <section>
          <h2 class="my-4">Setting your lineup</h2>
          <p>
            Once you have joined a league, you can access the League Home Page, where you can set
            your lineup. You set your lineup each week by selecting contenstants who you think will
            receive a rose. You can edit your lineup until 8pm EST the day the episode airs. Once
            the episode airs the lineup will be locked. If you don’t set your lineup you will
            receive 0 points for that week. After the episode ends you can set your lineup for the
            following week.
          </p>
        </section>

        <section>
          <h2 class="my-4">Scoring</h2>
          <p>
            After the episode ends the scores will be calculated. Scores will be displayed the next
            day on the League Home page.
            <br />
            <br />
            You will receive points for each contestant in your lineup who receives a rose. The
            number of points earned is based on the week number. In week 1 you will earn 1 point per
            contestant, in week 2 you will earn 2 points per contestant, etc.
            <br />
            <br />
            Additional bonus points will be awarded for:
            <br />
            <br />
            - Contestant is chosen for a group date (+1 point)
            <br />
            - Contestant is chosen for a 1 on 1 date (+10 points)
            <br />
            - Contestant receives a rose outside of a rose ceremony (+5 points)
            <br />
            <br />
            Points will be deducted for:
            <br />
            <br />
            - Contestant is chosen for a 2 on 1 date (-5 points)
            <br />
            - Contestant leaves or is sent home outside of a rose ceremony (-10 points)
          </p>
        </section>
      </div>

      <router-link class="w-48 btn-primary mb-80" :to="{ name: 'registration' }">
        Sign up
      </router-link>
    </section>
  </div>
</template>

<script lang="ts">
  import { defineComponent } from "vue";

  import GradientOverlay from "@/components/common/GradientOverlay/index.vue";
  import SteamOverlay from "@/components/common/SteamOverlay/index.vue";

  const About = defineComponent({
    name: "About",

    components: {
      GradientOverlay,
      SteamOverlay,
    },
  });

  export default About;
</script>
