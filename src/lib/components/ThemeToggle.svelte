<script lang="ts">
  import { Sun, Moon } from "@lucide/svelte";

  let theme = $state<"light" | "dark">("light");

  function toggle() {
    theme = theme === "light" ? "dark" : "light";
    document.documentElement.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }

  $effect(() => {
    const saved = localStorage.getItem("theme");
    if (saved === "dark" || saved === "light") {
      theme = saved;
      document.documentElement.setAttribute("data-theme", theme);
    }
  });
</script>

<button class="btn btn-ghost btn-sm" onclick={toggle} aria-label="Toggle theme">
  {#if theme === "light"}
    <Moon size={18} />
  {:else}
    <Sun size={18} />
  {/if}
</button>
