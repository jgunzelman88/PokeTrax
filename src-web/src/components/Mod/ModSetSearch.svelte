<script lang="ts">
  import { baseURL } from "./../../lib/Utils.js";
  import { Expansion } from "../../lib/CardMeta";
  import { setStore } from "../../lib/AdminDataStore";
  import Icon from "../Shared/Icon.svelte";
  import { mdiPencil, mdiPlus } from "@mdi/js";
  import ExpantionEdit from "./ExpantionEdit.svelte";

  let selectedSet: Expansion | undefined = null;
  let expansions = new Array<Expansion>();
  setStore.subscribe((val) => (expansions = val));

  function setSelected(set: Expansion | undefined) {
    selectedSet = set;
  }
</script>

{#if selectedSet == null}
  <div class="flex mx-2">
    <div class="flex-grow" />
    <button
      class="btn"
      on:click={() => {
        selectedSet = new Expansion("NEW_EXPANTION", "", "", "");
        selectedSet.releaseDate = new Date().toISOString();
      }}
    >
      <Icon class="w-6" path={mdiPlus} />
      Expantion
    </button>
  </div>
  <div class="h-[calc(100vh-12rem)] w-screen overflow-hidden">
    <div class="flex h-[calc(100vh-12rem)] w-screen overflow-auto">
      <table class="table table-compact w-full m-2">
        <thead>
          <tr>
            <th>Symbol</th>
            <th>Logo</th>
            <th>Name</th>
            <th>Series</th>
            <th>TCG Name</th>
            <th>Number Of Cards</th>
            <th>Release Data</th>
            <th>Edit</th>
          </tr>
        </thead>
        <tbody>
          {#each expansions as exp}
            <tr>
              <td>
                <img
                  class="h-6 w-6 m-1 object-contain"
                  src="{baseURL}/pokemon/expansion/symbol/{encodeURIComponent(
                    exp.name
                  )}"
                  alt={exp.name}
                />
              </td>
              <td
                ><img
                  class="h-6 w-12 m-1 object-contain"
                  src="{baseURL}/pokemon/expansion/logo/{encodeURIComponent(
                    exp.name
                  )}"
                  alt={exp.name}
                />
              </td>
              <td>{exp.name}</td>
              <td>{exp.series}</td>
              <td>{exp.tcgName}</td>
              <td>{exp.numberOfCards}</td>
              <td>{exp.releaseDate}</td>
              <td>
                <button
                  class="btn btn-circle"
                  on:click={() => setSelected(exp)}
                >
                  <Icon path={mdiPencil} class="w-6" />
                </button>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>
{:else}
  <ExpantionEdit exp={selectedSet} on:close={() => setSelected(null)} />
{/if}
