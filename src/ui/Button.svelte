<script lang="ts">
	export let disabled = false;
</script>

<button {disabled} on:click><slot /></button>

<style>
	button {
		background-color: #4caf50;
		border: none;
		color: white;
		padding: 0.5rem 1rem;
		text-align: center;
		text-decoration: none;
		display: inline-block;
		border-radius: var(--border-radius);
		font-size: 1.1rem;
		cursor: pointer;
	}

	button[disabled] {
		opacity: 0.7;
	}
</style>
