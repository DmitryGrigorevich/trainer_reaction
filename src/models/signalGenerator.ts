import type { Signal, SignalColour, SignalOption } from "./types";

export class SignalGenerator {
	constructor(
		private minDelay: number = 2000,
		private maxDelay: number = 6000,
		private indProbably: number = 0.6 // коэффицент go/noGo сигналов
	) {}

	// какой сигнал генерировать 
	private signalRandom (): SignalOption{
		const dig = Math.random();
		return this.indProbably >= dig ? 'go' : 'noGo';
	}

	// цвет сигнала
	private colourRandom(option: SignalOption): SignalColour {
		if (option === 'go') {
			return 'green';
		}
		const restColour: SignalColour[] = ['red', 'blue', 'pink'];
		const needColour = Math.round(Math.random() * (restColour.length - 1))

		return restColour[needColour];
	}

	// для расчета случайно задержки
	private delayRandom (): number {
		return Math.floor(Math.random() * (this.maxDelay - this.minDelay) + this.minDelay);
	}

	//генерируем следующий сигнал
	genNextSignal(): {signal: Signal; delay: number} { 
		//го или не го и далее цвет соответствующий
		const option = this.signalRandom();
		const colour = this.colourRandom(option);

		const signal: Signal = {
			option: option,
			colour: colour,
		};
		const delay = this.delayRandom();

		//возвращаем сигнал и задержку
		return {signal, delay}
	}
}