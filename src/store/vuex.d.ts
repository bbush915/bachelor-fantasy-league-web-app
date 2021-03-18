import { Store } from "vuex";

declare module "@vue/runtime-core" {
  interface State {
    notifications: string[];
  }

  interface ComponentCustomProperties {
    $store: Store<State>;
  }
}
