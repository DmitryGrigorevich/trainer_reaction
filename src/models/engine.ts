import type {Signal, TotalStats} from "./types.ts";

import {SignalGenerator} from "./signalGenerator.ts";
import { Session } from "./session.ts";
import { Stats } from "./stats.ts";
import { Storage } from "./storage.ts";
import { resolveAttempt } from "./resolveAttempt.ts";

export interface callback {
	showSignal: (signal: Signal | null) => void;
	updateAttepmt: (count: number) => void;
	showFinishStats: (stats: TotalStats) => void;
}

export class TrainerEngine {
	private signalGen: SignalGenerator;
	private session: Session;
	private storage: Storage;
	private stats: Stats;
	private signal: Signal | null = null;
	private signalTime: number | null = null;

	private delayTime: ReturnType<typeof setTimeout> | null = null;
	private responseTime: ReturnType<typeof setTimeout> | null = null;
	private cb: callback | null = null;
	
	constructor(
		signalGen: SignalGenerator,
		session:Session, 
		storage: Storage
	) {
		this.signalGen = signalGen;
		this.session = session;
		this.storage = storage;
		this.stats = new Stats();
	}
	
	start(cb: callback): void {
		this.cb = cb;
		this.nextSignal();
	}

	stop(): void {
		if (this.delayTime) {
			clearTimeout(this.delayTime);
		}
		if (this.responseTime) {
			clearTimeout(this.responseTime)
		}
	}

	handlePress() {
		if (!this.signal) return;
		this.finishAttempt(Date.now())
	}

	private nextSignal(): void {
		const {signal, delay} = this.signalGen.genNextSignal();

		this.delayTime = setTimeout(() => {
			this.signal = signal;
			this.signalTime = Date.now();

			this.cb?.showSignal(signal);
			this.responseTime = setTimeout(() => {
				this.finishAttempt(null)
			}, 1500);
		}, delay);
	}

	private finishAttempt(time: number | null): void {
		const attempt =  resolveAttempt(
			this.signal,
			this.signalTime, 
			time
		)
		this.session.addAttempt(attempt);

		this.cb?.showSignal(null);

		this.cb?.updateAttepmt(this.session.getAttemptsCount());

		this.signal = null;
		this.signalTime = null;

		if (this.session.checkAttempts()) {
			const stats = this.stats.countAllOption(this.session.getAttempts());

			this.storage.saveResult({
				sessionId: this.session.id,
				date: new Date().toISOString(),
				stats
			});

			this.cb?.showFinishStats(stats)
		} else {
			this.nextSignal()
		}
	}
}