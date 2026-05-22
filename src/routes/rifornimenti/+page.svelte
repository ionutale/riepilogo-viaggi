<script lang="ts">
  import type { PageProps } from "./$types";
  import { Fuel, Search } from "@lucide/svelte";
  import { goto } from "$app/navigation";
  import { page } from "$app/stores";

  let { data } = $props();
  let fuelings = $derived(data.fuelings);
  let trucks = $derived(data.trucks);
  let drivers = $derived(data.drivers);
  let filters = $derived(data.filters);

  const DAY_NAMES = ["Lun", "Mar", "Mer", "Gio", "Ven", "Sab", "Dom"];

  function formatDate(dateStr: string, dayOfWeek: number): string {
    const d = new Date(dateStr);
    const day = new Date(d);
    day.setDate(d.getDate() + dayOfWeek);
    return day.toLocaleDateString("it-IT", { day: "numeric", month: "short", year: "numeric" });
  }

  function applyFilter(key: string, value: string) {
    const params = new URLSearchParams($page.url.searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    goto(`/rifornimenti?${params}`);
  }
</script>

<div class="space-y-6">
  <div class="flex items-center justify-between">
    <h1 class="text-2xl font-bold"><Fuel size={24} class="inline" /> Rifornimenti</h1>
  </div>

  <div class="flex gap-2 flex-wrap">
    <select
      class="select select-bordered select-sm"
      value={filters.truckId ?? ""}
      onchange={(e) => applyFilter("truckId", e.currentTarget.value)}
    >
      <option value="">Tutti i camion</option>
      {#each trucks as t}
        <option value={t.id}>{t.licensePlate}</option>
      {/each}
    </select>
    <select
      class="select select-bordered select-sm"
      value={filters.driverId ?? ""}
      onchange={(e) => applyFilter("driverId", e.currentTarget.value)}
    >
      <option value="">Tutti gli autisti</option>
      {#each drivers as d}
        <option value={d.id}>{d.name}</option>
      {/each}
    </select>
  </div>

  <div class="overflow-x-auto">
    <table class="table table-zebra table-sm">
      <thead>
        <tr>
          <th>Data</th><th>Autista</th><th>Camion</th><th class="text-right">Km</th><th class="text-right">Litri</th><th class="text-right">Costo</th><th class="text-right">€/L</th>
        </tr>
      </thead>
      <tbody>
        {#each fuelings as f}
          <tr>
            <td>{formatDate(f.date, f.dayOfWeek)}</td>
            <td>{f.driverName}</td>
            <td class="font-mono">{f.truckPlate}</td>
            <td class="text-right">{f.dailyKm?.toLocaleString() ?? "—"}</td>
            <td class="text-right">{Number(f.liters).toLocaleString(undefined, { maximumFractionDigits: 1 })}</td>
            <td class="text-right">€ {Number(f.cost).toLocaleString(undefined, { minimumFractionDigits: 2 })}</td>
            <td class="text-right">
              {Number(f.liters) > 0
                ? `€ ${(Number(f.cost) / Number(f.liters)).toLocaleString(undefined, { minimumFractionDigits: 3, maximumFractionDigits: 3 })}`
                : "—"}
            </td>
          </tr>
        {/each}
        {#if fuelings.length === 0}
          <tr><td colspan="7" class="text-center text-base-content/50">Nessun rifornimento</td></tr>
        {/if}
      </tbody>
    </table>
  </div>
</div>
