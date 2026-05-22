<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { Link, Plus, Pencil, Trash2 } from "@lucide/svelte";

  let { data } = $props();
  let trailers = $derived(data.trailers);
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Rimorchi</h1>
    <a href="/rimorchi/new" class="btn btn-primary">
      <Plus size={18} /> Nuovo Rimorchio
    </a>
  </div>
  <div class="overflow-x-auto">
    <table class="table table-zebra">
      <thead><tr><th>Targa</th><th class="w-24"></th></tr></thead>
      <tbody>
        {#each trailers as tr}
          <tr class="hover">
            <td class="font-mono">{tr.licensePlate}</td>
            <td>
              <div class="flex gap-1">
                <a href="/rimorchi/{tr.id}" class="btn btn-ghost btn-xs"><Pencil size={14} /></a>
                <form method="POST" use:enhance>
                  <input type="hidden" name="id" value={tr.id} />
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
