<script lang="ts">
  import type { PageProps } from "./$types";
  import { Building2, Plus, Users } from "@lucide/svelte";

  let { data } = $props();
  let companies = $derived(data.companies);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Aziende</h1>
    <a href="/admin/companies/new" class="btn btn-primary">
      <Plus size={18} /> Nuova Azienda
    </a>
  </div>

  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr>
          <th>Nome</th>
          <th>Partita IVA</th>
          <th>Città</th>
          <th>Membri</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        {#each companies as c}
          <tr class="hover">
            <td><a href="/admin/companies/{c.id}" class="link link-hover font-medium">{c.name}</a></td>
            <td>{c.vat}</td>
            <td>{c.city}</td>
            <td><Users size={16} class="inline" /> {c.memberCount}</td>
            <td><a href="/admin/companies/{c.id}" class="btn btn-ghost btn-sm">Dettagli</a></td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
