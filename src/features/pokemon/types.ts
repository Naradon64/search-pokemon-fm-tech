export type PokemonDimension = {
  minimum: string;
  maximum: string;
};

export type Attack = {
  name: string;
  type: string;
  damage: number;
};

export type PokemonAttacks = {
  fast: Attack[];
  special: Attack[];
};

export type PokemonEvolution = {
  id: string;
  name: string;
};

export type PokemonEvolutionRequirements = {
  amount: number;
  name: string;
};

export type Pokemon = {
  id: string;
  number: string;
  name: string;
  image: string;
  classification: string;
  types: string[];
  resistant: string[];
  weaknesses: string[];
  fleeRate: number;
  maxCP: number;
  maxHP: number;
  height: PokemonDimension;
  weight: PokemonDimension;
  attacks: PokemonAttacks;
  evolutions: PokemonEvolution[] | null;
  evolutionRequirements: PokemonEvolutionRequirements | null;
};

export type PokemonByNameQueryData = {
  pokemon: Pokemon | null;
};

export type PokemonByNameQueryVars = {
  name: string;
};
