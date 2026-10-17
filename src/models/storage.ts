import type { SessionResult } from "./types";


export class Storage {
	private readonly storageKey: string = 'trainer_results';

	saveResult(result: SessionResult): void {
		const tmpResults = this.getAllResults();
		tmpResults.push(result);
		localStorage.setItem(this.storageKey, JSON.stringify(tmpResults));
	}

	getAllResults(): SessionResult[] {
		const tmpResults = localStorage.getItem(this.storageKey);
		return tmpResults !== null ? JSON.parse(tmpResults) : [];
	}
}