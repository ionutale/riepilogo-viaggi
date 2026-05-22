<script lang="ts">
  import { Plus, X, Fuel } from "@lucide/svelte";

  let {
    fuelings = $bindable([] as { liters: string; cost: string }[]),
  }: { fuelings: { liters: string; cost: string }[] } = $props();

  function addFueling() {
    fuelings = [...fuelings, { liters: "", cost: "" }];
  }

  function removeFueling(index: number) {
    fuelings = fuelings.filter((_, i) => i !== index);
  }

  function updateFueling(index: number, field: "liters" | "cost", value: string) {
    fuelings = fuelings.map((f, i) => (i === index ? { ...f, [field]: value } : f));
  }
</script>

<div class="space-y-1">
  {#each fuelings as fueling, i}
    <div class="flex items-center gap-1">
      <Fuel size={14} class="text-base-content/40 shrink-0" />
      <input
        type="number"
        step="0.1"
        min="0"
        placeholder="L"
        class="input input-bordered input-xs w-16"
        value={fueling.liters}
        oninput={(e) => updateFueling(i, "liters", e.currentTarget.value)}
      />
      <input
        type="number"
        step="0.01"
        min="0"
        placeholder="€"
        class="input input-bordered input-xs w-20"
        value={fueling.cost}
        oninput={(e) => updateFueling(i, "cost", e.currentTarget.value)}
      />
      <button class="btn btn-ghost btn-xs text-error" onclick={() => removeFueling(i)}>
        <X size={14} />
      </button>
    </div>
  {/each}
  <button class="btn btn-ghost btn-xs text-primary" onclick={addFueling}>
    <Plus size={14} /> Gasolio
  </button>
</div>
