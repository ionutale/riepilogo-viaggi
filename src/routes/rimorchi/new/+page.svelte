<script lang="ts">
  import { enhance } from "$app/forms";
  import { Link } from "@lucide/svelte";

  let { form } = $props();
</script>

<div class="max-w-md mx-auto">
  <div class="card bg-base-100 border border-base-300">
    <div class="card-body">
      <h1 class="card-title">Nuovo Rimorchio</h1>
      <form method="POST" use:enhance class="space-y-4">
        <label class="form-control">
          <span class="label-text">Targa</span>
          <input type="text" name="licensePlate" class="input input-bordered uppercase" placeholder="TR001XY" required />
        </label>
        {#if form?.error}<p class="text-error text-sm">{form.error}</p>{/if}
        <div class="card-actions justify-end">
          <a href="/rimorchi" class="btn btn-ghost">Annulla</a>
          <button type="submit" class="btn btn-primary"><Link size={18} /> Crea</button>
        </div>
      </form>
    </div>
  </div>
</div>
