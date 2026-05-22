<script lang="ts">
  import { enhance } from "$app/forms";
  import { LogIn } from "@lucide/svelte";

  let { form } = $props();
</script>

<div class="min-h-[80vh] flex items-center justify-center">
  <div class="card bg-base-100 border border-base-300 w-full max-w-sm">
    <div class="card-body">
      <h1 class="card-title text-2xl justify-center mb-4">Accedi</h1>

      <form method="POST" class="space-y-4">
        <label class="form-control">
          <span class="label-text">Email</span>
          <input type="email" name="email" class="input input-bordered" required />
        </label>

        <label class="form-control">
          <span class="label-text">Password</span>
          <input type="password" name="password" class="input input-bordered" required />
        </label>

        {#if form?.error}
          <p class="text-error text-sm">{form.error}</p>
        {/if}

        <button type="submit" class="btn btn-primary w-full">
          <LogIn size={18} /> Accedi
        </button>
      </form>

      <p class="text-center text-sm mt-4">
        Non hai un account? <a href="/auth/register" class="link">Registrati</a>
      </p>
    </div>
  </div>
</div>
