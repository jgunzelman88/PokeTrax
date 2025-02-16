<script lang="ts">
	import CardFilters from '../CardSearch/CardFilters.svelte';
	import CardSort from '../CardSearch/CardSort.svelte';
	import { CardSearchResults, Card } from '../../lib/Card';
	import { CardImage, Energy } from 'tcg-case';
	import CardDetails from '../Shared/CardDetails.svelte';
	import { mdiPencil, mdiPlaylistEdit, mdiRefresh, mdiPlus } from '@mdi/js';
	import { baseURL, formatEnergy, formatDate, openUrl } from '../../lib/Utils';
	import CardEdit from './CardEdit.svelte';
	import Icon from '../Shared/Icon.svelte';
	import { writable } from 'svelte/store';
	import {
		cardResultStore,
		cardSearchDisplay,
		searchTermStore,
		selectedRaritiesStore,
		selectedSetsStore,
		executeCardSearch,
		sortStore,
		pageStore,
		initAdminStore
	} from '../../lib/AdminDataStore';
	import Pagination from '../Shared/Pagination.svelte';
	import MassCardEdit from './MassCardEdit.svelte';

	//Search term
	let searchTerm = '';
	searchTermStore.subscribe((val) => (searchTerm = val));
	//Selected Rarities
	let selectedRarities = [];
	selectedRaritiesStore.subscribe((val) => (selectedRarities = val));
	//Selected Sets(Expansions)
	let selectedSets = [];
	selectedSetsStore.subscribe((val) => (selectedSets = val));
	//Display
	let display = 'grid';
	cardSearchDisplay.subscribe((val) => (display = val));
	//Results
	let results: CardSearchResults = new CardSearchResults();
	cardResultStore.subscribe((val) => (results = val));

	let selectedCards = new Array<string>();
	let selectedCard: Card | undefined = null;
	let showMassEditButton = false;
	let showMassEdit = false;

	/**
	 * Set the edit card page active or not
	 */
	function setEditCard(card: Card | undefined) {
		selectedCard = card;
		if (card == null) {
			refresh();
		}
	}

	function handleCheck(event) {
		if (event.target.checked) {
			selectedCards.push(event.target.id);
		} else {
			selectedCards.splice(selectedCards.indexOf(event.target.id), 1);
		}
		showMassEditButton = selectedCards.length !== 0 ? true : false;
	}

	function getChecked(card: Card) {
		return selectedCards.indexOf(card.cardId) >= 0;
	}

	function addCardCH() {
		let newCard = new Card('NEW_CARD', 0, 'NEW_CARD', '', '', '', '');
		newCard.releaseDate = new Date().toISOString();
		setEditCard(newCard);
	}

	function refresh() {
		initAdminStore();
		executeCardSearch();
	}

	function openTCGP(id: string) {
		openUrl('https://tcgplayer.com/product/' + id);
	}
</script>

{#if selectedCard == null && showMassEdit === false}
	<!--Search Controls-->
	<div class="grid foggy grid-cols-1 gap-1">
		<div class="flex w-full items-center">
			<div class="w-2" />
			<CardFilters
				selRareStore={selectedRaritiesStore}
				selSetsStore={selectedSetsStore}
				{searchTermStore}
				pageStore={writable(0)}
				executeSearch={executeCardSearch}
			/>
			<button id="add-card-button" class="btn btn-square" on:click={addCardCH}>
				<Icon class="h-6" path={mdiPlus} />
			</button>
			<div class="w-2" />
			<button id="refresh-button" class="btn btn-square" on:click={refresh}>
				<Icon class="h-6" path={mdiRefresh} />
			</button>
			<div class="w-2" />
		</div>
		<div class="flex items-center">
			<div class="sm:w-2 lg:flex-grow" />
			{#if showMassEditButton}
				<div class="tooltip" data-tip="Mass Edit">
					<button class="btn btn-square" on:click={() => (showMassEdit = true)}>
						<Icon class="h-8" path={mdiPlaylistEdit} />
					</button>
				</div>
			{/if}
			<div class="w-2" />
			<CardSort {sortStore} executeSearch={executeCardSearch} />
			<div class="w-2" />
			<Pagination {pageStore} executeSearch={executeCardSearch} resultStore={cardResultStore} />
			<div class="w-2" />
		</div>
	</div>
	<!--Card List-->
	<div class="h-[calc(100vh-15rem)] w-screen overflow-hidden">
		<div class="flex h-[calc(100vh-15rem)] w-screen overflow-auto">
			<table class="table table-compact w-full m-2">
				<thead>
					<tr>
						<th>Select</th>
						<th class="text-center">Image</th>
						<th>Card Name</th>
						<th>TCGP ID</th>
						<th>Release Date</th>
						<th class="text-center">Details</th>
						<th>Edit</th>
					</tr>
				</thead>
				<tbody>
					{#each results.cards as card, i}
						<tr>
							<!--Selection-->
							<td>
								<label>
									<input
										type="checkbox"
										id={card.cardId}
										class="checkbox border-solid ml-4 border-2 border-black"
										checked={getChecked(card)}
										on:click={handleCheck}
									/>
								</label>
							</td>
							<!--Image-->
							<td>
								<CardImage
									height="96px"
									width="65px"
									class="rounded-md m-2 object-contain"
									cardImg={`${baseURL}/pokemon/card_img/${encodeURI(card.expName)}/${encodeURI(
										card.cardId
									)}`}
									id={i}
								/>
							</td>
							<!--Card Name-->
							<td>
								<div class="flex items-center">
									<Energy type={formatEnergy(card)} />
									<span class="text-lg ml-2">{card.name}</span>
								</div>
								<div class="flex">
									<span>Variants:</span>
									{#each card.variants as variant}
										<span class="badge mx-1">{variant}</span>
									{/each}
								</div>
							</td>
							<!--TCGP ID-->
							<td>
								<div
									class="link"
									on:click={() => openTCGP(card.idTCGP.toFixed(0))}
									on:keypress={(e) => {
										if (e.key === 'enter') openTCGP(card.idTCGP.toFixed(0));
									}}
								>
									{card.idTCGP}
								</div>
							</td>
							<!--Release Date-->
							<td>
								{formatDate(card.releaseDate)}
							</td>
							<!--Details-->
							<td>
								<CardDetails {card} />
							</td>
							<td>
								<button class="btn btn-circle" on:click={() => setEditCard(card)}>
									<Icon path={mdiPencil} class="w-6" />
								</button>
							</td>
						</tr>
					{/each}
				</tbody>
			</table>
		</div>
	</div>
{:else if selectedCard != null}
	<CardEdit on:close={() => setEditCard(null)} card={selectedCard} />
{/if}
{#if showMassEdit}
	<MassCardEdit on:close={() => (showMassEdit = false)} cards={selectedCards} />
{/if}
