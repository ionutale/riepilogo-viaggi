<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { Save } from "@lucide/svelte";

  let { data, form } = $props();
  let driver = $derived(data.driver);
</script>

<div class="max-w-md mx-auto">
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h1 class="card-title">Modifica Dipendente</h1>
      {#if driver}
        <form method="POST" use:enhance class="space-y-4">
          <label class="form-control">
            <span class="label-text">Nome</span>
            <input type="text" name="name" class="input input-bordered" value={driver.name} required />
          </label>
          {#if form?.error}<p class="text-error text-sm">{form.error}</p>{/if}
          <div class="card-actions justify-end">
            <a href="/dipendenti" class="btn btn-ghost">Annulla</a>
            <button type="submit" class="btn btn-primary"><Save size={18} /> Salva</button>
          </div>
        </form>
      {:else}
        <p class="text-base-content/50">Dipendente non trovato</p>
      {/if}
    </div>
  </div>
</div>
