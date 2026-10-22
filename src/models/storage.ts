import type { SessionResult } from "./types";


export class Storage {
	// ключ для локал сторейдж
	private readonly storageKey: string = 'trainer_results';

	// сохраняем результат
	saveResult(result: SessionResult): void {
		// получаем массив с результатами
		const tmpResults = this.getAllResults();
		tmpResults.push(result);
		// добавляем по ключу в локал сторейдж статистику по сессии
		localStorage.setItem(this.storageKey, JSON.stringify(tmpResults));
	}

	getAllResults(): SessionResult[] {
		const tmpResults = localStorage.getItem(this.storageKey);
		
		return tmpResults !== null ? JSON.parse(tmpResults) : [];
	}
}