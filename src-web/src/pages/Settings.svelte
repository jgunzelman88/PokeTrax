<script lang="ts">
  import Icon from "./../components/Shared/Icon.svelte";
  import { mdiCog, mdiDelete, mdiDeleteSweep, mdiFloppy } from "@mdi/js";
  import { bgOptions, settingStore, setSetting, clearCardCache, clearExpCache } from "../lib/SettingStore";
  import { setStore } from "../lib/CardSearchStore";
  import { onMount } from "svelte";
  import type { Expansion } from "../lib/CardMeta";

  let sets: Expansion[] = [];
  let selectedSet: string;
  let bg: string;
  let path: string;
  let admin: boolean;

  onMount(() => {
    settingStore.subscribe((val) => {
      bg = val.bg_img;
      path = val.admin_file;
      admin = val.admin;
    });
    setStore.subscribe((val) => (sets = val));
  });

  function updateBgImage(e) {
    bg = e.target.value;
    saveOnClick();
  }

  function saveOnClick() {
    setSetting({ bg_img: bg, admin_file: path, admin: admin });
  }
</script>

<div class="foggy w-full h-[calc(100vh-4rem)] pt-2 px-2">
  <div class="navbar bg-base-100 rounded-md">
    <Icon path={mdiCog} class="w-6 m-2" />
    <span class="normal-case text-xl">Settings</span>
  </div>
  <div class="divider">Style</div>
  <label class="input-group ">
    <span class="w-64 bg-primary">Background Image</span>
    <select
      class="select select-bordered w-96"
      bind:value={bg}
      on:input={(e) => updateBgImage(e)}
    >
      {#each bgOptions as opt}
        <option value={opt}>{opt.replaceAll(/[\w]+\//g, "")}</option>
      {/each}
    </select>
  </label>
  <div class="divider">Admin Settings</div>
  <label class="input-group ">
    <span class="w-64 bg-primary">Admin Mode</span>
    <div class="bg-slate-50 flex p-3">
      <span class="bg-transparent">Off</span>
      <input
        type="checkbox"
        class="toggle toggle-success"
        bind:checked={admin}
        on:change={saveOnClick}
      />
      <span class="bg-transparent">On</span>
    </div>
  </label>
  <div class="h-4" />
  <label class="input-group">
    <span class="w-64 bg-primary">Admin DB Path</span>
    <input class="w-[21rem] input" bind:value={path} placeholder="DB Path" />
    <button class="btn btn-square" on:click={saveOnClick}>
      <Icon class="w-6" path={mdiFloppy} />
    </button>
  </label>
  <div class="divider">Cache Settings</div>
  <label class="input-group ">
    <span class="w-64 bg-primary">Clear Exp Card Images</span>
    <select
      class="select select-bordered w-72"
      bind:value={selectedSet}
      on:input={(e) => {}}
    >
      {#each sets as opt}
        <option value={opt.name}>{opt.name}</option>
      {/each}
    </select>
    <button class="btn btn-square" on:click={() => clearCardCache(selectedSet)}>
      <div class="tooltip" data-tip="Clear only selected set">
        <Icon class="w-6" path={mdiDelete} />
      </div>
    </button>
    <button class="btn btn-square" on:click={() => clearCardCache()}>
      <div class="tooltip" data-tip="Clear all cards">
        <Icon class="w-7" path={mdiDeleteSweep} />
      </div>
    </button>
  </label>
  <div class="h-4" />
  <label class="input-group ">
    <span class="w-64 bg-primary">Clear Exp Logo Images</span>
    <button class="btn btn-square" on:click={() => clearExpCache()}>
      <div class="tooltip" data-tip="Clear all cards">
        <Icon class="w-7" path={mdiDeleteSweep} />
      </div>
    </button>
  </label>
</div>
