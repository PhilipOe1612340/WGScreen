<script context="module">
	import { isOnDate, getDayThisYear } from '../../../helpers/date';
	import { iH, server } from '../../../helpers/env';
	import { mod } from '../../../helpers/math';

	export async function load({ page, fetch }) {
		let { month, year } = page.params;
		month = parseInt(month);
		year = parseInt(year);
		const nrDays = new Date(year, month, 0).getDate();

		if (month > 12 || month < 1 || year < 2020) {
			this.error(400, 'wrong calender date');
		}

		const events = await fetch(server + 'events', iH()).then((r) => r.json());

		const guests = await fetch(server + 'guests', iH()).then((r) => r.json());

		const days = new Array(nrDays)
			.fill(undefined)
			.map((_, day) => new Date(year, month - 1, day + 1))
			.map((d, i) => {
				return {
					date: i + 1,
					events: events?.filter((e) => isOnDate(e.date, d)),
					birthdays: guests.filter((g) => isOnDate(getDayThisYear(g.birthday, year), d)),
					today: isOnDate(d, new Date())
				};
			});

		const firstDay = new Date(year, month - 1, 1).getDay();
		return {
			props:{
				days,
				month,
				year,
				offset: mod(firstDay - 1, 7)
			}
		}
	}
</script>

<script>
	import Image from '../../../components/Image.svelte';
	import { goto } from '$app/navigation';

	export let offset;
	export let days = [];
	export let month;
	export let year;

	$: next = `/${(month % 12) + 1}/${month === 12 ? year + 1 : year}/calender`;
	$: prev = `/${month === 1 ? 12 : month - 1}/${month === 1 ? year - 1 : year}/calender`;

	$: fixedMonth = month < 10 ? '0' + month : month;

	const daysOfWeek = [
		'Montag',
		'Dienstag',
		'Mittwoch',
		'Donnerstag',
		'Freitag',
		'Samstag',
		'Sonntag'
	];
</script>

<h1 class="space-between">
	Kalender
	<div>
		<span>{fixedMonth}</span>
		{year}
	</div>
</h1>
<div id="nav" class="space-between">
	<a rel="prefetch" href={prev} sveltekit:noscroll>
		<button>&lt;</button>
	</a>
	<a rel="prefetch" href={next} sveltekit:noscroll>
		<button>&gt;</button>
	</a>
</div>
<div id="calender">
	{#each daysOfWeek as day}
		<div class="names">{day}</div>
	{/each}
	{#each new Array(offset).fill(1) as _}
		<div class="grey" />
	{/each}
	{#each days as day}
		<div id="day" class:today={day.today}>
			<div class="imageList">
				{#each day.birthdays as e}
					<Image
						imageObj={e.image}
						onSelect={async (id) => await goto('/guests/' + e.id)}
						size="thumbnail"
						overwriteDimensions={40}
						cover
					/>
				{/each}
			</div>
			<b>{day.date}</b>
			{#each day.events as e}
				<a href="/events/{e.id}">{e.title}</a>
			{/each}
		</div>
	{/each}
</div>

<style>
	.space-between {
		display: flex;
		justify-content: space-between;
	}

	#nav {
		margin: 10px 0px 50px;
	}

	button:hover,
	#day:hover {
		box-shadow: 1px 2px #797979;
	}

	button {
		box-shadow: 1px 2px #d3d3d3;
		border: 1px solid gray;
		padding: 0px 4px 0px 5px;
		cursor: pointer;
		background: white;
		height: 40px;
		width: 112px;
		line-height: 1px;
		outline: 0;
		font-size: 30px;
		margin: 0 6px;
		border-radius: 5px;
	}

	#calender > div {
		margin: 3px;
	}

	#calender {
		display: grid;
		grid-template-columns: repeat(7, 1fr);
		width: 100%;
	}

	#day > a {
		margin-left: 3px;
		max-width: calc(calc(100vw - 170px) / 7);
		text-overflow: ellipsis;
		display: inline-block;
		overflow: hidden;
		text-decoration: underline;
	}
	#day {
		position: relative;
		display: block;
		height: 100px;
		border: 1px solid #949494;
		margin: 3px;
	}

	b {
		display: inline-block;
		width: 100%;
		text-align: center;
	}

	.grey {
		border: 1px solid #c0c0c0 !important;
		background: #e6e6e6;
	}

	.names {
		height: 30px;
		text-align: center;
		font-weight: bold;
		color: #363636;
	}

	a {
		text-decoration: none;
	}

	span {
		color: #ff5e2a;
	}
	.imageList {
		position: absolute;
		display: flex;
		flex-direction: column;
		right: 0px;
		border-radius: 40px;
		overflow: hidden;
		height: min-content;
	}
	#day.today {
		border: 2px solid #ff5e2a;
		box-shadow: 1px 2px #797979;
		box-sizing: border-box;
	}
</style>
