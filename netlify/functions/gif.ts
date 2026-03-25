import type { Context } from "@netlify/functions";

export default async (req: Request, context: Context) => {
	const query = new URL(req.url).searchParams.get("q");
	if (!query) {
		return new Response("Missing query parameter", { status: 400 });
	}

	const apiUrl = `${process.env.GIF_API_GET_RANDOM}${encodeURIComponent(query)}`;
	const response = await fetch(apiUrl);

	if (!response.ok) {
		return new Response("GIPHY request failed", { status: response.status });
	}

	const data = await response.json();
	return Response.json(data);
};
