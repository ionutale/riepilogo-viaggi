<script lang="ts">
  import { page } from "$app/stores";
  import { TriangleAlert } from "@lucide/svelte";
</script>

<div class="min-h-[80vh] flex items-center justify-center">
  <div class="card bg-base-100 border border-base-300 max-w-md text-center">
    <div class="card-body items-center">
      <TriangleAlert size={48} class="text-warning mb-4" />
      <h1 class="card-title text-4xl">{$page.status}</h1>
      <p class="text-base-content/60">{$page.error?.message ?? "Si è verificato un errore"}</p>
      <div class="card-actions mt-4">
        <a href="/" class="btn btn-primary">Torna alla home</a>
      </div>
    </div>
  </div>
</div>
