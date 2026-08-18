import type { Attempt } from "./types";

export class Session {
	readonly id: string;
	private attempts: Attempt[];
	private minCount: number;

	constructor(id: string, minCount: number = 20) {
		this.id = id;
		this.attempts = [];
		this.minCount = minCount;
	}

	addAttempt(attempt: Attempt): void {
		this.attempts.push(attempt);
	}

	checkAttempts(): boolean {
		return this.attempts.length >= this.minCount;
	}

	getAttempts(): Attempt[] {
		return [...this.attempts];
	}

	getAttemptsCount(): number {
		return this.attempts.length;
	}
}

