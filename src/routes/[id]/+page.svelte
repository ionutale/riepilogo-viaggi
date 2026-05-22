<script lang="ts">
  import type { PageProps } from "./$types";
  import type { DayStatus } from "$lib/types";
  import { enhance } from "$app/forms";
  import DayEntry from "$lib/components/DayEntry.svelte";
  import {
    Save,
    Printer,
    Trash2,
    RotateCcw,
    Fuel,
    Gauge,
    Euro,
  } from "@lucide/svelte";

  interface DayState {
    dayOfWeek: number;
    dayStatus: DayStatus;
    clientId: number | null;
    dailyKm: number | null;
    notes: string | null;
    stops: { fromLocation: string; toLocation: string }[];
    fuelings: { liters: string; cost: string }[];
  }

  let { data }: PageProps = $props();
  let ts = $derived(data.ts);
  let drivers = $derived(data.drivers);
  let trucks = $derived(data.trucks);
  let clients = $derived(data.clients);

  let header = $state({ driverId: 0, truckId: 0, startKm: 0, endKm: 0 });
  let days = $state<DayState[]>([]);

  $effect(() => {
    header = {
      driverId: ts.driverId,
      truckId: ts.truckId,
      startKm: ts.startKm,
      endKm: ts.endKm,
    };
    days = ts.dailyEntries.map((e) => ({
      dayOfWeek: e.dayOfWeek,
      dayStatus: e.dayStatus as DayStatus,
      clientId: e.clientId,
      dailyKm: e.dailyKm,
      notes: e.notes,
      stops: e.stops.map((s) => ({ fromLocation: s.fromLocation, toLocation: s.toLocation })),
      fuelings: e.fuelings.map((f) => ({ liters: String(f.liters), cost: String(f.cost) })),
    }));
  });

  let weeklyKm = $derived(header.endKm - header.startKm);

  let totals = $derived({
    km: days.reduce((s, d) => s + (d.dayStatus === "working" ? d.dailyKm ?? 0 : 0), 0),
    liters: days.reduce(
      (s, d) => s + (d.dayStatus === "working" ? d.fuelings.reduce((fs, f) => fs + (Number(f.liters) || 0), 0) : 0),
      0,
    ),
    cost: days.reduce(
      (s, d) => s + (d.dayStatus === "working" ? d.fuelings.reduce((fs, f) => fs + (Number(f.cost) || 0), 0) : 0),
      0,
    ),
  });

  let saving = $state(false);

  function buildPayload() {
    return JSON.stringify({
      header: {
        driverId: header.driverId,
        truckId: header.truckId,
        startKm: header.startKm,
        endKm: header.endKm,
      },
      days: days.map((d) => ({
        dayOfWeek: d.dayOfWeek,
        dayStatus: d.dayStatus,
        clientId: d.clientId,
        dailyKm: d.dailyKm,
        notes: d.notes,
        stops: d.stops.filter((s) => s.fromLocation || s.toLocation),
        fuelings: d.fuelings.filter((f) => f.liters || f.cost),
      })),
    });
  }

  function handlePrint() {
    window.print();
  }

  function resetDays() {
    days = days.map((d) => ({
      ...d,
      dayStatus: "working",
      clientId: null,
      dailyKm: null,
      notes: null,
      stops: [],
      fuelings: [],
    }));
  }

  let payload = $derived(buildPayload());
</script>

<div class="space-y-4 print:space-y-2">
  <!-- Header form -->
  <div class="card bg-base-100 border border-base-300 print:border-none print:shadow-none">
    <div class="card-body p-4">
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        <label class="form-control">
          <span class="label-text">Autista</span>
          <select class="select select-bordered select-sm" bind:value={header.driverId}>
            {#each drivers as d}
              <option value={d.id}>{d.name}</option>
            {/each}
          </select>
        </label>

        <label class="form-control">
          <span class="label-text">Targa</span>
          <select class="select select-bordered select-sm" bind:value={header.truckId}>
            {#each trucks as t}
              <option value={t.id}>{t.licensePlate}</option>
            {/each}
          </select>
        </label>

        <label class="form-control">
          <span class="label-text">KM Partenza</span>
          <input
            type="number"
            class="input input-bordered input-sm"
            bind:value={header.startKm}
          />
        </label>

        <label class="form-control">
          <span class="label-text">KM Arrivo</span>
          <input
            type="number"
            class="input input-bordered input-sm"
            bind:value={header.endKm}
          />
        </label>

        <label class="form-control">
          <span class="label-text">KM Totali</span>
          <input
            type="text"
            class="input input-bordered input-sm"
            value={weeklyKm.toLocaleString()}
            disabled
          />
        </label>
      </div>
    </div>
  </div>

  <!-- Day entries: mobile cards, desktop table -->
  <div class="sm:hidden space-y-3">
    {#each days as day, i}
      <DayEntry
        {clients}
        dayOfWeek={day.dayOfWeek}
        bind:entry={days[i]}
      />
    {/each}
  </div>

  <!-- Desktop table -->
  <div class="hidden sm:block overflow-x-auto print:block">
    <table class="table table-zebra table-sm print:table-auto">
      <thead>
        <tr class="print:text-xs">
          <th class="w-24">Giorno</th>
          <th>Cliente</th>
          <th>Percorso</th>
          <th class="w-16 text-right">Km</th>
          <th class="w-20">Gasolio</th>
          <th class="w-28">Note</th>
        </tr>
      </thead>
      <tbody>
        {#each days as day, i}
          {@const entry = days[i]}
          {@const isNonWorking = entry.dayStatus !== "working"}
          <tr class="{isNonWorking ? 'opacity-50 bg-base-200' : ''} print:text-xs">
            <td>
              <select
                class="select select-ghost select-xs font-medium"
                bind:value={entry.dayStatus}
              >
                <option value="working">Lun</option>
                <option value="festa">✝ Festa</option>
                <option value="ferie">🌴 Ferie</option>
                <option value="riposo">🛌 Riposo</option>
              </select>
            </td>
            <td>
              {#if !isNonWorking}
                <select class="select select-ghost select-xs w-full" bind:value={entry.clientId}>
                  <option value={null}>—</option>
                  {#each clients as c}
                    <option value={c.id}>{c.name}</option>
                  {/each}
                </select>
              {/if}
            </td>
            <td>
              {#if !isNonWorking}
                <div class="space-y-0.5">
                  {#each entry.stops as stop, si}
                    <div class="flex items-center gap-1 text-xs">
                      <input
                        type="text"
                        placeholder="Da"
                        class="input input-ghost input-xs w-16 p-0"
                        bind:value={entry.stops[si].fromLocation}
                      />
                      <span>→</span>
                      <input
                        type="text"
                        placeholder="A"
                        class="input input-ghost input-xs w-16 p-0"
                        bind:value={entry.stops[si].toLocation}
                      />
                    </div>
                  {/each}
                  <button
                    class="btn btn-ghost btn-xs text-primary"
                    onclick={() => entry.stops = [...entry.stops, { fromLocation: "", toLocation: "" }]}
                  >
                    + Tappa
                  </button>
                </div>
              {/if}
            </td>
            <td class="text-right">
              {#if !isNonWorking}
                <input
                  type="number"
                  class="input input-ghost input-xs w-16 text-right"
                  bind:value={entry.dailyKm}
                />
              {/if}
            </td>
            <td>
              {#if !isNonWorking}
                <div class="space-y-0.5">
                  {#each entry.fuelings as f, fi}
                    <div class="flex items-center gap-1 text-xs">
                      <input
                        type="number"
                        step="0.1"
                        placeholder="L"
                        class="input input-ghost input-xs w-12"
                        bind:value={entry.fuelings[fi].liters}
                      />
                      <input
                        type="number"
                        step="0.01"
                        placeholder="€"
                        class="input input-ghost input-xs w-14"
                        bind:value={entry.fuelings[fi].cost}
                      />
                    </div>
                  {/each}
                  <button
                    class="btn btn-ghost btn-xs text-primary"
                    onclick={() => entry.fuelings = [...entry.fuelings, { liters: "", cost: "" }]}
                  >
                    + Gasolio
                  </button>
                </div>
              {/if}
            </td>
            <td>
              {#if !isNonWorking}
                <textarea
                  class="textarea textarea-ghost textarea-xs w-full"
                  rows={1}
                  bind:value={entry.notes}
                ></textarea>
              {:else}
                <span class="text-xs italic">
                  {#if entry.dayStatus === "festa"}Festa{/if}
                  {#if entry.dayStatus === "ferie"}Ferie{/if}
                  {#if entry.dayStatus === "riposo"}Riposo{/if}
                </span>
              {/if}
            </td>
          </tr>
        {/each}
      </tbody>
    </table>
  </div>

  <!-- Totals footer -->
  <div class="card bg-base-100 border border-base-300 print:border-none">
    <div class="card-body p-4">
      <div class="flex flex-wrap gap-6 justify-around">
        <div class="stat">
          <div class="stat-figure text-primary">
            <Gauge size={24} />
          </div>
          <div class="stat-title">Km Totali</div>
          <div class="stat-value text-2xl">{totals.km.toLocaleString()} <span class="text-sm">km</span></div>
        </div>
        <div class="stat">
          <div class="stat-figure text-accent">
            <Fuel size={24} />
          </div>
          <div class="stat-title">Gasolio</div>
          <div class="stat-value text-2xl">{totals.liters.toLocaleString(undefined, { maximumFractionDigits: 1 })} <span class="text-sm">L</span></div>
        </div>
        <div class="stat">
          <div class="stat-figure text-secondary">
            <Euro size={24} />
          </div>
          <div class="stat-title">Costo</div>
          <div class="stat-value text-2xl">€ {totals.cost.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
        </div>
      </div>
    </div>
  </div>

  <!-- Actions -->
  <div class="flex flex-wrap gap-2 justify-between print:hidden">
    <form method="POST" action="?/delete" use:enhance>
      <button type="submit" class="btn btn-ghost btn-error">
        <Trash2 size={18} /> Elimina
      </button>
    </form>

    <div class="flex gap-2">
      <button class="btn btn-ghost" onclick={resetDays}>
        <RotateCcw size={18} /> Azzera
      </button>
      <button class="btn btn-ghost" onclick={handlePrint}>
        <Printer size={18} /> Stampa
      </button>

      <form method="POST" action="?/save" use:enhance>
        <input type="hidden" name="payload" value={payload} />
        <button type="submit" class="btn btn-primary">
          <Save size={18} /> Salva
        </button>
      </form>
    </div>
  </div>
</div>
