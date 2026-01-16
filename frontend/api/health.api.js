import { apiFetch } from "./client";

export const getMlHealth = () => {
	return apiFetch("/ml/health");
};

export const getHealth = () => {
	return apiFetch("/health");
};

export const postEcho = (payload) => {
	return apiFetch("/echo", {
		method: "POST",
		body: JSON.stringify(payload),
	});
};
