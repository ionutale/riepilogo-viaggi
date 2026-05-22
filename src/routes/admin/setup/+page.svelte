<script lang="ts">
  import { enhance } from "$app/forms";
  import { Building2, UserPlus } from "@lucide/svelte";

  let { form } = $props();
</script>

<div class="min-h-[80vh] flex items-center justify-center">
  <div class="card bg-base-100 border border-base-300 w-full max-w-lg">
    <div class="card-body">
      <h1 class="card-title text-2xl justify-center mb-2">Configurazione Iniziale</h1>
      <p class="text-center text-sm text-base-content/60 mb-6">Crea l'account superadmin e la prima azienda</p>

      <form method="POST" class="space-y-4">
        <fieldset class="border border-base-300 rounded-box p-4">
          <legend class="font-semibold px-2">Account Superadmin</legend>
          <div class="space-y-3">
            <label class="form-control">
              <span class="label-text">Nome</span>
              <input type="text" name="name" class="input input-bordered" required />
            </label>
            <label class="form-control">
              <span class="label-text">Email</span>
              <input type="email" name="email" class="input input-bordered" required />
            </label>
            <label class="form-control">
              <span class="label-text">Password</span>
              <input type="password" name="password" class="input input-bordered" minlength={8} required />
            </label>
          </div>
        </fieldset>

        <fieldset class="border border-base-300 rounded-box p-4">
          <legend class="font-semibold px-2">Prima Azienda</legend>
          <div class="space-y-3">
            <label class="form-control">
              <span class="label-text">Nome Azienda</span>
              <input type="text" name="companyName" class="input input-bordered" required />
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
          </div>
        </fieldset>

        {#if form?.error}
          <p class="text-error text-sm">{form.error}</p>
        {/if}

        <button type="submit" class="btn btn-primary w-full">
          <Building2 size={18} /> Crea
        </button>
      </form>
    </div>
  </div>
</div>
