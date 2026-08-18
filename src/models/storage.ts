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

	private sortResult(): SessionResult[] | null {
		const tmpResults = this.getAllResults();
		const needResults = tmpResults.filter((elem) => elem.stats.avgReactionTime !== null);
		if (needResults.length === 0) {
			return null;
		}

		needResults.sort((a, b) => a.stats.avgReactionTime! - b.stats.avgReactionTime!);
		return needResults;
	}
	
	getBestResult(): SessionResult | null {
		const tmpResults = this.sortResult();
		
		return tmpResults !== null ? tmpResults[0] : null;
	}

	getTopTenResults(): SessionResult[] | null {
		const tmpResults = this.sortResult();

		if (tmpResults === null) {
			return null
		} else {
			return tmpResults.slice(0, 10);
		}
	}
}