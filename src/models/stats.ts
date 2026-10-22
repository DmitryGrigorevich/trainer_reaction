import type { Attempt, TotalStats } from "./types";

export class Stats {

	// подсчет среднего времени реакции для попыток у которых хит
	countAvgReactionTime(attempts: Attempt[]): number | null {
		const tmpResults = attempts.filter((elem) => elem.result === 'hit');
		if (tmpResults.length === 0) {
			return null;
		}

		// здесь непосредственно получаем само время реакции среднее
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

	// подсчет общей статистики и возврат объекта
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