<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { Users, Plus, Pencil, Trash2 } from "@lucide/svelte";

  let { data } = $props();
  let drivers = $derived(data.drivers);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Dipendenti</h1>
    <a href="/dipendenti/new" class="btn btn-primary">
      <Plus size={18} /> Nuovo Dipendente
    </a>
  </div>

  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead>
        <tr><th>Nome</th><th class="w-24"></th></tr>
      </thead>
      <tbody>
        {#each drivers as d}
          <tr class="hover">
            <td>{d.name}</td>
            <td>
              <div class="flex gap-1">
                <a href="/dipendenti/{d.id}" class="btn btn-ghost btn-xs"><Pencil size={14} /></a>
                <form method="POST" use:enhance>
                  <input type="hidden" name="id" value={d.id} />
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
