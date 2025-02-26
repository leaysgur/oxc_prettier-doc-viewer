<script lang="ts">
  import { formatOxc, formatPrettier } from "$lib/formatter";

  let fileName = $state("example.ts");
  let source = $state("let a:number=1");
  const formatPromise = $derived(
    Promise.all([formatOxc(source, fileName), formatPrettier(source, fileName)]),
  );

  // `detail` element cannot persist its state...
  let openStates: Record<string, boolean> = $state({
    "Doc AST": false,
    Doc: true,
    Formatted: true,
  });

  const copyOnClick = (node: HTMLDivElement) => {
    node.style.cursor = "pointer";
    node.title = "Click to copy";

    node.addEventListener("click", () => {
      const code = node.textContent ?? "";
      navigator.clipboard.writeText(code);
    });
  };
</script>

<div class="main">
  <div class="input">
    <input type="text" bind:value={fileName} />
    <textarea bind:value={source}></textarea>
  </div>

  {#await formatPromise}
    <p>Formatting...</p>
  {:then [oxc, prettier]}
    <div class="output">
      {@render result("Doc AST", [oxc.docAst, prettier.docAst])}
      {@render result("Doc", [oxc.doc, prettier.doc])}
      {@render result("Formatted", [oxc.formatted, prettier.formatted])}
    </div>
  {:catch err}
    <p>{err.message}</p>
  {/await}
</div>

{#snippet result(label: string, [oxc, prettier]: [string, string])}
  {@const isOpen = openStates[label]}

  <section>
    <a
      href="."
      onclick={(ev) => {
        ev.preventDefault();
        openStates[label] = !openStates[label];
      }}>[{isOpen ? "↓" : "→"}]</a
    >
    <h3>{label}</h3>
    {#if isOpen}
      <div class="col2">
        <div class="res oxc" data-label="oxc@local" use:copyOnClick>{@html oxc}</div>
        <div class="res prettier" data-label="prettier@3.5.0" use:copyOnClick>{@html prettier}</div>
      </div>
    {/if}
  </section>
{/snippet}

<style>
  .main {
    display: grid;
    grid-template-columns: 20% 1fr;
    gap: 0.5rem;
    align-items: start;
  }

  .input {
    position: sticky;
    top: 0;
    display: grid;
    gap: 0.5rem;
  }

  textarea {
    box-sizing: border-box;
    min-height: 50vh;
    resize: vertical;
  }

  .res {
    position: relative;
    overflow-x: auto;
    font-size: 0.7rem;
    border: 1px solid var(--color);
    min-height: 1rem;

    &.oxc {
      --color: #a8b1ff;
    }
    &.prettier {
      --color: #f8bc45;
    }

    &::before {
      content: attr(data-label);
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--color);
      color: initial;
      padding: 0 0.5rem;
    }

    :global(pre) {
      height: 100%;
      margin: 0;
    }
  }

  .output {
    display: grid;
    gap: 0.5rem;
  }

  h3 {
    margin: 0;
    display: inline;
  }

  .col2 {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
</style>
