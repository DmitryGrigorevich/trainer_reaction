import type { Attempt, TotalStats } from "./types";

export class Stats {

	countAvgReactionTime(attempts: Attempt[]): number | null {
		const tmpResults = attempts.filter((elem) => elem.result === 'hit');
		if (tmpResults.length === 0) {
			return null;
		}

		const avgTimeReaction = tmpResults.reduce((count, elem) => 
			elem.timeReaction! + count, 0) / tmpResults.length;

		return avgTimeReaction;
	}

	countHitAttempts(attempts: Attempt[]): number {
		return attempts.filter((elem) => elem.result === 'hit').length;
	}
	countCorrectMissAttempts(attempts: Attempt[]): number {
		return attempts.filter((elem) => elem.result === 'correctMiss').length;
	}

	countMissAttempts(attempts: Attempt[]): number {
		return attempts.filter((elem) => elem.result === 'miss').length;
	}

	countFalseHitAttempts(attempts: Attempt[]): number {
		return attempts.filter((elem) => elem.result === 'falseHit').length;
	}

	countAllOption(attempts: Attempt[]): TotalStats {
		return {
			hitAttempts: this.countHitAttempts(attempts),
			correctMissAttempts: this.countCorrectMissAttempts(attempts),
			missAttempts: this.countMissAttempts(attempts),
			falseHitAttempts: this.countFalseHitAttempts(attempts),
			avgReactionTime: this.countAvgReactionTime(attempts)
		}
	}
}