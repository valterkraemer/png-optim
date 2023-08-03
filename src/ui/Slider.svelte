<script lang="ts">
	import { createEventDispatcher } from "svelte";
	import type { ChangeEventHandler } from "svelte/elements";

	const dispatch = createEventDispatcher();

	export let title: string;
	export let value: number;
	export let min: number;
	export let max: number;
	export let step: number;

	const handleChange: ChangeEventHandler<HTMLInputElement> = (event) => {
		dispatch("change", parseFloat(event.currentTarget.value));
	};
</script>

<div>
	<label>
		<span>
			{title}
		</span>

		<input type="number" {min} {max} {step} {value} on:change={handleChange} />
	</label>

	<input
		class="slider"
		type="range"
		{min}
		{max}
		{step}
		{value}
		on:input={handleChange}
	/>
</div>

<style>
	label {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	input[type="number"] {
		width: max-content;
		min-width: 4rem;
	}

	.slider {
		width: 100%;
		height: 1.5rem;
		padding: 0;
		appearance: none;
		background-color: transparent;
		border: none;
	}

	.slider::-moz-range-thumb {
		width: 1rem;
		height: 1rem;
		appearance: none;
		background-color: var(--dark-blue);
		border: 0;
		border-radius: 1rem;
	}

	.slider::-webkit-slider-thumb {
		width: 1rem;
		height: 1rem;
		margin-top: -0.25rem;
		appearance: none;
		background-color: var(--dark-blue);
		border: 0;
		border-radius: 1rem;
	}

	.slider::-moz-range-track {
		width: 100%;
		height: 0.5rem;
		color: transparent;
		cursor: pointer;
		background-color: var(--dark-bg-muted);
		border-color: transparent;
		border-radius: 1rem;
	}

	.slider::-webkit-slider-runnable-track {
		width: 100%;
		height: 0.5rem;
		color: transparent;
		cursor: pointer;
		background-color: var(--dark-bg-muted);
		border-color: transparent;
		border-radius: 1rem;
	}
</style>
