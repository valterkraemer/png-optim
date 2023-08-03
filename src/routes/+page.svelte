<script lang="ts">
	import { onMount } from "svelte";
	import { Optimizer } from "$lib/Optimizer";
	import type { OptimizeOptions } from "$lib/worker";
	import Sidebar from "./Sidebar.svelte";
	import Panzoom, { type PanzoomObject } from "@panzoom/panzoom";
	import Hamburger from "../icons/Hamburger.svelte";
	import Cross from "../icons/Cross.svelte";
	import GitHub from "../icons/GitHub.svelte";

	let inputFile: File | undefined = undefined;

	let beforeImgSrc: string | undefined = undefined;
	let afterImgSrc: string | undefined = undefined;
	let sizeBefore: number | undefined = undefined;
	let sizeAfter: number | undefined = undefined;
	let beforeFilename: string | undefined = undefined;

	let showOriginal = false;

	let loading = false;

	let options: OptimizeOptions = {
		gamma: 0.0,
		max_colors: 256,
		max_quality: 100,
		min_posterization: 0,
		speed: 4,
	};

	let panzoom: PanzoomObject | undefined = undefined;
	let showSidebar = false;

	const optimizer = new Optimizer();

	onMount(() => {
		document.addEventListener("paste", async (event) => {
			event.preventDefault();

			const file = event.clipboardData?.files[0];

			if (!file) {
				return;
			}

			handleFileSelected(file);
		});
	});

	function handleFileChange(event: Event) {
		const file = (event.target as HTMLInputElement).files?.[0];

		if (!file) {
			return;
		}

		handleFileSelected(file);
	}

	function handleDrop(event: DragEvent) {
		event.preventDefault();

		const file = event?.dataTransfer?.files[0];

		if (!file) {
			return;
		}

		handleFileSelected(file);
	}

	async function handleFileSelected(file: File) {
		beforeImgSrc = URL.createObjectURL(file);
		sizeBefore = file.size;
		beforeFilename = file.name;

		afterImgSrc = undefined;
		sizeAfter = undefined;

		inputFile = file;
	}

	function panzoomable(element: HTMLDivElement) {
		panzoom = Panzoom(element, {
			contain: "outside",
		});

		element.addEventListener("wheel", (event) => {
			// Ignore horizontal scroll
			if (Math.abs(event.deltaY) > Math.abs(event.deltaX)) {
				panzoom?.zoomWithWheel(event, {
					step: 0.15,
				});
			}
		});
	}

	function handleDblclick() {
		panzoom?.reset();
	}

	$: (async () => {
		if (!inputFile) {
			return;
		}

		loading = true;

		try {
			const blob = await optimizer.optimize(inputFile, options);

			afterImgSrc = URL.createObjectURL(blob);
			sizeAfter = blob.size;

			loading = false;
		} catch (error) {
			if (!(error instanceof DOMException) || error.name !== "AbortError") {
				throw error;
			}
		}
	})();
</script>

<svelte:body
	on:drop={handleDrop}
	on:dragover|preventDefault
	on:dragenter|preventDefault
/>

{#if beforeImgSrc}
	<div
		class="grid"
		use:panzoomable
		on:dblclick={handleDblclick}
		role="button"
		tabindex="0"
	>
		<div class="img-container">
			<img class:hide={!showOriginal} alt="Before" src={beforeImgSrc} />

			{#if afterImgSrc}
				<img class:hide={showOriginal} alt="After" src={afterImgSrc} />
			{/if}
		</div>
	</div>
{/if}

{#if loading}
	<div id="loading" class="card info">Loading...</div>
{:else if !beforeImgSrc}
	<label class="card select-image info">
		Drag image here, or click to select

		<input type="file" on:change={handleFileChange} />
	</label>
{/if}

<button class="show-sidebar" on:click={() => (showSidebar = true)}>
	<Hamburger />
</button>

<div class="sidebar-container" class:show={showSidebar}>
	<button class="close" on:click={() => (showSidebar = false)}>
		<Cross />
	</button>

	<Sidebar
		bind:options
		bind:showOriginal
		fileLink={afterImgSrc}
		originalFileName={beforeFilename}
		{sizeBefore}
		{sizeAfter}
	/>

	<a
		href="https://github.com/valterkraemer/png-optim"
		target="_blank"
		rel="noreferrer"
		class="card source-on-github"
	>
		<GitHub />
		<span>Source on GitHub</span>
	</a>
</div>

<style>
	:global(body) {
		overflow: hidden;
		padding: 0;
		margin: 0;
		height: 100vh;
		height: 100dvh;

		background-image: linear-gradient(45deg, #ccc 25%, transparent 25%),
			linear-gradient(135deg, #ccc 25%, transparent 25%),
			linear-gradient(45deg, transparent 75%, #ccc 75%),
			linear-gradient(135deg, transparent 75%, #ccc 75%);
		background-size: 24px 24px;
		background-position: 0 0, 12px 0, 12px -12px, 0px 12px;
	}

	.grid {
		height: 100vh;
		height: 100dvh;
	}

	.img-container {
		display: flex;
		align-items: center;
		justify-content: center;

		padding: 1rem 0 1rem 1rem;
		height: 100%;
		box-sizing: border-box;

		width: 100%;

		transition: width ease-in-out 0.2s;
	}

	.info {
		position: absolute;
		bottom: 50%;
		right: 1rem;
		left: 1rem;
		max-width: max-content;
		margin: auto;
	}

	.sidebar-container {
		position: absolute;
		top: 0;
		right: 0;
		width: 360px;
		transform: translateX(380px);
		overflow: auto;
		max-height: 100%;

		transition: transform ease-in-out 0.2s;
		pointer-events: none;
	}

	.sidebar-container > :global(*) {
		pointer-events: auto;
	}

	.sidebar-container.show {
		transform: translateX(0);
	}

	.show-sidebar {
		position: absolute;
		top: 1.2rem;
		right: 1.2rem;

		background-color: var(--dark-blue);
		border: none;
		color: white;
		padding: 0.8rem 1rem;
		display: inline-block;
		border-radius: var(--border-radius);
		font-size: 1.1rem;
		line-height: 0;
	}

	.close {
		position: absolute;
		top: 1.3rem;
		right: 1.3rem;
		appearance: none;
		background: none;
		border: none;
		color: white;
		cursor: pointer;
		font-size: 1.1rem;
		padding: 0.5rem;
	}

	@media (min-width: 760px) {
		.img-container {
			width: calc(100% - 360px);
		}

		.info {
			right: 360px;
		}

		.show-sidebar,
		.close {
			display: none;
		}

		.sidebar-container {
			transform: translateX(0);
		}
	}

	.source-on-github {
		display: flex;
		align-items: center;
		gap: 0.5rem;
		margin: 1rem;
		color: var(--dark-body-color);
		text-decoration: none;
		width: max-content;
		margin-left: auto;
		padding: 0.5rem;
	}

	.source-on-github span {
		font-size: 0.8rem;
	}

	.select-image {
		font-size: 1.1rem;
		cursor: pointer;
		text-align: center;
	}

	img {
		max-width: 100%;
		max-height: 100%;
	}

	input[type="file"] {
		display: none;
	}

	#loading {
		position: absolute;
	}

	.hide {
		display: none;
	}
</style>
