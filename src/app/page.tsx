import styles from "./page.module.css";

export default function Home() {
  return (
    <main className={styles.page}>
      <section className={styles.box}>
        <h1>Search Pokemon</h1>
        <p className={styles.help}>Layout-only version. Data query wiring will be added next.</p>

        <form className={styles.form} action="/" method="get">
          <input name="name" type="text" placeholder="bulbasaur" autoComplete="off" />
          <button type="submit">Search</button>
        </form>
      </section>

      <section className={styles.box}>
        <h2>Result Area</h2>
        <p className={styles.muted}>
          This block will show loading, not-found, and selected Pokemon details.
        </p>

        <div className={styles.panel}>
          <h3>Pokemon Summary</h3>
          <p className={styles.muted}>Name, type, image, and core stats.</p>
        </div>

        <div className={styles.twoColumn}>
          <section className={styles.panel}>
            <h3>Attacks</h3>
            <ul className={styles.list}>
              <li>
                <strong>Fast attacks</strong>
                <span>placeholder</span>
              </li>
              <li>
                <strong>Special attacks</strong>
                <span>placeholder</span>
              </li>
            </ul>
          </section>

          <section className={styles.panel}>
            <h3>Evolutions</h3>
            <p className={styles.muted}>
              Evolution names will be clickable and update the search query param.
            </p>
          </section>
        </div>
      </section>
    </main>
  );
}
