import { readable } from "svelte/store";

export const spacebar = readable(false, (set) => {
	if (typeof window === "undefined") {
		return;
	}

	const keydownHandler = (event: KeyboardEvent) => {
		if (event.key === " ") {
			event.preventDefault();
			set(true);
		}
	};

	const keyupHandler = (event: KeyboardEvent) => {
		if (event.key === " ") {
			set(false);
		}
	};

	document.addEventListener("keydown", keydownHandler);
	document.addEventListener("keyup", keyupHandler);

	return () => {
		document.removeEventListener("keydown", keydownHandler);
		document.removeEventListener("keyup", keyupHandler);
	};
});
