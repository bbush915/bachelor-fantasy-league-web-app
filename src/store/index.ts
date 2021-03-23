import { createLogger, createStore } from "vuex";

interface State {
  auth: {
    token: string | null;
  };
  notifications: Notification[];
}

type Notification = {
  type: "success" | "error";
  message: string;
  timestamp?: number;
};

export const getStore = () => {
  const store = createStore<State>({
    state() {
      return {
        auth: {
          token: window.localStorage.getItem("token"),
        },
        notifications: [],
      };
    },

    mutations: {
      login(state, token: string) {
        window.localStorage.setItem("token", token);
        state.auth.token = token;
      },

      logout(state) {
        window.localStorage.removeItem("token");
        state.auth.token = null;
      },

      addNotification(state, notification: Notification) {
        state.notifications.push(notification);
      },

      removeNotification(state, notification: Notification) {
        const index = state.notifications.findIndex((x) => x.timestamp === notification.timestamp);
        state.notifications.splice(index, 1);
      },
    },

    actions: {
      pushNotification(context, notification: Notification) {
        notification.timestamp = new Date().getTime();

        context.commit("addNotification", notification);

        setTimeout(() => context.commit("removeNotification", notification), 2500);
      },
    },

    plugins: [createLogger()],
  });

  return store;
};
