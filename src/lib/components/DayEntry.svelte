<script lang="ts">
  import type { Client, DayStatus, DailyEntryWithRelations, Stop, Fueling } from "$lib/types";
  import StopInput from "./StopInput.svelte";
  import FuelingInput from "./FuelingInput.svelte";
  import { Calendar } from "@lucide/svelte";

  const DAY_NAMES = ["Lunedì", "Martedì", "Mercoledì", "Giovedì", "Venerdì", "Sabato", "Domenica"];

  let {
    dayOfWeek,
    clients,
    entry = $bindable(),
    compact = false,
  }: {
    dayOfWeek: number;
    clients: Client[];
    entry: {
      dayStatus: DayStatus;
      clientId: number | null;
      dailyKm: number | null;
      notes: string | null;
      stops: { fromLocation: string; toLocation: string }[];
      fuelings: { liters: string; cost: string }[];
    };
    compact?: boolean;
  } = $props();

  const statusOptions: { value: DayStatus; label: string }[] = [
    { value: "working", label: "Lavorativo" },
    { value: "festa", label: "Festa" },
    { value: "ferie", label: "Ferie" },
    { value: "riposo", label: "Riposo" },
  ];

  let isNonWorking = $derived(entry.dayStatus !== "working");
  let isPast = $derived(dayOfWeek < new Date().getDay() - 1);
</script>

<div
  class="card bg-base-100 border {isNonWorking ? 'border-base-200 opacity-60' : 'border-base-300'}"
>
  <div class="card-body p-3 sm:p-4">
    <div class="flex items-center justify-between mb-2">
      <div class="flex items-center gap-2">
        <Calendar size={16} class="text-primary" />
        <span class="font-semibold text-sm">{DAY_NAMES[dayOfWeek]}</span>
      </div>
      <select
        class="select select-bordered select-xs"
        value={entry.dayStatus}
        onchange={(e) => (entry.dayStatus = e.currentTarget.value as DayStatus)}
      >
        {#each statusOptions as opt}
          <option value={opt.value}>{opt.label}</option>
        {/each}
      </select>
    </div>

    {#if !isNonWorking}
      <div class="space-y-2">
        <div class="flex flex-wrap gap-2">
          <select
            class="select select-bordered select-sm flex-1 min-w-0"
            value={entry.clientId ?? ""}
            onchange={(e) => (entry.clientId = e.currentTarget.value ? Number(e.currentTarget.value) : null)}
          >
            <option value="">Cliente...</option>
            {#each clients as c}
              <option value={c.id}>{c.name}</option>
            {/each}
          </select>

          <input
            type="number"
            min="0"
            placeholder="Km"
            class="input input-bordered input-sm w-20"
            value={entry.dailyKm ?? ""}
            oninput={(e) => (entry.dailyKm = e.currentTarget.value ? Number(e.currentTarget.value) : null)}
          />
        </div>

        <StopInput bind:stops={entry.stops} />
        <FuelingInput bind:fuelings={entry.fuelings} />

        <textarea
          class="textarea textarea-bordered textarea-sm w-full"
          placeholder="Note..."
          rows={1}
          value={entry.notes ?? ""}
          oninput={(e) => (entry.notes = e.currentTarget.value || null)}
        ></textarea>
      </div>
    {:else}
      <p class="text-xs text-base-content/50 italic">
        {#if entry.dayStatus === "festa"}Giorno festivo{:else if entry.dayStatus === "ferie"}Giorno di ferie{:else}Giorno di riposo{/if}
      </p>
    {/if}
  </div>
</div>
