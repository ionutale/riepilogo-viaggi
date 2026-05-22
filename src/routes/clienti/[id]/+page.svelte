<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { Save } from "@lucide/svelte";

  let { data, form } = $props();
  let client = $derived(data.client);
</script>

<div class="max-w-lg mx-auto">
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h1 class="card-title">Modifica Cliente</h1>
      {#if client}
        <form method="POST" use:enhance class="space-y-4">
          <label class="form-control">
            <span class="label-text">Nome Azienda</span>
            <input type="text" name="name" class="input input-bordered" value={client.name} required />
          </label>
          <label class="form-control">
            <span class="label-text">Indirizzo</span>
            <input type="text" name="address" class="input input-bordered" value={client.address} />
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label class="form-control">
              <span class="label-text">Città</span>
              <input type="text" name="city" class="input input-bordered" value={client.city} />
            </label>
            <label class="form-control">
              <span class="label-text">Partita IVA</span>
              <input type="text" name="vat" class="input input-bordered" value={client.vat} />
            </label>
          </div>
          <label class="form-control">
            <span class="label-text">Telefono</span>
            <input type="tel" name="phone" class="input input-bordered" value={client.phone} />
          </label>
          {#if form?.error}<p class="text-error text-sm">{form.error}</p>{/if}
          <div class="card-actions justify-end">
            <a href="/clienti" class="btn btn-ghost">Annulla</a>
            <button type="submit" class="btn btn-primary"><Save size={18} /> Salva</button>
          </div>
        </form>
      {:else}
        <p class="text-base-content/50">Cliente non trovato</p>
      {/if}
    </div>
  </div>
</div>
