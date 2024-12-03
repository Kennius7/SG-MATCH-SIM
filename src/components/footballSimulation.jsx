// /* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import Ball from "../assets/img/soccer-ball.png";
import ballSound from "../assets/sound/ballkick1.mp3";
import BGMatchSound from "../assets/sound/InMatchSounds1.mp3";
import { getNewPos, playAudio, pauseAudio, calcPosition, goalScorePosition } from '../utils/data';



function FootballPitchSimulation() {
    const footballPitchWidth = 320;
    const footballPitchHeight = 550;

    const GK_Ref = useRef(null);
    const LWB_Ref = useRef(null);
    const RWB_Ref = useRef(null);
    const LCB_Ref = useRef(null);
    const RCB_Ref = useRef(null);
    const LCMF_Ref = useRef(null);
    const RCMF_Ref = useRef(null);
    const LWF_Ref = useRef(null);
    const RWF_Ref = useRef(null);
    const LF_Ref = useRef(null);
    const RF_Ref = useRef(null);

    const goalBottomRef = useRef(null);
    const pitchRef = useRef(null);
    const soundRef = useRef(null);

    const [ballPosition, setBallPosition] = useState({ top: (footballPitchHeight / 2) - 10, left: (footballPitchWidth / 2) - 10 });
    const [GKPlayerPosition, setGKPlayerPosition] = useState({ top: (footballPitchHeight / 20) - 10, left: (footballPitchWidth / 2) - 15 });

    const [isStart, setIsStart] = useState(false);
    const [playCount, setPlayCount] = useState(0);
    const [isBGPlaying, setIsBGPlaying] = useState(false);
    const [audioContext, setAudioContext] = useState(null);
    const [audioBuffer, setAudioBuffer] = useState(null);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const sourceRef = useRef(null);
    const startTimeRef = useRef(null);
    const [isBouncing, setIsBouncing] = useState(false);
    
    const matchPatternArray1 = [
        { ref: GK_Ref }, { ref: LWB_Ref }, { ref: RWB_Ref }, { ref: LCB_Ref }, { ref: RCB_Ref }, { ref: LCMF_Ref },
        { ref: RCMF_Ref }, { ref: LWF_Ref }, { ref: RWF_Ref }, { ref: LF_Ref }, { ref: RF_Ref },
    ];
    const leftValue = 14;
    let posMotionValueHeight = 4;
    let posMotionValueWidth = 4;



    useEffect(() => {
        soundRef.current = new Audio(ballSound);
        soundRef.current.load();
    }, [])

    useEffect(() => {
        const initializeAudio = async () => {
            const context = new AudioContext();
            setAudioContext(context);
            const response = await fetch(BGMatchSound);
            const arrayBuffer = await response.arrayBuffer();
            const buffer = await context.decodeAudioData(arrayBuffer);
            setAudioBuffer(buffer);
        }
        initializeAudio();
    }, []);


    const playBallSound = () => {
        if (soundRef.current) {
            soundRef.current.play();
        }
    }

    const startMatch = () => {
        setIsBouncing(true);
        if (!isBGPlaying) {
            playAudio(audioContext, audioBuffer, playbackPosition, startTimeRef, sourceRef);
        }
        setTimeout(() => setIsBouncing(false), 300);
        updatePlayerPosition(GK_Ref);
        setIsBGPlaying(true);
    }

    const resetMatch = () => {
        setIsStart(false);
        setPlayCount(0);
        setBallPosition({ top: (footballPitchHeight / 2) - 10, left: (footballPitchWidth / 2) - 10 });
        pauseAudio(audioContext, sourceRef, startTimeRef, setPlaybackPosition );
        setIsBGPlaying(false);
    }

    const updateBallPosition = (refA, refB) => {
        setBallPosition((pos) => {
            const newTop = pos.top + getNewPos(refA, refB).top;
            const newLeft = pos.left + getNewPos(refA, refB).left;
            return { top: newTop, left: newLeft };
        });
    };

    const updatePlayerPosition = (ref) => {
        if (ref === GK_Ref) {
            setInterval(() => {
                setGKPlayerPosition((pos) => {
                    const newTop = pos.top + posMotionValueHeight;
                    const newLeft = pos.left + posMotionValueWidth;

                    if (newTop < 0 || newTop > footballPitchHeight * 0.1) {
                        // setPosMotionValueHeight((pos) => {
                        //     const newPos = pos * -1;
                        //     console.log("New Value: ", newPos);
                        //     return newPos;
                        // });
                        posMotionValueHeight = posMotionValueHeight * -1;
                        console.log("NewTop: ", newTop, "NewLeft: ", newLeft);
                        return { top: newTop, left: newLeft};
                    }
                    if (newLeft < Math.round(footballPitchWidth * 0.3) || newLeft > Math.round(footballPitchWidth * 0.66)) {
                        // setPosMotionValueWidth(prev => prev * -1);
                        posMotionValueWidth = posMotionValueWidth * -1;
                        console.log("NewTop: ", newTop, "NewLeft: ", newLeft);
                        return { top: newTop, left: newLeft};
                    }
                    console.log("NewTop: ", newTop, "NewLeft: ", newLeft);
                    return { top: newTop, left: newLeft};
                });
            }, 500);
        }
    }

    const kickBall = () => {
        setIsStart(true);
        playBallSound();
        if (playCount === 0) {
            calcPosition(LCMF_Ref, setBallPosition);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 1) {
            updateBallPosition(matchPatternArray1[5].ref, matchPatternArray1[6].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 2) {
            updateBallPosition(matchPatternArray1[6].ref, matchPatternArray1[7].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 3) {
            updateBallPosition(matchPatternArray1[7].ref, matchPatternArray1[8].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 4) {
            updateBallPosition(matchPatternArray1[8].ref, matchPatternArray1[9].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 5) {
            updateBallPosition(matchPatternArray1[9].ref, matchPatternArray1[10].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 6) {
            goalScorePosition(goalBottomRef, setBallPosition);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
    };



    return (
        <section className='bg-[#e9e7e0] h-dvh flex sm:flex-row flex-col sm:justify-center justify-center 
            items-center'>
            {/* Football Pitch */}
            <div 
                ref={pitchRef} 
                className={`relative w-[320px] h-[550px] 
                bg-[#006400] border-[2px] border-white rounded-[5px] overflow-hidden`}
            >
                {/* Center Circle */}
                <div 
                    className='absolute top-[50%] left-[50%] w-[60px] h-[60px] -mt-[30px] -ml-[30px] 
                    border-[2px] border-white rounded-[999px]'>
                </div>
                {/* Center Line */}
                <div 
                    className='absolute top-[50%] left-0 w-full h-[1px] bg-white border-[0.5px] border-white'>
                </div>
                {/* Goal Box Top */}
                <div className={`absolute leftCalc1 top-0 w-[80px] h-[20px] bg-white`}></div>
                {/* Goal Box Bottom */}
                <div ref={goalBottomRef} className={`absolute leftCalc1 bottom-0 w-[80px] h-[20px] bg-white`}></div>
                {/* 18 Yard Box Top */}
                <div className='absolute leftCalc2 top-0 w-[120px] h-[40px] bg-transparent border-[1px] border-white'></div>
                {/* 18 Yard Box Bottom */}
                <div className='absolute leftCalc2 bottom-0 w-[120px] h-[40px] bg-transparent border-[1px] border-white'></div>

                {/*
                    <svg 
                        style={{ pointerEvents: 'none' }} 
                        className='absolute top-[10px] left-[8px] w-full h-full'
                    >
                        <polyline 
                            fill="none"
                            stroke="rgba(255, 255, 255, 0.5)"
                            strokeWidth="2"
                            points={trail.map((pos) => `${pos.left},${pos.top}`).join(' ')} 
                        />
                    </svg>
                */}

                {/* Soccer ball */}
                <div 
                    className={`absolute w-[15px] h-[15px] bg-white rounded-full cursor-pointer ballMotion 
                        ${isStart ? "animate-pulseBorder" : "animate-none"}`}
                    style={{ transform: `translate(${ballPosition.left}px, ${ballPosition.top}px)` }}
                >
                    <img 
                        src={Ball} 
                        alt='Ball'
                        className={`w-full h-full ${isStart ? "animate-spin" : "animate-none"}`} 
                    />
                </div>

                {/* Players */}
                <div className={`absolute top-0 left-0 w-[320px] h-[550px] bg-transparent`}>
                    {/* Home Players */}
                    <div 
                        ref={GK_Ref} 
                        style={{ transform: `translate(${GKPlayerPosition.left}px, ${GKPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 
                        flex justify-center items-center text-[11px] text-white ballMotion">GK</div>

                    <div ref={LWB_Ref} style={{ left: `calc(20% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[84px]">H</div>
                    <div ref={LCB_Ref} style={{ left: `calc(40% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[84px]">H</div>
                    <div ref={RCB_Ref} style={{ left: `calc(60% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[84px]">H</div>
                    <div ref={RWB_Ref} style={{ left: `calc(80% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[84px]">H</div>
                    
                    <div ref={LWF_Ref} style={{ left: `calc(20% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[250px]">H</div>
                    <div ref={LCMF_Ref} style={{ left: `calc(40% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[250px]">H</div>
                    <div ref={RCMF_Ref} style={{ left: `calc(60% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[250px]">H</div>
                    <div ref={RWF_Ref} style={{ left: `calc(80% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[250px]">H</div>

                    <div ref={LF_Ref} style={{ left: `calc(40% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[420px]">H</div>
                    <div ref={RF_Ref} style={{ left: `calc(60% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[420px]">H</div>

                    {/* Away Players */}
                    <div style={{ left: `calc(40% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[115px]">A</div>
                    <div style={{ left: `calc(60% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[115px]">A</div>

                    <div style={{ left: `calc(20% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[280px]">A</div>
                    <div style={{ left: `calc(40% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[280px]">A</div>
                    <div style={{ left: `calc(60% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[280px]">A</div>
                    <div style={{ left: `calc(80% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[280px]">A</div>

                    <div style={{ left: `calc(20% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[450px]">A</div>
                    <div style={{ left: `calc(40% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[450px]">A</div>
                    <div style={{ left: `calc(60% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[450px]">A</div>
                    <div style={{ left: `calc(80% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[450px]">A</div>
                    <div style={{ left: `calc(50% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-red-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[500px]">A</div>
                </div>
            </div>

            {/* Button controls */}
            <div className='sm:w-[200px] w-[250px] flex flex-col justify-center items-center pb-2'>
                <button onClick={startMatch} className={`rounded-[25px] bg-green-500 text-gray-800 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[14px] font-semibold transition-transform duration-300 
                    ${isBouncing ? "animate-buttonBounce" : "animate-none" }`}>
                    Start Match!
                </button>
                <button onClick={kickBall} className='rounded-[25px] bg-cyan-500 text-gray-800 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[14px] font-semibold'>
                    Kick Ball!
                </button>
                <button onClick={resetMatch} className='rounded-[25px] bg-red-500 text-gray-800 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[14px] my-2 font-semibold'>
                    Reset Match!
                </button>
            </div>
        </section>
    );

}



export default FootballPitchSimulation;