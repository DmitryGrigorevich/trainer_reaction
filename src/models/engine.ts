import type {Signal, TotalStats} from "./types.ts";

import {SignalGenerator} from "./signalGenerator.ts";
import { Session } from "./session.ts";
import { Stats } from "./stats.ts";
import { Storage } from "./storage.ts";
import { resolveAttempt } from "./resolveAttempt.ts";

//интерфейс для колбека из app которые передаются в движок
// через них обратно меняем ui 
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
	private signalTime: number | null = null; // время появления сигнала 

	private delayTime: ReturnType<typeof setTimeout> | null = null; // идентификатор времени задержки появления сиганла
	private responseTime: ReturnType<typeof setTimeout> | null = null; // идентификатор таймера времени реакции
	private cb: callback | null = null; // пока не переданы cb = null
	
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
	
	// запускаем игру (принимаем колбеки и  запускаем генерацию нового сигнала)
	start(cb: callback): void {
		this.cb = cb;
		this.nextSignal();
	}

	// используется для очистки таймеров
	// в dev режиме React может повторно выполнять useEffect
	//и если не будет очистки то старые таймеры работают, то будут дублироваться сигналы
	stop(): void {
		if (this.delayTime) {
			clearTimeout(this.delayTime);
		}
		if (this.responseTime) {
			clearTimeout(this.responseTime)
		}
	}

	// обработка пробела
	//если нет сигнала выходим из метода
	handlePress() {
		if (!this.signal) return;
		//завершаем попытку и передаем время нажатия 
		this.finishAttempt(Date.now())
	}

	// генерация и отображения след сигнала
	private nextSignal(): void {
		const {signal, delay} = this.signalGen.genNextSignal();

		// таймер ожидания появления след сигнала	
		this.delayTime = setTimeout(() => {
			this.signal = signal;
			this.signalTime = Date.now();
			
			//вызываем колбек, через который 
			// передаем в app сигнал и далее он отображается 
			this.cb?.showSignal(signal);
			
			//таймер для времени реакции нажатия
			this.responseTime = setTimeout(() => {
				//если не нажать на пробел, ты завершаем попытку с null
				this.finishAttempt(null)
			}, 1500);
		}, delay);
	}

	//завершение текущей поптыки
	private finishAttempt(time: number | null): void {
		if (this.signal === null || this.signalTime === null) return;

		if (this.responseTime !== null) {
			//очищаем таймер, чтобы попытка не завршилась повторно
			clearTimeout(this.responseTime);
			this.responseTime = null;
		}	

		// получаем характеристики попытки
		const attempt =  resolveAttempt(
			this.signal,
			this.signalTime, 
			time
		)


		this.session.addAttempt(attempt);

		// вызываем колбек, через который убираем сигнал
		this.cb?.showSignal(null);

		// вызываем колбек, через который выводим кол-во попыток текущих
		this.cb?.updateAttepmt(this.session.getAttemptsCount());

		// сбрасываем текущий сигнал перед следующей попыткой
		this.signal = null;	
		this.signalTime = null;

		// если 20 попыток
		if (this.session.checkAttempts()) {
			// записываем итогвую статистику сессии
			const stats = this.stats.countAllOption(this.session.getAttempts());

			// сохраняем результат
			this.storage.saveResult({
				sessionId: this.session.id,
				date: new Date().toISOString(),
				stats
			});

			// вызыаем колбек, через который отображаем финальную статистику
			this.cb?.showFinishStats(stats)
		} else {
			this.nextSignal()
		}
	}
}