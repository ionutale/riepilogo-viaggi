<script lang="ts">
  import type { PageProps } from "./$types";
  import { enhance } from "$app/forms";
  import { Calendar, Plus, ArrowRight, Truck, User } from "@lucide/svelte";

  let { data }: PageProps = $props();
  let tripsheets = $derived(data.tripsheets);
  let drivers = $derived(data.drivers);
  let trucks = $derived(data.trucks);

  let showCreate = $state(false);
  let newDriver = $state("");
  let newTruck = $state("");
  let newWeekStart = $state("");
  let newStartKm = $state("");
  let newEndKm = $state("");

  let weeklyKm = $derived(
    newStartKm && newEndKm ? Number(newEndKm) - Number(newStartKm) : 0,
  );

  function getMonday(d: Date): string {
    const date = new Date(d);
    const day = date.getDay();
    const diff = date.getDate() - day + (day === 0 ? -6 : 1);
    date.setDate(diff);
    return date.toISOString().split("T")[0];
  }

  $effect(() => {
    if (!newWeekStart) {
      newWeekStart = getMonday(new Date());
    }
  });
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold">Schede Settimanali</h1>
    <button class="btn btn-primary" onclick={() => (showCreate = !showCreate)}>
      <Plus size={18} /> Nuova Scheda
    </button>
  </div>

  {#if showCreate}
    <form method="POST" action="?/create" use:enhance class="card bg-base-100 border border-base-300">
      <div class="card-body">
        <h2 class="card-title">Nuova Scheda Settimanale</h2>
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <label class="form-control w-full">
            <span class="label-text"><User size={14} class="inline" /> Autista</span>
            <select class="select select-bordered" bind:value={newDriver}>
              <option value="">Seleziona autista...</option>
              {#each drivers as d}
                <option value={d.id}>{d.name}</option>
              {/each}
            </select>
          </label>

          <label class="form-control w-full">
            <span class="label-text"><Truck size={14} class="inline" /> Targa</span>
            <select class="select select-bordered" bind:value={newTruck}>
              <option value="">Seleziona targa...</option>
              {#each trucks as t}
                <option value={t.id}>{t.licensePlate}</option>
              {/each}
            </select>
          </label>

          <label class="form-control w-full">
            <span class="label-text"><Calendar size={14} class="inline" /> Settimana dal</span>
            <input type="date" class="input input-bordered" bind:value={newWeekStart} />
          </label>

          <label class="form-control w-full">
            <span class="label-text">KM Partenza</span>
            <input type="number" class="input input-bordered" bind:value={newStartKm} />
          </label>

          <label class="form-control w-full">
            <span class="label-text">KM Arrivo</span>
            <input type="number" class="input input-bordered" bind:value={newEndKm} />
          </label>

          <label class="form-control w-full">
            <span class="label-text">KM Totali (calcolati)</span>
            <input type="text" class="input input-bordered" value={weeklyKm ? `${weeklyKm} km` : ""} disabled />
          </label>
        </div>

        <input type="hidden" name="driverId" value={newDriver} />
        <input type="hidden" name="truckId" value={newTruck} />
        <input type="hidden" name="weekStartDate" value={newWeekStart} />
        <input type="hidden" name="startKm" value={newStartKm} />
        <input type="hidden" name="endKm" value={newEndKm} />

        <div class="card-actions justify-end mt-4">
          <button type="button" class="btn btn-ghost" onclick={() => (showCreate = false)}>Annulla</button>
          <button type="submit" class="btn btn-primary">Crea Scheda</button>
        </div>
      </div>
    </form>
  {/if}

  {#if tripsheets.length === 0}
    <div class="card bg-base-100 border border-base-300">
      <div class="card-body text-center py-12">
        <Calendar size={48} class="mx-auto text-base-content/30" />
        <p class="text-base-content/50 mt-4">Nessuna scheda settimanale. Creane una nuova!</p>
      </div>
    </div>
  {:else}
    <div class="overflow-x-auto">
      <table class="table table-zebra">
        <thead>
          <tr>
            <th>Settimana</th>
            <th>Autista</th>
            <th>Targa</th>
            <th class="text-right">KM Partenza</th>
            <th class="text-right">KM Arrivo</th>
            <th class="text-right">KM Totali</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {#each tripsheets as ts}
            <tr class="hover">
              <td>
                {new Date(ts.weekStartDate).toLocaleDateString("it-IT", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </td>
              <td>
                <a href="/{ts.id}" class="link link-hover">{drivers.find((d: { id: number }) => d.id === ts.driverId)?.name ?? "—"}</a>
              </td>
              <td>{trucks.find((t: { id: number }) => t.id === ts.truckId)?.licensePlate ?? "—"}</td>
              <td class="text-right">{ts.startKm.toLocaleString()}</td>
              <td class="text-right">{ts.endKm.toLocaleString()}</td>
              <td class="text-right font-medium">{(ts.endKm - ts.startKm).toLocaleString()} km</td>
              <td>
                <a href="/{ts.id}" class="btn btn-ghost btn-sm">
                  <ArrowRight size={16} />
                </a>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  {/if}
</div>
