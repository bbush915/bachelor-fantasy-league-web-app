import { DefaultApolloClient } from "@vue/apollo-composable";
import { createApp, h, provide } from "vue";
import { VTooltip } from "v-tooltip";

import App from "./App.vue";
import { getApolloClient } from "./gql";
import { getRouter } from "./router";
import { getStore } from "./store";

import "simplebar/dist/simplebar.css";
import "./styles/index.css";

createApp({
  setup() {
    provide(DefaultApolloClient, getApolloClient());
  },

  render: () => h(App),
})
  .use(getRouter())
  .use(getStore())
  .directive("tooltip", VTooltip)
  .mount("#app");
