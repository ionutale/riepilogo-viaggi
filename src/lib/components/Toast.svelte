<script lang="ts">
  import { X, CircleCheck, CircleX } from "@lucide/svelte";

  let {
    message = "",
    type = "success" as "success" | "error",
  } = $props();

  let visible = $state(false);

  $effect(() => {
    visible = !!message;
    if (message) {
      const timer = setTimeout(() => (visible = false), 4000);
      return () => clearTimeout(timer);
    }
  });
</script>

{#if visible && message}
  <div class="toast toast-top toast-end z-50">
    <div class="alert {type === 'success' ? 'alert-success' : 'alert-error'} shadow-lg">
      {#if type === "success"}
        <CircleCheck size={18} />
      {:else}
        <CircleX size={18} />
      {/if}
      <span>{message}</span>
      <button class="btn btn-ghost btn-xs" onclick={() => (visible = false)}>
        <X size={14} />
      </button>
    </div>
  </div>
{/if}
