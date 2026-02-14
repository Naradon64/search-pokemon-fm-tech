import { gql } from "@apollo/client/core";

export const POKEMON_GRAPHQL_ENDPOINT =
   "https://graphql-pokemon2.vercel.app"; // no need to actually use ENV since it's a public endpoint. 

export const POKEMON_BY_NAME_QUERY = gql`
  query PokemonByName($name: String!) {
    pokemon(name: $name) {
      id
      number
      name
      image
      classification
      types
      resistant
      weaknesses
      fleeRate
      maxCP
      maxHP
      height {
        minimum
        maximum
      }
      weight {
        minimum
        maximum
      }
      attacks {
        fast {
          name
          type
          damage
        }
        special {
          name
          type
          damage
        }
      }
      evolutionRequirements {
        amount
        name
      }
      evolutions {
        id
        name
      }
    }
  }
`;
