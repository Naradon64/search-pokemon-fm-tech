"use client";

import { useQuery } from "@apollo/client/react";
import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { POKEMON_BY_NAME_QUERY } from "@/features/pokemon/graphql";
import { PokemonByNameQueryData, PokemonByNameQueryVars } from "@/features/pokemon/types";
import styles from "./page.module.css";

const SEARCH_PARAM_KEY = "name";
const RECENT_SEARCHES_KEY = "pokemon_recent_searches";
const RECENT_SEARCHES_LIMIT = 5;

const TYPE_CLASS_MAP: Record<string, string> = {
  normal: styles.typeNormal,
  fire: styles.typeFire,
  water: styles.typeWater,
  electric: styles.typeElectric,
  grass: styles.typeGrass,
  ice: styles.typeIce,
  fighting: styles.typeFighting,
  poison: styles.typePoison,
  ground: styles.typeGround,
  flying: styles.typeFlying,
  psychic: styles.typePsychic,
  bug: styles.typeBug,
  rock: styles.typeRock,
  ghost: styles.typeGhost,
  dragon: styles.typeDragon,
  dark: styles.typeDark,
  steel: styles.typeSteel,
  fairy: styles.typeFairy,
};

const getTypeClassName = (type: string) =>
  TYPE_CLASS_MAP[type.trim().toLowerCase()] ?? styles.typeUnknown;

function HomeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const searchValueFromUrl = searchParams.get(SEARCH_PARAM_KEY) ?? "";
  const normalizedName = searchValueFromUrl.trim().toLowerCase();
  const hasSearch = normalizedName.length > 0;

  const [inputValue, setInputValue] = useState(searchValueFromUrl);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    setInputValue(searchValueFromUrl);
  }, [searchValueFromUrl]);

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(RECENT_SEARCHES_KEY);
      if (!stored) {
        return;
      }

      const parsed = JSON.parse(stored);
      if (!Array.isArray(parsed)) {
        return;
      }

      setRecentSearches(
        parsed
          .filter((item): item is string => typeof item === "string")
          .slice(0, RECENT_SEARCHES_LIMIT),
      );
    } catch {
      setRecentSearches([]);
    }
  }, []);

  const { data, loading, error } = useQuery<PokemonByNameQueryData, PokemonByNameQueryVars>(
    POKEMON_BY_NAME_QUERY,
    {
      variables: { name: normalizedName },
      skip: !hasSearch,
      fetchPolicy: "cache-first",
      nextFetchPolicy: "cache-first",
    },
  );

  const pokemon = data?.pokemon ?? null;

  const updateSearch = (value: string) => {
    const normalized = value.trim().toLowerCase();
    const params = new URLSearchParams(searchParams.toString());

    if (normalized) {
      params.set(SEARCH_PARAM_KEY, normalized);
      setRecentSearches((current) => {
        const next = [normalized, ...current.filter((item) => item !== normalized)].slice(
          0,
          RECENT_SEARCHES_LIMIT,
        );
        window.localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(next));
        return next;
      });
    } else {
      params.delete(SEARCH_PARAM_KEY);
    }

    const next = params.toString();
    router.push(next ? `/?${next}` : "/", { scroll: false });
  };

  return (
    <>
      <section className={styles.box}>
        <h1>Search Pokemon</h1>
        <p className={styles.help}>Search by name. URL and result stay in sync.</p>

        <form
          className={styles.form}
          onSubmit={(event) => {
            event.preventDefault();
            updateSearch(inputValue);
          }}
        >
          <input
            name="name"
            type="text"
            placeholder="Type a Pokemon name (e.g., Bulbasaur)"
            value={inputValue}
            onChange={(event) => setInputValue(event.target.value)}
            autoComplete="off"
          />
          <button type="submit">Search</button>
        </form>

        {recentSearches.length > 0 && (
          <section className={styles.panel}>
            <h3>Recent Searches</h3>
            <div className={styles.tags}>
              {recentSearches.map((name) => (
                <button
                  type="button"
                  className={`${styles.linkButton} ${styles.recentButton}`}
                  onClick={() => updateSearch(name)}
                  key={`recent-${name}`}
                >
                  {name}
                </button>
              ))}
            </div>
          </section>
        )}
      </section>

      {!hasSearch && (
        <section className={styles.box}>
          <h2>Start by searching a Pokemon name</h2>
        </section>
      )}

      {hasSearch && loading && (
        <section className={styles.box}>
          <h2>Loading</h2>
          <p className={styles.muted}>Searching for “{normalizedName}”...</p>
        </section>
      )}

      {hasSearch && !loading && error && (
        <section className={styles.box}>
          <h2>Request failed</h2>
          <p className={styles.muted}>{error.message}</p>
        </section>
      )}

      {hasSearch && !loading && !error && !pokemon && (
        <section className={styles.box}>
          <h2>Pokemon not found</h2>
          <p className={styles.muted}>No result for “{normalizedName}”.</p>
        </section>
      )}

      {hasSearch && !loading && !error && pokemon && (
        <section className={styles.box}>
          <div className={styles.header}>
            <div>
              <p className={styles.number}>#{pokemon.number}</p>
              <h2>{pokemon.name}</h2>
              <p className={styles.muted}>{pokemon.classification}</p>
              <p className={styles.muted}>ID: {pokemon.id}</p>
              <div className={styles.tags}>
                {pokemon.types.map((type) => (
                  <span key={type} className={`${styles.typeBadge} ${getTypeClassName(type)}`}>
                    {type}
                  </span>
                ))}
              </div>
            </div>

            {pokemon.image && (
              <Image
                src={pokemon.image}
                alt={pokemon.name}
                width={180}
                height={180}
                className={styles.image}
              />
            )}
          </div>

          <dl className={styles.grid}>
            <div>
              <dt>Max CP</dt>
              <dd>{pokemon.maxCP}</dd>
            </div>
            <div>
              <dt>Max HP</dt>
              <dd>{pokemon.maxHP}</dd>
            </div>
            <div>
              <dt>Flee Rate</dt>
              <dd>
                {Number.isFinite(pokemon.fleeRate) ? `${Math.round(pokemon.fleeRate * 100)}%` : "-"}
              </dd>
            </div>
            <div>
              <dt>Height</dt>
              <dd>
                {pokemon.height.minimum} - {pokemon.height.maximum}
              </dd>
            </div>
            <div>
              <dt>Weight</dt>
              <dd>
                {pokemon.weight.minimum} - {pokemon.weight.maximum}
              </dd>
            </div>
          </dl>

          <div className={styles.twoColumn}>
            <section className={`${styles.panel} ${styles.fastPanel}`}>
              <h3>Fast Attacks</h3>
              {pokemon.attacks.fast.length === 0 ? (
                <p className={styles.muted}>No attacks available.</p>
              ) : (
                <ul className={styles.list}>
                  {pokemon.attacks.fast.map((attack) => (
                    <li key={`fast-${attack.name}-${attack.type}`}>
                      <strong>{attack.name}</strong>
                      <span className={styles.attackInfo}>
                        <span
                          className={`${styles.typeBadge} ${styles.attackTypeBadge} ${getTypeClassName(attack.type)}`}
                        >
                          {attack.type}
                        </span>
                        <span className={styles.attackDamage}>DMG {attack.damage}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>

            <section className={`${styles.panel} ${styles.specialPanel}`}>
              <h3>Special Attacks</h3>
              {pokemon.attacks.special.length === 0 ? (
                <p className={styles.muted}>No attacks available.</p>
              ) : (
                <ul className={styles.list}>
                  {pokemon.attacks.special.map((attack) => (
                    <li key={`special-${attack.name}-${attack.type}`}>
                      <strong>{attack.name}</strong>
                      <span className={styles.attackInfo}>
                        <span
                          className={`${styles.typeBadge} ${styles.attackTypeBadge} ${getTypeClassName(attack.type)}`}
                        >
                          {attack.type}
                        </span>
                        <span className={styles.attackDamage}>DMG {attack.damage}</span>
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </div>

          <div className={styles.twoColumn}>
            <section className={`${styles.panel} ${styles.resistantPanel}`}>
              <h3>Resistant</h3>
              <div className={styles.tags}>
                {pokemon.resistant.map((value) => (
                  <span key={`res-${value}`} className={`${styles.typeBadge} ${getTypeClassName(value)}`}>
                    {value}
                  </span>
                ))}
              </div>
            </section>

            <section className={`${styles.panel} ${styles.weaknessPanel}`}>
              <h3>Weaknesses</h3>
              <div className={styles.tags}>
                {pokemon.weaknesses.map((value) => (
                  <span key={`weak-${value}`} className={`${styles.typeBadge} ${getTypeClassName(value)}`}>
                    {value}
                  </span>
                ))}
              </div>
            </section>
          </div>

          <section className={styles.panel}>
            <h3>Evolutions</h3>
            <p className={styles.muted}>
              Requirement:{" "}
              {pokemon.evolutionRequirements
                ? `${pokemon.evolutionRequirements.amount} ${pokemon.evolutionRequirements.name}`
                : "None"}
            </p>
            {pokemon.evolutions && pokemon.evolutions.length > 0 ? (
              <div className={styles.tags}>
                {pokemon.evolutions.map((evolution) => (
                  <button
                    type="button"
                    className={`${styles.linkButton} ${styles.evolutionButton}`}
                    onClick={() => updateSearch(evolution.name)}
                    key={evolution.id}
                  >
                    {evolution.name}
                  </button>
                ))}
              </div>
            ) : (
              <p className={styles.muted}>No further evolutions.</p>
            )}
          </section>
        </section>
      )}
    </>
  );
}

export default function Home() {
  return (
    <main className={styles.page}>
      <Suspense fallback={null}>
        <HomeContent />
      </Suspense>
    </main>
  );
}
