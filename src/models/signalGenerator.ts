import type { Signal, SignalColour, SignalShape, SignalOption } from "./types";

export class SignalGenerator {
	constructor(
		private minDelay: number = 2000,
		private maxDelay: number = 6000,
		private indProbably: number = 0.6 // коэффицент go/noGo сигналов
	) {}

	private signalRandom (): SignalOption{
		const dig = Math.random();
		return this.indProbably >= dig ? 'go' : 'noGo';
	}

	private colourRandom(option: SignalOption): SignalColour {
		if (option === 'go') {
			return 'green';
		}
		const restColour: SignalColour[] = ['red', 'blue', 'pink'];
		const needColour = Math.round(Math.random() * (restColour.length - 1))

		return restColour[needColour];
	}

	private shapeRandom (): SignalShape{
		const dig = Math.random();
		return dig > 0.5 ? 'square' : 'circle';
	}

	private delayRandom (): number {
		return Math.floor(Math.random() * (this.maxDelay - this.minDelay) + this.minDelay);
	}

	genNextSignal(): {signal: Signal; delay: number} { 
		const option = this.signalRandom();
		const colour = this.colourRandom(option);
		const shape = this.shapeRandom();

		const signal: Signal = {
			option: option,
			colour: colour,
			shape: shape
		};
		const delay = this.delayRandom();

		return {signal, delay}
	}
}

const tmp = new SignalGenerator();

console.log(tmp.genNextSignal())
console.log(tmp.genNextSignal())
console.log(tmp.genNextSignal())
console.log(tmp.genNextSignal())
console.log(tmp.genNextSignal())
console.log(tmp.genNextSignal())