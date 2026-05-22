<script lang="ts">
  import { Plus, X } from "@lucide/svelte";

  let {
    stops = $bindable([] as { fromLocation: string; toLocation: string }[]),
  }: { stops: { fromLocation: string; toLocation: string }[] } = $props();

  function addStop() {
    stops = [...stops, { fromLocation: "", toLocation: "" }];
  }

  function removeStop(index: number) {
    stops = stops.filter((_, i) => i !== index);
  }

  function updateStop(index: number, field: "fromLocation" | "toLocation", value: string) {
    stops = stops.map((s, i) => (i === index ? { ...s, [field]: value } : s));
  }
</script>

<div class="space-y-1">
  {#each stops as stop, i}
    <div class="flex items-center gap-1">
      <input
        type="text"
        placeholder="Da"
        class="input input-bordered input-xs w-24"
        value={stop.fromLocation}
        oninput={(e) => updateStop(i, "fromLocation", e.currentTarget.value)}
      />
      <span class="text-xs text-base-content/50">→</span>
      <input
        type="text"
        placeholder="A"
        class="input input-bordered input-xs w-24"
        value={stop.toLocation}
        oninput={(e) => updateStop(i, "toLocation", e.currentTarget.value)}
      />
      <button class="btn btn-ghost btn-xs text-error" onclick={() => removeStop(i)}>
        <X size={14} />
      </button>
    </div>
  {/each}
  <button class="btn btn-ghost btn-xs text-primary" onclick={addStop}>
    <Plus size={14} /> Tappa
  </button>
</div>
