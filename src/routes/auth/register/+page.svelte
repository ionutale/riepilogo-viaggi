<script lang="ts">
  import { enhance } from "$app/forms";
  import { UserPlus } from "@lucide/svelte";

  let { form } = $props();
</script>

<div class="min-h-[80vh] flex items-center justify-center">
  <div class="card bg-base-100 border border-base-300 w-full max-w-sm">
    <div class="card-body">
      <h1 class="card-title text-2xl justify-center mb-4">Registrati</h1>

      <form method="POST" use:enhance class="space-y-4">
        <label class="form-control">
          <span class="label-text">Nome</span>
          <input type="text" name="name" class="input input-bordered" required />
        </label>

        <label class="form-control">
          <span class="label-text">Email</span>
          <input type="email" name="email" class="input input-bordered" required />
        </label>

        <label class="form-control">
          <span class="label-text">Password</span>
          <input type="password" name="password" class="input input-bordered" minlength={8} required />
        </label>

        {#if form?.error}
          <p class="text-error text-sm">{form.error}</p>
        {/if}

        <button type="submit" class="btn btn-primary w-full">
          <UserPlus size={18} /> Registrati
        </button>
      </form>

      <p class="text-center text-sm mt-4">
        Hai già un account? <a href="/auth/login" class="link">Accedi</a>
      </p>
    </div>
  </div>
</div>
