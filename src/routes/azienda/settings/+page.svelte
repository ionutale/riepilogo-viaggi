<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { Settings, Save, Mail, User, Shield } from "@lucide/svelte";

  let { data, form } = $props();
  let company = $derived(data.company);
  let members = $derived(data.members);
</script>

<div class="space-y-6">
  <h1 class="text-2xl font-bold"><Settings size={24} class="inline" /> Gestione Azienda</h1>

  {#if company}
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h2 class="card-title">Profilo Azienda</h2>
        <form method="POST" action="?/update" use:enhance class="space-y-4">
          <label class="form-control">
            <span class="label-text">Nome Azienda</span>
            <input type="text" name="name" class="input input-bordered" value={company.name} required />
          </label>
          <label class="form-control">
            <span class="label-text">Indirizzo</span>
            <input type="text" name="address" class="input input-bordered" value={company.address} />
          </label>
          <div class="grid grid-cols-2 gap-3">
            <label class="form-control">
              <span class="label-text">Città</span>
              <input type="text" name="city" class="input input-bordered" value={company.city} />
            </label>
            <label class="form-control">
              <span class="label-text">Partita IVA</span>
              <input type="text" name="vat" class="input input-bordered" value={company.vat} />
            </label>
          </div>
          <label class="form-control">
            <span class="label-text">Telefono</span>
            <input type="tel" name="phone" class="input input-bordered" value={company.phone} />
          </label>
          {#if form?.error}<p class="text-error text-sm">{form.error}</p>{/if}
          <div class="card-actions">
            <button type="submit" class="btn btn-primary"><Save size={18} /> Salva</button>
          </div>
        </form>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h2 class="card-title"><User size={18} /> Membri</h2>
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead><tr><th>Nome</th><th>Email</th><th>Ruolo</th></tr></thead>
            <tbody>
              {#each members as m}
                <tr>
                  <td>{m.userName}</td>
                  <td>{m.userEmail}</td>
                  <td><Shield size={14} class="inline" /> {m.role}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h2 class="card-title"><Mail size={18} /> Invita un membro</h2>
        <form method="POST" action="?/invite" use:enhance class="flex gap-2 items-end">
          <label class="form-control flex-1">
            <span class="label-text">Email</span>
            <input type="email" name="email" class="input input-bordered input-sm" required />
          </label>
          <button type="submit" class="btn btn-primary btn-sm">Invita</button>
        </form>
        {#if form?.inviteSuccess}
          <p class="text-success text-sm mt-2">Invito inviato!</p>
        {/if}
        {#if form?.error}
          <p class="text-error text-sm mt-2">{form.error}</p>
        {/if}
      </div>
    </div>
  {:else}
    <p class="text-base-content/50">Nessuna azienda attiva</p>
  {/if}
</div>
