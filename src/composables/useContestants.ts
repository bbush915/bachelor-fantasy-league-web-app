import { useQuery, useResult } from "@vue/apollo-composable";
import gql from "graphql-tag";

export interface IContestant {
  id: string;
  name: string;
  imageUrl: string;
  age: number;
  occupation: string;
  hometown: string;
  bio: string;
  trivia: string[];
}

function useContestants() {
  const { result } = useQuery(
    gql`
      query Contestants {
        contestants {
          id
          name
          imageUrl
          age
          occupation
          hometown
          bio
          trivia
        }
      }
    `
  );

  const contestants = useResult<any, null, IContestant[]>(result, null, (data) => data.contestants);

  return {
    contestants,
  };
}

export default useContestants;
