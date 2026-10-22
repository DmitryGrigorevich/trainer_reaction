import { useEffect, useState } from 'react';

import { TrainerEngine } from './models/engine.ts';
import { SignalGenerator } from './models/signalGenerator.ts';
import { Session } from './models/session.ts';
import { Storage } from './models/storage.ts';

import type { Signal, TotalStats } from './models/types.ts';

function App() {
	// состояния на сигнал, кол-во попыток и статистику
	const [signal, setSignal] = useState<Signal | null>(null);
	const [attempts, setAttempts] = useState(0);
	const [stats, setStats] = useState<TotalStats | null>(null);

	//юзэфект для запуска движка
	//регистрация обработчки клавиатуры и очистки
	useEffect(() => {
		const engine = new TrainerEngine(
			new SignalGenerator(),
			new Session(Date.now().toString()),
			new Storage()
		);
		//запуска движка и передача колбеков
		engine.start({
			showSignal: (signal) => {
				setSignal(signal);
			},
			updateAttepmt: (count) => {
				setAttempts(count);
			},

			showFinishStats: (stats) => {
				setStats(stats);
			}
		});

		//обработчки события 
		//если пробел то вызываем handlePress
		const handler = (event: KeyboardEvent) => {
			if (event.code === 'Space') {
				event.preventDefault();
				engine.handlePress();
			}
		};
		
		//регистрация обработчки события 
		window.addEventListener('keydown', handler);

		//очистка useEffect
		return () => {
			// удаляем обработчки клавиатуры
			window.removeEventListener('keydown', handler);
			
			//отменяем таймеры двжика
			engine.stop();
		};
	}, []);

	//если статс готов, то финальные результаты
	if (stats) {
		return (
			<div>
				<h1>Сессия завершена</h1>
				<p>Успешных нажатий: {stats.hitAttempts}</p>
				<p>Пропусков: {stats.missAttempts}</p>
				<p>Корректных пропусков: {stats.correctMissAttempts}</p>
				<p>Ложных нажатий: {stats.falseHitAttempts}</p>
				<p>
					Среднее время реакции:
					{' '}
					{stats.avgReactionTime ?? 'нет данных'}
				</p>
			</div>
		);
	}
	//иначе играем
	return (
		<div
			style={{
				display: 'flex',
				flexDirection: 'column',
				alignItems: 'center',
				marginTop: '100px'
			}}
		>
			<h1>Тренажёр реакции</h1>
			<p>Попыток: {attempts} / 20</p>
			{signal ? (
				<div
					style={{
						width: '150px',
						height: '150px',
						borderRadius: '50%',
						backgroundColor: signal.colour
					}}
				/>
				) : (
					<p>Ожидайте сигнал...</p>
				)}
			<p>Нажимайте ПРОБЕЛ только на целевой сигнал.</p>
		</div>
	)
}

export default App;

