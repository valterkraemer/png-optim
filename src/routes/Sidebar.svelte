<script lang="ts">
	import type { OptimizeOptions } from "$lib/worker";
	import { spacebar } from "$lib/spacebar";
	import Button from "../ui/Button.svelte";
	import Slider from "../ui/Slider.svelte";
	import { formatSize } from "$lib/roundSize";
	import Reveal from "../ui/Reveal.svelte";
	import Caret from "../icons/Caret.svelte";

	export let options: OptimizeOptions;
	export let showOriginal: boolean;
	export let fileLink: string | undefined;
	export let originalFileName: string | undefined;
	export let sizeBefore: number | undefined;
	export let sizeAfter: number | undefined;

	let showAdvanced = false;
	let internalShowOriginal = showOriginal;

	function download() {
		const afterFilename = originalFileName!.replace(/\.[^.]+$/, "-optim.png");

		const a = document.createElement("a");
		a.href = fileLink!;
		a.download = afterFilename;
		a.click();
	}

	$: {
		showOriginal = $spacebar ? !internalShowOriginal : internalShowOriginal;
	}
</script>

<div class="card">
	<h1>PNG optimizer</h1>

	<Slider
		title="Max quality"
		value={options.max_quality}
		min={0}
		max={100}
		step={1}
		on:change={(event) => {
			options = {
				...options,
				max_quality: event.detail,
			};
		}}
	/>

	<Slider
		title="Speed"
		value={options.speed}
		min={1}
		max={10}
		step={1}
		on:change={(event) => {
			options = {
				...options,
				speed: event.detail,
			};
		}}
	/>

	<div>
		<label class="flex">
			<span>Show original</span>
			<input
				class="large-checkbox"
				type="checkbox"
				checked={showOriginal}
				on:change={() => (internalShowOriginal = !internalShowOriginal)}
			/>
		</label>

		<div class="small">Hint: Toggle this by holding spacebar</div>
	</div>

	<div>
		<label class="show-advanced-label">
			<span>Advanced settings</span>
			<input type="checkbox" bind:checked={showAdvanced} />
			<Caret open={showAdvanced} />
		</label>

		<Reveal open={showAdvanced}>
			<Slider
				title="Max colors"
				value={options.max_colors}
				min={2}
				max={256}
				step={1}
				on:change={(event) => {
					options = {
						...options,
						max_colors: event.detail,
					};
				}}
			/>

			<Slider
				title="Gamma"
				value={options.gamma}
				min={0}
				max={1}
				step={0.1}
				on:change={(event) => {
					options = {
						...options,
						gamma: event.detail,
					};
				}}
			/>

			<Slider
				title="Min posterization"
				value={options.min_posterization}
				min={0}
				max={4}
				step={1}
				on:change={(event) => {
					options = {
						...options,
						min_posterization: event.detail,
					};
				}}
			/>
		</Reveal>
	</div>

	<div class="flex">
		<div>
			{#if sizeBefore && sizeAfter}
				Saved <b>{100 - Math.round((100 * sizeAfter) / sizeBefore)}%</b>
				<br />
				<div class="small">
					{formatSize(sizeBefore)} to {formatSize(sizeAfter)}
				</div>
			{/if}
		</div>
		<Button on:click={download} disabled={!fileLink}>Download</Button>
	</div>
</div>

<style>
	.card {
		display: flex;
		flex-direction: column;
		gap: 0.5rem;
		margin: 1rem;
	}

	h1 {
		margin: 0;
	}

	.flex {
		display: flex;
		align-items: center;
		justify-content: space-between;
	}

	.large-checkbox {
		transform: scale(1.5, 1.5);
		transform-origin: 100% 50%;
	}

	.small {
		font-size: 0.8em;
	}

	.show-advanced-label {
		display: flex;
		align-items: center;
		justify-content: flex-end;
		gap: 0.5rem;
		max-width: max-content;
		margin-left: auto;
		font-size: 0.8rem;
		padding: 0.5rem 0rem 0.5rem 0.5rem;
	}

	label {
		cursor: pointer;
		user-select: none;
	}

	.show-advanced-label input {
		display: none;
	}
</style>
