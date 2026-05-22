<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { Store, Plus, Pencil, Trash2 } from "@lucide/svelte";

  let { data } = $props();
  let clients = $derived(data.clients);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Clienti</h1>
    <a href="/clienti/new" class="btn btn-primary">
      <Plus size={18} /> Nuovo Cliente
    </a>
  </div>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead><tr><th>Nome</th><th>Città</th><th>Partita IVA</th><th class="w-24"></th></tr></thead>
      <tbody>
        {#each clients as c}
          <tr class="hover">
            <td class="font-medium">{c.name}</td>
            <td>{c.city}</td>
            <td class="font-mono text-sm">{c.vat}</td>
            <td>
              <div class="flex gap-1">
                <a href="/clienti/{c.id}" class="btn btn-ghost btn-xs"><Pencil size={14} /></a>
                <form method="POST" use:enhance>
                  <input type="hidden" name="id" value={c.id} />
                  <button type="submit" class="btn btn-ghost btn-xs text-error"><Trash2 size={14} /></button>
                </form>
              </div>
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>
</div>
