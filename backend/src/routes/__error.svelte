
<script context="module">
	export function load({ error, status }) {
		return {
			props: {
				error, status
			}
		};
	}
</script>


<script lang="ts">
	import { dev } from '$app/env';

	// import { getStores } from '$app/stores';
	// const { session } = getStores();

	export let status: number;
	export let error: Error;
</script>

<svelte:head>
	<title>{status}</title>
</svelte:head>

<h1>Error: {status}</h1>
<!-- {#if $session.authenticated} -->
<p>{error.message}</p>

<a href="/">Zurück</a>

{#if /* dev && */ error.stack}
  <pre>{error.stack}</pre>
{/if}
<!-- {:else} -->
<a href="/login">Anmelden</a>
<!-- {/if} -->

<style>
	h1,
	p {
		margin: 0 auto;
	}

	h1 {
		font-size: 2.8em;
		font-weight: 700;
		margin: 0 0 0.5em 0;
	}

	p {
		margin: 1em auto;
	}

	@media (min-width: 480px) {
		h1 {
			font-size: 4em;
		}
	}
</style>
