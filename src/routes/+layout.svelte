<script lang="ts">
  import { load } from "$lib/formatter";
  const { children } = $props();
</script>

<header>
  <h1>oxc_prettier Doc Viewer</h1>
  <a
    href="https://github.com/leaysgur/oxc_prettier-doc-viewer"
    target="_blank"
    rel="noopener noreferrer">GitHub</a
  >
</header>

<main>
  {#await load()}
    <p>Loading...</p>
  {:then}
    {@render children()}
  {:catch err}
    <p>{err.message}</p>
  {/await}
</main>

<style>
  :global(body) {
    font-family: monospace;
    margin: 0;
    padding: 0;
    background-color: #456;
    color: #def;
    accent-color: #cc0;
  }
  :global(a) {
    color: #cc0;
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.5rem;
    padding-block-end: 0;

    h1 {
      margin: 0;
      font-size: 1rem;
    }
  }

  main {
    padding: 0.5rem;
  }
</style>
