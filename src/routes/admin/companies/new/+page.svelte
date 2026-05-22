<script lang="ts">
  import { enhance } from "$app/forms";
  import { Building2 } from "@lucide/svelte";

  let { form } = $props();
</script>

<div class="max-w-lg mx-auto">
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h1 class="card-title">Nuova Azienda</h1>

      <form method="POST" use:enhance class="space-y-4">
        <label class="form-control">
          <span class="label-text">Nome Azienda</span>
          <input type="text" name="name" class="input input-bordered" required />
        </label>
        <label class="form-control">
          <span class="label-text">Indirizzo</span>
          <input type="text" name="address" class="input input-bordered" />
        </label>
        <div class="grid grid-cols-2 gap-3">
          <label class="form-control">
            <span class="label-text">Città</span>
            <input type="text" name="city" class="input input-bordered" />
          </label>
          <label class="form-control">
            <span class="label-text">Partita IVA</span>
            <input type="text" name="vat" class="input input-bordered" />
          </label>
        </div>
        <label class="form-control">
          <span class="label-text">Telefono</span>
          <input type="tel" name="phone" class="input input-bordered" />
        </label>

        {#if form?.error}
          <p class="text-error text-sm">{form.error}</p>
        {/if}

        <div class="card-actions justify-end">
          <a href="/admin/companies" class="btn btn-ghost">Annulla</a>
          <button type="submit" class="btn btn-primary">
            <Building2 size={18} /> Crea Azienda
          </button>
        </div>
      </form>
    </div>
  </div>
</div>
