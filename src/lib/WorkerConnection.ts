export class WorkerConnection {
	private abortController = new AbortController();
	private worker: Worker;
	private loadingPromise: Promise<unknown>;

	processing = false;

	constructor(worker: Worker) {
		this.worker = worker;
		this.loadingPromise = this.waitForMessage();
	}

	private waitForMessage<T>(): Promise<T> {
		return new Promise<T>((resolve, reject) => {
			const handler = (event: MessageEvent<T>) => {
				this.worker.removeEventListener("message", handler);
				resolve(event.data);
			};

			this.abortController.signal.addEventListener("abort", () => {
				this.worker.removeEventListener("message", handler);
				reject(this.abortController.signal.reason);
			});

			this.worker.addEventListener("message", handler);
		});
	}

	async process<Incoming, Outgoing>(message: Incoming) {
		this.processing = true;

		await this.loadingPromise;

		const messagePromise = this.waitForMessage<Outgoing>();

		this.worker.postMessage(message);

		const result = await messagePromise;

		this.processing = false;

		return result;
	}

	terminate() {
		this.abortController.abort();
		this.worker.terminate();
	}
}
