import { DefaultApolloClient } from "@vue/apollo-composable";
import { createApp, h, provide } from "vue";

import App from "./App.vue";
import { getApolloClient } from "./gql";
import { getRouter } from "./routes";

import "./styles/index.css";

createApp({
  setup() {
    provide(DefaultApolloClient, getApolloClient());
  },

  render: () => h(App),
})
  .use(getRouter())
  .mount("#app");
