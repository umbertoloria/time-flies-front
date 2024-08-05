// Types
// 2023-08-26T16:28:34Z
// v1.1

// Calendar
export type TCalendar = {
	name: string;
	color: string;
	datesInfo: TDateInfo[];
};
export type TDateInfo = {
	date: string; // Es. "2023-01-01"
	intensity?: number;
};

// Auth
export type TAuthStatus = {
	user: TAuthUser;
};
export type TAuthUser = {
	id: number;
	email: string;
};
