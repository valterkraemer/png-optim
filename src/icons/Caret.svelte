<script lang="ts">
	export let open: boolean;
</script>

<svg viewBox="0 0 30 52" class:open>
	<path
		d="M28.5 28.5a3.5 3.5 0 0 0 0-5L6.2 1.3a3.5 3.5 0 0 0-5 4.9L21.2 26 1.3 45.8a3.5 3.5 0 1 0 4.9 5l22.3-22.3Zm-6.5 1h4v-7h-4v7Z"
	/>
</svg>

<style>
	svg {
		height: 1em;
		fill: currentColor;
		transition: transform ease-in-out 0.2s;
	}

	.open {
		transform: rotate(90deg);
	}
</style>
