<script lang="ts">
	import { slide } from "svelte/transition";

	export let open: boolean;
</script>

{#if open}
	<div transition:slide>
		<slot />
	</div>
{/if}
