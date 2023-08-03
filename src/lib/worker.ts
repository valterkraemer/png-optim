import { ImagequantImage, Imagequant } from "imagequant";

export type OptimizeOptions = {
	gamma: number /** 0 - 1 */;
	max_colors: number /** 2-256 */;
	max_quality: number /** 0-100 */;
	speed: number /** 1-10 */;
	min_posterization: number /** 0-4 */;
};

export type OptimizeIncomingMessage = {
	blob: Blob;
	options: OptimizeOptions;
};

export type OptimizeOutgoingMessage = Blob;

self.onmessage = async ({ data }: MessageEvent<OptimizeIncomingMessage>) => {
	const { blob, options } = data;

	const bitmap = await createImageBitmap(blob);
	const { width, height } = bitmap;

	const canvas = new OffscreenCanvas(width, height);
	const context = canvas.getContext("2d")!;
	context.drawImage(bitmap, 0, 0, width, height);

	const imageData = context.getImageData(0, 0, width, height);
	const uint8Array = new Uint8Array(imageData.data.buffer);

	const image = new ImagequantImage(uint8Array, width, height, options.gamma);

	const instance = new Imagequant();

	instance.set_max_colors(options.max_colors);
	instance.set_quality(0, options.max_quality);
	instance.set_min_posterization(options.min_posterization);
	instance.set_speed(options.speed);

	const output = instance.process(image);

	const outputBlob = new Blob([output.buffer], { type: "image/png" });

	self.postMessage(outputBlob);
};

self.postMessage("loaded");
