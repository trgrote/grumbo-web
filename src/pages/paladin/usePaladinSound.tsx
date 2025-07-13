import useSound from 'use-sound';
import monday from '@/assets/sounds/monday.wav';
import die from '@/assets/sounds/die.wav';
import eat_shit from '@/assets/sounds/eat_shit.wav';
import sxsw from '@/assets/sounds/sxsw.wav';
import understand_time from '@/assets/sounds/understand_time.wav';

export function usePaladinSound() {
	// Sound Player
	const [playMondaySound] = useSound(monday);
	const [playDieSound] = useSound(die);
	const [playEatShit] = useSound(eat_shit);
	const [playSXS] = useSound(sxsw);
	const [playUnderstandTime] = useSound(understand_time);

	const allSoundCalls = [playMondaySound, playDieSound, playEatShit, playSXS, playUnderstandTime];

	const playRandomSound = () => {
		const randomIndex = Math.floor(Math.random() * allSoundCalls.length);
		const playSound = allSoundCalls[randomIndex];
		playSound();
	};

	return playRandomSound;
}