<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { Mail, Shield, User } from "@lucide/svelte";

  let { data, form } = $props();
  let company = $derived(data.company);
  let members = $derived(data.members);
</script>

<div class="space-y-6">
  <a href="/admin/companies" class="link link-hover text-sm">&larr; Tutte le aziende</a>

  {#if !company}
    <p class="text-base-content/50">Azienda non trovata</p>
  {:else}
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h1 class="card-title text-2xl">{company.name}</h1>
        <div class="grid grid-cols-2 gap-4 text-sm">
          <div><span class="font-medium">Indirizzo:</span> {company.address}, {company.city}</div>
          <div><span class="font-medium">Partita IVA:</span> {company.vat}</div>
          <div><span class="font-medium">Telefono:</span> {company.phone}</div>
        </div>
      </div>
    </div>

    <div class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h2 class="card-title"><User size={18} /> Membri</h2>
        <div class="overflow-x-auto">
          <table class="table table-sm">
            <thead>
              <tr><th>Nome</th><th>Email</th><th>Ruolo</th></tr>
            </thead>
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
          <label class="form-control">
            <span class="label-text">Ruolo</span>
            <select name="role" class="select select-bordered select-sm">
              <option value="member">Membro</option>
              <option value="admin">Admin</option>
            </select>
          </label>
          <button type="submit" class="btn btn-primary btn-sm">Invita</button>
        </form>
        {#if form?.error}
          <p class="text-error text-sm mt-2">{form.error}</p>
        {/if}
      </div>
    </div>
  {/if}
</div>
