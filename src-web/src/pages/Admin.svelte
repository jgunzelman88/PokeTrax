<script lang="ts">
  import { settingStore } from "./../lib/SettingStore";
  import Icon from "../components/Shared/Icon.svelte";
  import ModCardSearch from "../components/Mod/ModCardSearch.svelte";
  import ModSetSearch from "../components/Mod/ModSetSearch.svelte";
  import ModSeriesSearch from "../components/Mod/ModSeriesSearch.svelte";
  import { mdiArrowRightThinCircleOutline } from "@mdi/js";
  import type { Settings } from "../lib/SettingStore";
  import { executeCardSearch } from "../lib/AdminDataStore";

  let adminSettings : Settings;
  let cardSearch = "tab-active";
  let setSearch = "";
  let seriesSearch = "";
  let dbPath = "";

  settingStore.subscribe((val) => {
    adminSettings = val;
    
    executeCardSearch();
  });

  function tabClick(tab: string) {
    switch (tab) {
      case "cards":
        cardSearch = "tab-active";
        setSearch = "";
        seriesSearch = "";
        break;
      case "sets":
        cardSearch = "";
        setSearch = "tab-active";
        seriesSearch = "";
        break;
      case "series":
        cardSearch = "";
        setSearch = "";
        seriesSearch = "tab-active";
        break;
    }
  }

  function setDbPath() {
    settingStore.update((val) => {
      val.admin_file = dbPath;
      return val;
    });
  }
</script>

<div class="navbar foggy rounded-xl w-screen">
  <span class="text-lg ml-2"> Admin Console</span>
  <div class="flex-grow" />
  <div class="tabs">
    <button
      class="tab tab-bordered w-40 {cardSearch}"
      on:click={() => tabClick("cards")}>Cards</button
    >
    <button
      class="tab tab-bordered w-40 {setSearch}"
      on:click={() => tabClick("sets")}>Sets</button
    >
    <button
      class="tab tab-bordered w-40 {seriesSearch}"
      on:click={() => tabClick("series")}>Series</button
    >
  </div>
  <div class="flex-grow" />
  <div>
    <div class="form-control w-96">
      <div class="input-group">
        <input
          type="text"
          placeholder="Set DB Path"
          class="input input-bordered w-full"
          bind:value={dbPath}
        />
        <button class="btn btn-square" on:click={setDbPath}>
          <Icon class="w-8" path={mdiArrowRightThinCircleOutline} />
        </button>
      </div>
    </div>
  </div>
</div>
{#if adminSettings.admin_file == null || adminSettings.admin_file === ""}
  <div class="flex items-center justify-center h-[calc(100vh-8rem)]">
    <div class="foggy p-4 rounded-3xl">File not set</div>
  </div>
{:else if cardSearch !== ""}
  <ModCardSearch />
{:else if setSearch !== ""}
  <ModSetSearch />
{:else if seriesSearch !== ""}
  <ModSeriesSearch />
{/if}
