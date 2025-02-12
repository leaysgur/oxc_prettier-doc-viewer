<script lang="ts">
  import { formatOxc, formatPrettier } from "$lib/formatter";

  let fileName = $state("example.ts");
  let source = $state("let a:number=1");
  const formatPromise = $derived(
    Promise.all([formatOxc(source, fileName), formatPrettier(source, fileName)]),
  );
</script>

<div class="main">
  <div>
    <input type="text" bind:value={fileName} />
    <textarea bind:value={source}></textarea>
  </div>

  {#await formatPromise}
    <p>Formatting...</p>
  {:then [oxc, prettier]}
    <div>
      {@render result("Doc AST", [oxc.docAst, prettier.docAst])}
      {@render result("Doc", [oxc.doc, prettier.doc])}
      {@render result("Formatted", [oxc.formatted, prettier.formatted])}
    </div>
  {:catch err}
    <p>{err.message}</p>
  {/await}
</div>

{#snippet result(label: string, [oxc, prettier]: [string, string])}
  <details open>
    <summary>{label}</summary>
    <section>
      <pre class="oxc" data-label="oxc">{oxc}</pre>
      <pre class="prettier" data-label="prettier@3.5.0">{prettier}</pre>
    </section>
  </details>
{/snippet}

<style>
  .main {
    display: grid;
    grid-template-columns: 200px 1fr;
    gap: 0.5rem;
    align-items: start;
  }

  textarea {
    box-sizing: border-box;
    min-height: 50vh;
    resize: vertical;
  }

  pre {
    position: relative;
    padding: 0.5rem;
    overflow-x: auto;
    font-size: 0.7rem;
    border: 1px solid var(--color);

    &.oxc {
      --color: #a00;
    }
    &.prettier {
      --color: #0a0;
    }

    &::before {
      content: attr(data-label);
      position: absolute;
      top: 0;
      right: 0;
      background-color: var(--color);
      padding: 0 0.5rem;
    }
  }

  div {
    display: grid;
    gap: 0.5rem;
  }

  section {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 0.5rem;
  }
</style>
