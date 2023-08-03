export const formatSize = (size: number): string => {
	if (!size) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB"];

	const i = Math.floor(Math.log(size) / Math.log(k));
	const decimals = i === 0 ? 0 : 2;

	return `${(size / Math.pow(k, i)).toFixed(decimals)} ${sizes[i]}`;
};
