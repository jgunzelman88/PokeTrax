<script lang="ts">
	import { Energy, CardImage } from 'tcg-case';
	import { mdiArrowLeft, mdiCheck, mdiCancel, mdiTrashCan, mdiFloppy, mdiOpenInNew } from '@mdi/js';
	import Icon from '../Shared/Icon.svelte';
	import { baseURL, openUrl } from '../../lib/Utils';
	import type { Card } from '../../lib/Card';
	import { rarityStore, setStore } from '../../lib/CardSearchStore';
	import { formatEnergy } from '../../lib/Utils';
	import { createEventDispatcher } from 'svelte';
	import { writable } from 'svelte/store';
	import BasicToast from '../Shared/BasicToast.svelte';
	import { deleteCard, upsertCard, variantOptions } from '../../lib/AdminDataStore';
	import AutoMultiSelect from '../Shared/AutoMultiSelect/AutoMultiSelect.svelte';

	const dispatch = createEventDispatcher();
	export let card: Card;
	let add = card.cardId === 'NEW_CARD';
	let successToast;
	let errorToast;
	let showConfirmDelete = false;
	let showConfirmSave = false;
	let rarirtyOptions = new Array<string>();
	let expOptions = new Array<string>();
	let date = card.releaseDate.slice(0, 10);
	let variantOptionsForm = variantOptions.map((val) => {
		return { value: val };
	});

	let selectedVariants = writable(Array<string>());
	selectedVariants.set(card.variants ?? []);
	selectedVariants.subscribe((val) => (card.variants = val));

	setStore.subscribe((val) => (expOptions = val.map((exp) => exp.name)));
	rarityStore.subscribe((val) => (rarirtyOptions = val));

	function getGitHubImage() {
		let url = encodeURI(
			`https://raw.githubusercontent.com/poketrax/pokedata/main/images/cards` +
				`/${card.expName.replaceAll(' ', '-')}` +
				`/${card.cardId}.jpg`
		);
		openUrl(url);
	}

	function setDate() {
		card.releaseDate = new Date(date).toISOString();
	}

	function save() {
		upsertCard(card)
			.then((_) => {
				successToast.show();
				showConfirmSave = false;
			})
			.catch((_) => {
				errorToast.show();
				showConfirmSave = false;
			});
	}

	function del() {
		deleteCard(card)
			.then((_) => {
				successToast.show();
				showConfirmDelete = false;
			})
			.catch((_) => {
				errorToast.show();
				showConfirmDelete = false;
			});
	}
</script>

<BasicToast message="Success!" type="alert-success" bind:this={successToast} />
<BasicToast message="Failed!" type="alert-error" bind:this={errorToast} />
<div class="foggy">
	<div
		class="flex items-center m-2 p-3 bg-repeat"
		style={`background-image: url(\"assets/revholo/${formatEnergy(card)}-rev.png\")`}
	>
		<button
			id={`close-card-dialog`}
			aria-label="Close Card Dialog"
			class="btn btn-square"
			on:click={() => {
				dispatch('close');
			}}
		>
			<Icon path={mdiArrowLeft} class="w-6 h-6" />
		</button>

		<div class="grow" />
		<Energy type={formatEnergy(card)} class="h-8 w-8" />
		<div class="w-2" />
		<span class="text-xl">{card.name}</span>
		<div class="grow" />
		<!--Save-->
		<div class="btn-group">
			<button
				id={`close-card-dialog`}
				aria-label="Close Card Dialog"
				class="btn btn-square"
				on:click={() => (showConfirmSave = true)}
			>
				<Icon path={mdiFloppy} class="w-6 h-6" />
			</button>
			{#if showConfirmSave}
				<button on:click={save} class="btn btn-square btn-success">
					<Icon path={mdiCheck} class="w-6 h-6" />
				</button>
				<button on:click={() => (showConfirmSave = false)} class="btn btn-square btn-error">
					<Icon path={mdiCancel} class="w-6 h-6" />
				</button>
			{/if}
		</div>
		<div class="w-1" />
		<!--Delete-->
		<div class="btn-group">
			<button on:click={() => (showConfirmDelete = true)} class="btn btn-square">
				<Icon path={mdiTrashCan} class="w-6 h-6" />
			</button>
			{#if showConfirmDelete}
				<button on:click={del} class="btn btn-square btn-success">
					<Icon path={mdiCheck} class="w-6 h-6" />
				</button>
				<button on:click={() => (showConfirmDelete = false)} class="btn btn-square btn-error">
					<Icon path={mdiCancel} class="w-6 h-6" />
				</button>
			{/if}
		</div>
		<div class="w-1" />
	</div>
	<!--Card Form-->
	<div class="h-[calc(100vh-14rem)] w-screen overflow-hidden">
		<div class="flex  h-[calc(100vh-14rem)] w-screen overflow-auto">
			<div class="flex ml-3 w-screen">
				<!-- Image display-->
				<div>
					<div class="divider" />
					<h2 class="text-lg">Local Image</h2>
					<div class="divider" />
					<CardImage
						class="rounded-md object-contain w-96 h-96"
						cardImg={`${baseURL}/pokemon/card_img/${encodeURI(card.expName)}/${encodeURI(
							card.cardId
						)}`}
						id={1}
					/>
					<div class="divider" />
					<div
						class="flex items-center link"
						on:click={getGitHubImage}
						on:keypress={(e) => {
							if (e.key === 'enter') getGitHubImage();
						}}
					>
						<span class="link">Git Hib Image</span><Icon path={mdiOpenInNew} class="w-6" />
					</div>
					<div class="divider" />
				</div>
				<div class="flex-grow" />
				<div class="ml-2">
					<table class="table table-compact ml-2 mb-2">
						<tr>
							<td class="w-60">Card ID</td>
							<td
								><input
									type="text"
									placeholder="cardId"
									disabled={!add}
									bind:value={card.cardId}
									class="input input-bordered border-solid w-[450px]"
								/>
							</td>
						</tr>
						<tr>
							<td class="w-60">Name</td>
							<td
								><input
									type="text"
									placeholder="name"
									bind:value={card.name}
									class="input input-bordered border-solid w-[450px]"
								/>
							</td>
						</tr>
						<tr>
							<td>Expansion (expNam)</td>
							<td>
								<select class="select w-full max-w-xs" bind:value={card.expName}>
									{#each expOptions as option}
										<option>{option}</option>
									{/each}
								</select>
							</td>
						</tr>
						<tr>
							<td>Expansion Number (expCardNumber)</td>
							<td
								><input
									type="text"
									placeholder="expCardNumber"
									bind:value={card.expCardNumber}
									class="input input-bordered border-solid w-[450px]"
								/>
							</td>
						</tr>
						<tr>
							<td>Expansion TCGP Number (expIdTCGP)</td>
							<td>
								<input
									type="text"
									placeholder="expIdTCGP"
									bind:value={card.expIdTCGP}
									class="input input-bordered border-solid w-[450px]"
								/>
							</td>
						</tr>
						<tr>
							<td>Expansion TCGP Code (expCodeTCGP)</td>
							<td
								><input
									type="text"
									placeholder="expIdTCGP"
									bind:value={card.expCodeTCGP}
									class="input input-bordered border-solid w-[450px]"
								/>
							</td>
						</tr>
						<tr>
							<td>Rarity</td>
							<td>
								<select class="select w-full max-w-xs" bind:value={card.rarity}>
									{#each rarirtyOptions as option}
										<option>{option}</option>
									{/each}
								</select>
							</td>
						</tr>
						<tr>
							<td>Energy (energyType)</td>
							<td
								><input
									type="text"
									placeholder="energyType"
									bind:value={card.energyType}
									class="input input-bordered border-solid w-[450px]"
								/></td
							>
						</tr>
						<tr>
							<td>Realease Date (releaseDate)</td>
							<td
								><input
									type="date"
									bind:value={date}
									on:change={setDate}
									class="input input-bordered border-solid w-[450px]"
								/></td
							>
						</tr>
						<tr>
							<td>TCGP ID (idTCGP)</td>
							<td>
								<label class="input-group"
									><input
										type="number"
										placeholder="idTCGP"
										bind:value={card.idTCGP}
										class="input input-bordered border-solid w-[390px]"
									/>
									<button class="btn" on:click={() => openUrl('https://tcgplayer.com/product/' + card.idTCGP.toFixed(0))}>
										<Icon path={mdiOpenInNew} class="w-6" />
									</button>
								</label>
							</td>
						</tr>
						<tr>
							<td>Pokedex number (pokedex)</td>
							<td
								><input
									type="number"
									placeholder="Pokedex"
									bind:value={card.pokedex}
									class="input input-bordered border-solid w-[450px]"
								/></td
							>
						</tr>
						<tr>
							<td>Card Variants</td>
							<td>
								<AutoMultiSelect
									options={variantOptionsForm}
									dataStore={selectedVariants}
									label="Variants"
								/>
							</td>
						</tr>
						<tr>
							<td>Image URL (img)</td>
							<td
								><input
									type="url"
									placeholder="URL"
									bind:value={card.img}
									class="input input-bordered border-solid w-[450px]"
								/></td
							>
						</tr>
					</table>
				</div>
			</div>
		</div>
	</div>
</div>
