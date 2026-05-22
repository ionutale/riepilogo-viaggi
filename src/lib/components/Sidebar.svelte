<script lang="ts">
  import ThemeToggle from "./ThemeToggle.svelte";
  import {
    FileText,
    Users,
    Truck,
    Link,
    Fuel,
    Store,
    Building2,
    Settings,
    ChevronDown,
  } from "@lucide/svelte";

  interface CompanyOption {
    id: string;
    name: string;
  }

  let {
    userCompanies = [],
    activeCompanyId = null,
    isSuperadmin = false,
  }: {
    userCompanies: CompanyOption[];
    activeCompanyId: string | null;
    isSuperadmin: boolean;
  } = $props();

  let showCompanySwitcher = $state(false);

  async function switchCompany(id: string) {
    await fetch("/api/switch-company", {
      method: "POST",
      body: JSON.stringify({ companyId: id }),
    });
    window.location.href = "/";
  }

  let currentCompany = $derived(userCompanies.find((c) => c.id === activeCompanyId));

  const navItems = [
    { href: "/", label: "Schede Settimanali", icon: FileText },
    { href: "/dipendenti", label: "Dipendenti", icon: Users },
    { href: "/camion", label: "Camion", icon: Truck },
    { href: "/rimorchi", label: "Rimorchi", icon: Link },
    { href: "/rifornimenti", label: "Rifornimenti", icon: Fuel },
    { href: "/clienti", label: "Clienti", icon: Store },
  ];
</script>

<ul class="menu bg-base-100 text-base-content min-h-full w-64 p-4 gap-1">
  {#if currentCompany}
    <li class="mb-2">
      <button
        class="flex items-center gap-2 font-semibold"
        onclick={() => (showCompanySwitcher = !showCompanySwitcher)}
      >
        <Building2 size={18} />
        {currentCompany.name}
        <ChevronDown
          size={14}
          class="ml-auto transition-transform {showCompanySwitcher ? 'rotate-180' : ''}"
        />
      </button>
      {#if showCompanySwitcher}
        <ul class="ml-6">
          {#each userCompanies as c}
            <li>
              <button
                class="{c.id === activeCompanyId ? 'active' : ''}"
                onclick={() => switchCompany(c.id)}
              >
                {c.name}
              </button>
            </li>
          {/each}
        </ul>
      {/if}
    </li>
  {/if}

  <li class="menu-title text-xs mt-2">Gestione</li>

  {#each navItems as item}
    <li>
      <a href={item.href}>
        <item.icon size={18} />
        {item.label}
      </a>
    </li>
  {/each}

  {#if isSuperadmin}
    <li class="menu-title text-xs mt-4">Superadmin</li>
    <li>
      <a href="/admin/companies">
        <Building2 size={18} />
        Aziende
      </a>
    </li>
  {/if}

  <li class="mt-auto">
    <a href="/azienda/settings">
      <Settings size={18} />
      Gestione Azienda
    </a>
  </li>

  <li>
    <div class="flex items-center justify-between px-4 py-2">
      <span class="text-xs text-base-content/50">Tema</span>
      <ThemeToggle />
    </div>
  </li>
</ul>
