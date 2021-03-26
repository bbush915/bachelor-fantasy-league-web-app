import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";

type TResult = {
  me: IProfile;
};

export interface IProfile {
  id: string;
  email: string;
  displayName: string;
  avatarUrl?: string;
  sendLineupReminders: boolean;
  sendScoringRecaps: boolean;
}

export function useProfile() {
  const { result } = useQuery<TResult>(
    gql`
      query Me {
        me {
          id
          email
          displayName
          avatarUrl
          sendLineupReminders
          sendScoringRecaps
        }
      }
    `,
    null,
    { fetchPolicy: "cache-first" }
  );

  const profile = useResult<TResult, null, TResult["me"]>(result, null, (data) => data.me);

  return { profile };
}
