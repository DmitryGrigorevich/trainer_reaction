export type SignalColour = 'green' | 'red' | 'blue' | 'pink'; // цвет сигнала
export type SignalShape = 'square' | 'circle'; // форма сигнала
export type SignalOption = 'go' | 'noGo'; // тип сигнала

export interface Signal {
	option: SignalOption;
	shape: SignalShape;
	colour: SignalColour;
}

/* 
hit - попадание в целевой сигнал, miss - пропуск (по времени) целевого сигнала, 
correctMiss - корректный пропуск (нецелевой сигнал), falseHit - нажатие на нецелевой сигнал
*/
export type AttemptResult = 'hit' | 'miss' | 'correctMiss' | 'falseHit';

export interface Attempt {
	signal: Signal;
	timeOfAppearance: number; // время появления сигнала
	timeOfPressing: number | null; // время нажатия (если было)
	result: AttemptResult; // результат попытки
	timeReaction: number | null;  // время реакции только для успешной попытки (hit)
}

export interface TotalStats {
	hitAttempts: number; //успешные нажатия
	correctMissAttempts: number; // корректные пропуски
	missAttempts:number; // некорректные пропуски
	falseHitAttempts: number; // неуспешные нажатия
	avgReactionTime: number | null; // среднее время, либо null 
}

export interface SessionResult {
	sessionId: string;  // id сессии
	date: string;
	stats: TotalStats;
}


