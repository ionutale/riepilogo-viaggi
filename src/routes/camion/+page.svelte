<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { Truck, Plus, Pencil, Trash2 } from "@lucide/svelte";

  let { data } = $props();
  let trucks = $derived(data.trucks);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Camion</h1>
    <a href="/camion/new" class="btn btn-primary">
      <Plus size={18} /> Nuovo Camion
    </a>
  </div>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead><tr><th>Targa</th><th class="w-24"></th></tr></thead>
      <tbody>
        {#each trucks as t}
          <tr class="hover">
            <td class="font-mono">{t.licensePlate}</td>
            <td>
              <div class="flex gap-1">
                <a href="/camion/{t.id}" class="btn btn-ghost btn-xs"><Pencil size={14} /></a>
                <form method="POST" use:enhance>
                  <input type="hidden" name="id" value={t.id} />
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
