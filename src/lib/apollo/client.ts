import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client/core";
import { POKEMON_GRAPHQL_ENDPOINT } from "@/features/pokemon/graphql";

export const apolloClient = new ApolloClient({
  link: new HttpLink({
    uri: POKEMON_GRAPHQL_ENDPOINT,
  }),
  cache: new InMemoryCache({
    typePolicies: {
      Query: {
        fields: {
          pokemon: {
            keyArgs: ["name"],
          },
        },
      },
    },
  }),
});
