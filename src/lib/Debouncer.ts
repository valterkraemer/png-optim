export class Debouncer {
	private abortController = new AbortController();
	private delay: number;
	private started = false;

	constructor(delay: number) {
		this.delay = delay;
	}

	start() {
		this.started = true;
	}

	async wait() {
		if (!this.started) {
			return;
		}

		this.abortController.abort();
		this.abortController = new AbortController();

		return new Promise((resolve, reject) => {
			const handler = (event: Event) => {
				clearTimeout(timeout);

				const target = event.target as AbortSignal;

				reject(target.reason);
			};

			const timeout = setTimeout(() => {
				this.abortController.signal.removeEventListener("abort", handler);
				this.started = false;
				resolve(undefined);
			}, this.delay);

			this.abortController.signal.addEventListener("abort", handler);
		});
	}
}
