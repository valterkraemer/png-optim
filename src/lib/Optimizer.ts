import MyWorker from "./worker?worker";

import type {
	OptimizeIncomingMessage,
	OptimizeOutgoingMessage,
	OptimizeOptions,
} from "./worker";
import { Debouncer } from "./Debouncer";
import { WorkerConnection } from "./WorkerConnection";

export class Optimizer {
	private workerConnection: WorkerConnection | undefined = undefined;

	private currentBlob: Blob | undefined = undefined;
	private cache = new Map<string, Blob>();
	private debouncer = new Debouncer(150);

	async optimize(blob: Blob, options: OptimizeOptions) {
		if (blob !== this.currentBlob) {
			this.cache = new Map();
			this.currentBlob = blob;
		}

		const optionsString = JSON.stringify(options);
		const found = this.cache.get(optionsString);

		if (found) {
			// Set the item last in the Map
			this.cache.delete(optionsString);
			this.cache.set(optionsString, found);
			return found;
		}

		if (!this.workerConnection) {
			this.workerConnection = new WorkerConnection(new MyWorker());
		} else if (this.workerConnection.processing) {
			this.workerConnection.terminate();
			this.workerConnection = new WorkerConnection(new MyWorker());
			this.debouncer.start();
		}

		await this.debouncer.wait();

		const outputBlob = await this.workerConnection.process<
			OptimizeIncomingMessage,
			OptimizeOutgoingMessage
		>({
			blob,
			options,
		});

		// Cleaning up old values in cache
		if (this.cache.size > 9) {
			const oldest = this.cache.keys().next();
			this.cache.delete(oldest.value);
		}

		this.cache.set(optionsString, outputBlob);

		return outputBlob;
	}
}
