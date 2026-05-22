<script lang="ts">
  import "../app.css";
  import { page } from "$app/stores";
  import Sidebar from "$lib/components/Sidebar.svelte";
  import { Menu } from "@lucide/svelte";

  let { children, data } = $props();

  let userCompanies = $derived(data.userCompanies ?? []);
  let activeCompanyId = $derived(
    $page.url.searchParams.get("company_id") ?? data.activeCompany?.id ?? null,
  );
  let activeCompany = $derived(data.activeCompany);
  let isSuperadmin = $derived(data.user?.isSuperadmin ?? false);

  let drawerOpen = $state(false);
</script>

<div class="drawer lg:drawer-open">
  <input
    id="sidebar-drawer"
    type="checkbox"
    class="drawer-toggle"
    bind:checked={drawerOpen}
  />

  <div class="drawer-content flex flex-col">
    <header class="navbar bg-base-100 border-b border-base-300 sticky top-0 z-30 lg:hidden">
      <div class="flex-1">
        <label for="sidebar-drawer" class="btn btn-ghost btn-square">
          <Menu size={20} />
        </label>
        <span class="font-bold text-sm">{activeCompany?.name ?? "Riepilogo Viaggi"}</span>
      </div>
    </header>

    <main class="flex-1 p-4 max-w-7xl w-full mx-auto">
      {@render children()}
    </main>
  </div>

  <div class="drawer-side z-40">
    <label for="sidebar-drawer" class="drawer-overlay"></label>
    <aside>
      <Sidebar {userCompanies} {activeCompanyId} {isSuperadmin} />
    </aside>
  </div>
</div>
