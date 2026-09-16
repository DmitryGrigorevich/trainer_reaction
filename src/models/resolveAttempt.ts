import type { Attempt, AttemptResult, Signal } from "./types";


export function resolveAttempt(
	signal: Signal | null,
	timeOfAppearance: number | null,
	timeOfPressing: number | null
): Attempt {

	if (!signal || timeOfAppearance === null) {
		return {
			signal: signal,
			timeOfAppearance: timeOfAppearance,
			timeOfPressing: timeOfPressing,
			result: 'miss',
			timeReaction: null
		};
	}

	let result: AttemptResult;
	let timeReaction: number | null = null;
	
	if (signal.option === 'go' && timeOfPressing !== null) {
		result = 'hit';
		timeReaction = timeOfPressing - timeOfAppearance;
	} else if (signal.option === 'go' && timeOfPressing === null) {
		result = 'miss';
	} else if (signal.option === 'noGo' && timeOfPressing === null) {
		result = 'correctMiss'
	} else {
		result = 'falseHit'
	}

	return {
		signal: signal,
		timeOfAppearance: timeOfAppearance,
		timeOfPressing: timeOfPressing,
		result: result,
		timeReaction: timeReaction
	}
}