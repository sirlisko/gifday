import type { DailyGifs, Image } from "../types";
import { supabase } from "./supabase";

export async function loadGifs(userId: string): Promise<DailyGifs> {
	const { data, error } = await supabase
		.from("daily_gifs")
		.select("day_key, gif_data")
		.eq("user_id", userId);

	if (error) throw error;

	return Object.fromEntries(
		(data ?? []).map((row) => [row.day_key, row.gif_data as Image]),
	);
}

export async function saveGif(
	userId: string,
	dayKey: string,
	image: Image,
): Promise<void> {
	const { error } = await supabase.from("daily_gifs").upsert(
		{
			user_id: userId,
			day_key: dayKey,
			gif_data: image,
			updated_at: new Date().toISOString(),
		},
		{ onConflict: "user_id,day_key" },
	);

	if (error) throw error;
}
