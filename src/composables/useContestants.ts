import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";

type TResult = {
  allContestants: IContestant[];
};

export interface IContestant {
  id: string;
  name: string;
  headshotUrl: string;
  age: number;
  occupation: string;
  hometown: string;
  bio: string;
  trivia: string[];
}

export function useContestants() {
  const { result } = useQuery<TResult>(
    gql`
      query Contestants {
        allContestants {
          id
          name
          headshotUrl
          age
          occupation
          hometown
          bio
          trivia
        }
      }
    `,
    {},
    { fetchPolicy: "cache-first" }
  );

  const contestants = useResult(
    result,
    [] as TResult["allContestants"],
    (data) => data.allContestants.sort((x, y) => x.name.localeCompare(y.name))
  );

  return {
    contestants,
  };
}
