import { useRef } from "react"


const useSoundEffect = (soundPath) => {
    const sound = useRef(new Audio(soundPath));
    const play = () => {
        sound.current.play();
    }
    return play;
}

export default useSoundEffect;
