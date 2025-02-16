import type { Expansion } from './CardMeta';
import { writable } from 'svelte/store';
import type { Card } from './Card';
import { initCardStore } from './CardSearchStore';
import { initCollectionStore } from './CollectionStore';
import { initAdminStore } from './AdminDataStore';
import { initSettingStore } from './SettingStore';
import { initProductTypes } from './ProductSearchStore';

export const baseURL = 'http://localhost:3131';

export const wotc_path_rev = `clip-path: polygon(0% 0%, 0% 100%, 12% 100%, 11% 11%, 89% 11%, 89% 52%, 11% 52%, 11% 100%, 100% 100%, 100% 0%);`;
export const modern_path_rev = `clip-path: polygon(4% 3%, 4% 97%, 7% 97%, 7% 9%, 93% 9%, 93% 48%, 7% 49%, 7% 97%, 97% 97%, 96% 3%);`;

export interface PaginatedResults {
	count: number;
}

/**
 * Main Page
 * [loading, cards, sets, sealedProduct, collections]
 */
export const page = writable('loading');
/** DB status */

export function formatExpansionNumber(expNumber: string, expName: string): Promise<string> {
	return new Promise<string>((resolve, _) => {
		let num = Number.parseInt(expNumber);
		let value = isNaN(num) ? expNumber : num.toString();
		fetch(`${baseURL}/pokemon/expansion/${encodeURIComponent(expName)}`)
			.then((res) => res.json())
			.then((exp: Expansion) => {
				resolve(`${value}/${exp.numberOfCards}`);
			})
			.catch((_) => resolve(value));
	});
}

export function init() {
	initCardStore();
	initAdminStore();
	initCollectionStore();
	initSettingStore();
	initProductTypes();
}

export function getTextColorBgContrast(hexcolor) {
	// If a leading # is provided, remove it
	if (hexcolor.slice(0, 1) === '#') {
		hexcolor = hexcolor.slice(1);
	}
	// Convert to RGB value
	var r = parseInt(hexcolor.substr(0, 2), 16);
	var g = parseInt(hexcolor.substr(2, 2), 16);
	var b = parseInt(hexcolor.substr(4, 2), 16);

	// Get YIQ ratio
	var yiq = (r * 299 + g * 587 + b * 114) / 1000;

	// Check contrast
	return yiq >= 128 ? 'black' : 'white';
}

export function getHolo(card: Card) {
	let holo = 'basic';
	if (card.name.includes('Secret') || card.rarity === 'Hyper Rare') {
		return 'rare rainbow';
	} else if (
		RegExp(/VMAX|VSTAR/).exec(card.name) ||
		card.rarity === 'Special Illustration Rare' ||
		card.name.includes('Full Art')
	) {
		return 'rare holo vmax';
	} else if (card.rarity === 'Holo Rare') {
		return 'rare holo';
	} else if (
		RegExp(/\sV|ex/).exec(card.name) ||
		RegExp(/TG/).exec(card.expCardNumber) ||
		card.rarity === 'Illustration Rare' ||
		card.rarity === 'Double Rare'
	) {
		return 'rare holo v';
	} else if (card.name.includes('Radiant')) {
		return 'radiant';
	}
	return holo;
}

export function formatDate(dateString: string) {
	let date = new Date(Date.parse(dateString));
	return date.toLocaleDateString();
}

export function formatEnergy(card: Card) {
	return card.energyType == null || card.energyType == ''
		? 'trainer'
		: card.energyType.toLowerCase();
}

export function formatPrice(price: number | undefined) {
	let formater = new Intl.NumberFormat('EN', {
		style: 'currency',
		currency: 'USD',
		notation: 'compact',
		maximumFractionDigits: 2,
		minimumFractionDigits: 2,
		maximumSignificantDigits: 3
	});
	return price == null ? '-.--' : formater.format(price);
}

export function objEq(v1, v2): boolean {
	let incJSON = JSON.stringify(v1);
	let currJSON = JSON.stringify(v2);
	return incJSON === currJSON;
}

export function openUrl(url: string) {
	fetch(`${baseURL}/meta/open`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: `{"url": "${url}"}`
	});
}
