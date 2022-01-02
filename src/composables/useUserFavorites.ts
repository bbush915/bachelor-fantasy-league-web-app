import { useMutation, useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";
import { reactive } from "vue";
import { useStore } from "vuex";

import { useAuthentication } from "./useAuthentication";

type TResult = {
  myFavorites: {
    id: string;
    userId: string;
    contestantId: string;
  }[];
};

const GET_USER_FAVORITES = gql`
  query UserFavorites {
    myFavorites {
      id
      userId
      contestantId
    }
  }
`;

export function useUserFavorites() {
  const store = useStore();
  const { isAuthenticated } = useAuthentication();

  const { result } = useQuery<TResult>(
    GET_USER_FAVORITES,
    null,
    reactive({
      fetchPolicy: "cache-first",
      enabled: isAuthenticated,
    })
  );

  const userFavorites = useResult(result, [] as TResult["myFavorites"], (data) => data.myFavorites);

  const { mutate: addFavorite_ } = useMutation(
    gql`
      mutation AddFavorite($input: ToggleUserFavoriteInput!) {
        addFavorite(input: $input) {
          id
          userId
          contestantId
        }
      }
    `,
    {
      update(cache, { data }) {
        const userFavorite = data?.addFavorite;
        const existingUserFavorites = cache.readQuery<TResult>({
          query: GET_USER_FAVORITES,
        });

        if (userFavorite && existingUserFavorites) {
          cache.writeQuery({
            query: GET_USER_FAVORITES,
            data: {
              myFavorites: [...existingUserFavorites.myFavorites, userFavorite],
            },
          });
        }
      },
    }
  );

  async function addUserFavorite(contestantId: string) {
    const response = await addFavorite_({
      input: {
        contestantId,
      },
    });

    if (!response?.data) {
      store.dispatch("pushNotification", {
        type: "error",
        message: "Failed to save favorite. Please try again later",
      });
    }
  }

  const { mutate: removeFavorite_ } = useMutation(
    gql`
      mutation RemoveFavorite($input: ToggleUserFavoriteInput!) {
        removeFavorite(input: $input) {
          id
          userId
          contestantId
        }
      }
    `,
    {
      update(cache, { data }) {
        const userFavorite = data?.removeFavorite;
        const existingUserFavorites = cache.readQuery<TResult>({
          query: GET_USER_FAVORITES,
        });

        if (userFavorite && existingUserFavorites) {
          cache.evict({
            fieldName: "myFavorites",
            broadcast: false,
          });

          cache.writeQuery({
            query: GET_USER_FAVORITES,
            data: {
              myFavorites: [
                ...existingUserFavorites.myFavorites.filter((x) => x.id !== userFavorite.id),
              ],
            },
          });
        }
      },
    }
  );

  async function removeUserFavorite(contestantId: string) {
    const response = await removeFavorite_({
      input: {
        contestantId,
      },
    });

    if (!response?.data) {
      store.dispatch("pushNotification", {
        type: "error",
        message: "Failed to remove favorite. Please try again later",
      });
    }
  }

  function toggleUserFavorite(contestantId: string) {
    if (userFavorites.value.some((x) => x.contestantId === contestantId)) {
      removeUserFavorite(contestantId);
    } else {
      addUserFavorite(contestantId);
    }
  }

  return {
    userFavorites,
    toggleUserFavorite,
  };
}
