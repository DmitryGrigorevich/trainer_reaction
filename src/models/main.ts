import type {Attempt, Signal} from "./type.ts";

import {SignalGenerator} from "./signalGenerator.ts";
import { Session } from "./session.ts";
import { Stats } from "./stats.ts";
import { Storage } from "./storage.ts";
import { resolveAttempt } from "./resolveAttempt.ts";


export class TrainerEngine {
	private signalGen: SignalGenerator;
	private session: Session;
	private storage: Storage;
	private delayNewSignal: ReturnType<typeof setTimeout> | null;

	constructor(
		signalGen: SignalGenerator,
		session:Session, 
		storage: Storage
	) {
		this.signalGen = signalGen;
		this.session = session;
		this.storage = storage;
		this.delayNewSignal = null;

	}
	


	fisrtSignal() {

	}

	handlePress() {

	}

	showSignal() {

	}

	nextSignal() {
		const {signal, delay} = this.signalGen.genNextSignal();

	}



}

