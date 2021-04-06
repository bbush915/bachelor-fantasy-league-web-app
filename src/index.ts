import { provideApolloClient } from "@vue/apollo-composable";
import { createApp, h } from "vue";
import { VTooltip } from "v-tooltip";

import App from "./App.vue";
import { getApolloClient } from "./gql";
import { getRouter } from "./router";
import { getStore } from "./store";

import "simplebar/dist/simplebar.css";
import "./styles/index.css";

createApp({
  setup() {
    provideApolloClient(getApolloClient());
  },

  render: () => h(App),
})
  .use(getStore())
  .use(getRouter())
  .directive("tooltip", VTooltip)
  .mount("#app");
