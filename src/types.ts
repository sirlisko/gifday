export interface Image {
	text: string;
	gif: {
		gif: string;
		still: string;
	};
}

export interface DailyGifs {
	[day: string]: Image;
}
