/* eslint-disable no-unused-vars */
// /* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import Ball from "../assets/img/soccer-ball.png";
import ballSound from "../assets/sound/ballkick1.mp3";
import BGMatchSound from "../assets/sound/InMatchSounds1.mp3";
import { 
    getNewPos, playAudio, pauseAudio, calcPosition, goalScorePosition, updatePlayerPosition
} from '../utils/data';
import { playerPosData } from '../utils/playerPositionData';
import { useNavigate } from 'react-router-dom';
import FieldMapLines from './FieldMapLines';



function FootballSimulation() {
    const navigate = useNavigate();
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

    const [ballPosition, setBallPosition] = useState({ 
        top: (footballPitchHeight / 2) - 10, left: (footballPitchWidth / 2) - 10 
    });

    const [GKPlayerPosition, setGKPlayerPosition] = useState({ 
        top: (footballPitchHeight / 20) - 10, left: (footballPitchWidth / 2) - 15 
    });
    const [LWBPlayerPosition, setLWBPlayerPosition] = useState({ 
        top: (footballPitchHeight / 6) - 10, left: (footballPitchWidth / 5) - 15 
    });
    const [RWBPlayerPosition, setRWBPlayerPosition] = useState({ 
        top: (footballPitchHeight / 6) - 10, left: ((footballPitchWidth / 5) * 4) - 15 
    });
    const [LCBPlayerPosition, setLCBPlayerPosition] = useState({ 
        top: (footballPitchHeight / 6) - 10, left: ((footballPitchWidth / 5) * 2) - 15 
    });
    const [RCBPlayerPosition, setRCBPlayerPosition] = useState({ 
        top: (footballPitchHeight / 6) - 10, left: ((footballPitchWidth / 5) * 3) - 15 
    });

    const [LWFPlayerPosition, setLWFPlayerPosition] = useState({ 
        top: (footballPitchHeight / 2) - 30, left: (footballPitchWidth / 5) - 15 
    });
    const [RWFPlayerPosition, setRWFPlayerPosition] = useState({ 
        top: (footballPitchHeight / 2) - 30, left: ((footballPitchWidth / 5) * 4) - 15 
    });
    const [LMFPlayerPosition, setLMFPlayerPosition] = useState({ 
        top: (footballPitchHeight / 2) - 30, left: ((footballPitchWidth / 5) * 2) - 15 
    });
    const [RMFPlayerPosition, setRMFPlayerPosition] = useState({ 
        top: (footballPitchHeight / 2) - 30, left: ((footballPitchWidth / 5) * 3) - 15 
    });

    const [LFPlayerPosition, setLFPlayerPosition] = useState({ 
        top: (footballPitchHeight / 1.2) - 40, left: ((footballPitchWidth / 5) * 2) - 15 
    });
    const [RFPlayerPosition, setRFPlayerPosition] = useState({ 
        top: (footballPitchHeight / 1.2) - 40, left: ((footballPitchWidth / 5) * 3) - 15 
    });


    const [isStart, setIsStart] = useState(false);
    const [playCount, setPlayCount] = useState(0);
    const [isBGPlaying, setIsBGPlaying] = useState(false);
    const [audioContext, setAudioContext] = useState(null);
    const [audioBuffer, setAudioBuffer] = useState(null);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const sourceRef = useRef(null);
    const startTimeRef = useRef(null);
    const [isBouncing, setIsBouncing] = useState(false);
    const [polarity1, setPolarity1] = useState(1);
    const [polarity2, setPolarity2] = useState(-1);
    const [polarity3, setPolarity3] = useState(1);
    const [polarity4, setPolarity4] = useState(-1);
    const [polarity5, setPolarity5] = useState(1);
    const [polarity6, setPolarity6] = useState(-1);
    const [polarity7, setPolarity7] = useState(1);
    const [polarity8, setPolarity8] = useState(-1);
    const [isClearInterval, setIsClearInterval] = useState(false);
    const [currentRef, setCurrentRef] = useState("");
    
    const matchPatternArray1 = [
        { ref: GK_Ref }, { ref: LWB_Ref }, { ref: RWB_Ref }, { ref: LCB_Ref }, { ref: RCB_Ref }, { ref: LCMF_Ref },
        { ref: RCMF_Ref }, { ref: LWF_Ref }, { ref: RWF_Ref }, { ref: LF_Ref }, { ref: RF_Ref },
    ];
    const leftValue = 14;

    // let posMotionValueHeight = randomValueRange(1, 3);
    // let posMotionValueWidth = randomValueRange(1, 3);
    let posMotionValueHeight = 2;
    let posMotionValueWidth = 2;
    // console.log("Random Numbers from 1 to 3:>>>>", randomValueRange(1, 3));



    useEffect(() => {
        soundRef.current = new Audio(ballSound);
        soundRef.current.load();
    }, [])

    useEffect(() => {
        const polarityInterval = setInterval(() => {
            const rand = Math.round(Math.random() * 4);
            // console.log("!!!!!!!!!!!Random Num: ", rand);
            if (rand <= 2) {
                setPolarity1(-1);
                setPolarity2(1);
                setPolarity3(-1);
                setPolarity4(1);
                setPolarity5(-1);
                setPolarity6(1);
                setPolarity7(-1);
                setPolarity8(1);
                // console.log("=======>Polarity Num1: ", polarity);
            } else { 
                setPolarity1(1);
                setPolarity2(-1);
                setPolarity3(1);
                setPolarity4(-1);
                setPolarity5(1);
                setPolarity6(-1);
                setPolarity7(1);
                setPolarity8(-1);
                // console.log("=======>Polarity Num2: ", polarity);
            }
        }, 2000)
    
        return () => {
            clearInterval(polarityInterval);
        }

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

            updatePlayerPosition(
                setGKPlayerPosition, posMotionValueHeight, posMotionValueWidth, polarity1, 
                playerPosData.GK_POS.topDiv, playerPosData.GK_POS.topSub, playerPosData.GK_POS.bottomDiv, 
                playerPosData.GK_POS.bottomSub, playerPosData.GK_POS.leftDiv, playerPosData.GK_POS.leftSub, 
                playerPosData.GK_POS.rightDiv, playerPosData.GK_POS.rightSub, isClearInterval
            );
            updatePlayerPosition(
                setLWBPlayerPosition, posMotionValueHeight, posMotionValueWidth, polarity2, 
                playerPosData.LWB_POS.topDiv, playerPosData.LWB_POS.topSub, playerPosData.LWB_POS.bottomDiv, 
                playerPosData.LWB_POS.bottomSub, playerPosData.LWB_POS.leftDiv, playerPosData.LWB_POS.leftSub, 
                playerPosData.LWB_POS.rightDiv, playerPosData.LWB_POS.rightSub, isClearInterval
            );
            updatePlayerPosition(
                setRWBPlayerPosition, posMotionValueHeight, posMotionValueWidth, polarity3, 
                playerPosData.RWB_POS.topDiv, playerPosData.RWB_POS.topSub, playerPosData.RWB_POS.bottomDiv, 
                playerPosData.RWB_POS.bottomSub, playerPosData.RWB_POS.leftDiv, playerPosData.RWB_POS.leftSub, 
                playerPosData.RWB_POS.rightDiv, playerPosData.RWB_POS.rightSub, isClearInterval
            );
            updatePlayerPosition(
                setLCBPlayerPosition, posMotionValueHeight, posMotionValueWidth, polarity4, 
                playerPosData.LCB_POS.topDiv, playerPosData.LCB_POS.topSub, playerPosData.LCB_POS.bottomDiv, 
                playerPosData.LCB_POS.bottomSub, playerPosData.LCB_POS.leftDiv, playerPosData.LCB_POS.leftSub, 
                playerPosData.LCB_POS.rightDiv, playerPosData.LCB_POS.rightSub, isClearInterval
            );
            updatePlayerPosition(
                setRCBPlayerPosition, posMotionValueHeight, posMotionValueWidth, polarity5, 
                playerPosData.RCB_POS.topDiv, playerPosData.RCB_POS.topSub, playerPosData.RCB_POS.bottomDiv, 
                playerPosData.RCB_POS.bottomSub, playerPosData.RCB_POS.leftDiv, playerPosData.RCB_POS.leftSub, 
                playerPosData.RCB_POS.rightDiv, playerPosData.RCB_POS.rightSub, isClearInterval
            );
            updatePlayerPosition(
                setLWFPlayerPosition, posMotionValueHeight, posMotionValueWidth, polarity6, 
                playerPosData.LWF_POS.topDiv, playerPosData.LWF_POS.topSub, playerPosData.LWF_POS.bottomDiv, 
                playerPosData.LWF_POS.bottomSub, playerPosData.LWF_POS.leftDiv, playerPosData.LWF_POS.leftSub, 
                playerPosData.LWF_POS.rightDiv, playerPosData.LWF_POS.rightSub, isClearInterval
            );
            updatePlayerPosition(
                setRWFPlayerPosition, posMotionValueHeight, posMotionValueWidth, polarity7, 
                playerPosData.RWF_POS.topDiv, playerPosData.RWF_POS.topSub, playerPosData.RWF_POS.bottomDiv, 
                playerPosData.RWF_POS.bottomSub, playerPosData.RWF_POS.leftDiv, playerPosData.RWF_POS.leftSub, 
                playerPosData.RWF_POS.rightDiv, playerPosData.RWF_POS.rightSub, isClearInterval
            );
            updatePlayerPosition(
                setLMFPlayerPosition, posMotionValueHeight, posMotionValueWidth, polarity8, 
                playerPosData.LMF_POS.topDiv, playerPosData.LMF_POS.topSub, playerPosData.LMF_POS.bottomDiv, 
                playerPosData.LMF_POS.bottomSub, playerPosData.LMF_POS.leftDiv, playerPosData.LMF_POS.leftSub, 
                playerPosData.LMF_POS.rightDiv, playerPosData.LMF_POS.rightSub, isClearInterval
            );
            updatePlayerPosition(
                setRMFPlayerPosition, posMotionValueHeight, posMotionValueWidth, polarity1, 
                playerPosData.RMF_POS.topDiv, playerPosData.RMF_POS.topSub, playerPosData.RMF_POS.bottomDiv, 
                playerPosData.RMF_POS.bottomSub, playerPosData.RMF_POS.leftDiv, playerPosData.RMF_POS.leftSub, 
                playerPosData.RMF_POS.rightDiv, playerPosData.RMF_POS.rightSub, isClearInterval
            );
        }
        setTimeout(() => setIsBouncing(false), 300);
        setIsBGPlaying(true);
    }

    const resetMatch = () => {
        setIsStart(false);
        setPlayCount(0);
        setIsBGPlaying(false);
        setIsClearInterval(true);
        setBallPosition({ top: (footballPitchHeight / 2) - 10, left: (footballPitchWidth / 2) - 10 });
        setGKPlayerPosition({ top: (footballPitchHeight / 20) - 10, left: (footballPitchWidth / 2) - 15 });
        setLWBPlayerPosition({ top: (footballPitchHeight / 6) - 10, left: (footballPitchWidth / 5) - 15 });
        setRWBPlayerPosition({ top: (footballPitchHeight / 6) - 10, left: ((footballPitchWidth / 5) * 4) - 15 });
        setLCBPlayerPosition({ top: (footballPitchHeight / 6) - 10, left: ((footballPitchWidth / 5) * 2) - 15 });
        setRCBPlayerPosition({ top: (footballPitchHeight / 6) - 10, left: ((footballPitchWidth / 5) * 3) - 15 });
        setLWFPlayerPosition({ top: (footballPitchHeight / 2) - 30, left: (footballPitchWidth / 5) - 15 })
        setRWFPlayerPosition({ top: (footballPitchHeight / 2) - 30, left: ((footballPitchWidth / 5) * 4) - 15 })
        setLMFPlayerPosition({ top: (footballPitchHeight / 2) - 30, left: ((footballPitchWidth / 5) * 2) - 15 })
        setRMFPlayerPosition({ top: (footballPitchHeight / 2) - 30, left: ((footballPitchWidth / 5) * 3) - 15 })
        pauseAudio(audioContext, sourceRef, startTimeRef, setPlaybackPosition );
    }

    const updateBallPosition = (refA, refB) => {
        setBallPosition((pos) => {
            const newTop = pos.top + getNewPos(refA, refB).top;
            const newLeft = pos.left + getNewPos(refA, refB).left;
            console.log("Ball Position:>>>>", newLeft, newTop);
            return { top: newTop, left: newLeft };
        });
    };




    const kickBall = () => {
        setIsStart(true);
        playBallSound();
        if (playCount === 0) {
            calcPosition(LCMF_Ref, setBallPosition);
            setCurrentRef(LCMF_Ref.current.innerText);
            setPlayCount(prev => prev + 1);
            const ballMotionInterval = setInterval(() => {
                const ballStickMotion = (ref) => {
                    // let continueRunning = true;
                    // if (!continueRunning) {
                    //     console.log("Play count 0 running stopped");
                    //     return;
                    // }

                    if (ref.current) {
                        let translateX = 0;
                        let translateY = 0;
                        const style = window.getComputedStyle(ref.current);
                        const transform = style.transform || style.webkitTransform || style.mozTransform;
                        if (transform && transform !== "none") {
                            const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(", ");
                            translateX = parseFloat(matrix[4]);
                            translateY = parseFloat(matrix[5]);
                        }
                        
                        console.log("Ref:>>>>", ref.current.innerText, "Position Vals:>>>>>", { translateX, translateY });
                        setTimeout(() => ballStickMotion(LCMF_Ref), 200);
                        return { translateX, translateY };
                    }
                }
                // ballStickMotion(LCMF_Ref);
                setBallPosition({ ...ballPosition, top: ballStickMotion(LCMF_Ref).translateY, left: ballStickMotion(LCMF_Ref).translateX })
            }, 300);


            console.log("Match Count: ", playCount);
            console.log("Current Ref:>>>>", currentRef);
        }
        if (playCount === 1) {
            updateBallPosition(matchPatternArray1[5].ref, matchPatternArray1[6].ref);
            setCurrentRef(matchPatternArray1[6].ref.current.innerText);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
            console.log("Current Ref:>>>>", currentRef);
        }
        if (playCount === 2) {
            updateBallPosition(matchPatternArray1[6].ref, matchPatternArray1[7].ref);
            setCurrentRef(matchPatternArray1[7].ref.current.innerText);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
            console.log("Current Ref:>>>>", currentRef);
        }
        if (playCount === 3) {
            updateBallPosition(matchPatternArray1[7].ref, matchPatternArray1[2].ref);
            setCurrentRef(matchPatternArray1[2].ref.current.innerText);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
            console.log("Current Ref:>>>>", currentRef);
        }
        if (playCount === 4) {
            updateBallPosition(matchPatternArray1[2].ref, matchPatternArray1[4].ref);
            setCurrentRef(matchPatternArray1[4].ref.current.innerText);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
            console.log("Current Ref:>>>>", currentRef);
        }
        if (playCount === 5) {
            updateBallPosition(matchPatternArray1[4].ref, matchPatternArray1[8].ref);
            setCurrentRef(matchPatternArray1[8].ref.current.innerText);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
            console.log("Current Ref:>>>>", currentRef);
        }
        if (playCount === 6) {
            updateBallPosition(matchPatternArray1[8].ref, matchPatternArray1[9].ref);
            setCurrentRef(matchPatternArray1[9].ref.current.innerText);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
            console.log("Current Ref:>>>>", currentRef);
        }
        if (playCount === 7) {
            updateBallPosition(matchPatternArray1[9].ref, matchPatternArray1[10].ref);
            setCurrentRef(matchPatternArray1[10].ref.current.innerText);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
            console.log("Current Ref:>>>>", currentRef);
        }
        if (playCount === 8) {
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
                {/* Field Lines */}
                <div className='absolute'>
                    <FieldMapLines width={320} height={550} />
                </div>
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

                    {/* Defense line */}
                    <div 
                        ref={LWB_Ref} 
                        style={{ transform: `translate(${LWBPlayerPosition.left}px, ${LWBPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 flex 
                        justify-center items-center text-[9px] text-white ballMotion">LWB</div>

                    <div 
                        ref={LCB_Ref} 
                        style={{ transform: `translate(${LCBPlayerPosition.left}px, ${LCBPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 flex 
                        justify-center items-center text-[9px] text-white ballMotion">LCB</div>

                    <div 
                        ref={RCB_Ref} 
                        style={{ transform: `translate(${RCBPlayerPosition.left}px, ${RCBPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 flex 
                        justify-center items-center text-[9px] text-white ballMotion">RCB</div>

                    <div 
                        ref={RWB_Ref} 
                        style={{ transform: `translate(${RWBPlayerPosition.left}px, ${RWBPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 flex 
                        justify-center items-center text-[9px] text-white ballMotion">RWB</div>

                    {/* Midfield line */}
                    <div 
                        ref={LWF_Ref} 
                        style={{ transform: `translate(${LWFPlayerPosition.left}px, ${LWFPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 flex 
                        justify-center items-center text-[9px] text-white ballMotion">LWF</div>

                    <div 
                        ref={LCMF_Ref} 
                        style={{ transform: `translate(${LMFPlayerPosition.left}px, ${LMFPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 flex 
                        justify-center items-center text-[9px] text-white ballMotion">LMF</div>

                    <div 
                        ref={RCMF_Ref} 
                        style={{ transform: `translate(${RMFPlayerPosition.left}px, ${RMFPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 flex 
                        justify-center items-center text-[9px] text-white ballMotion">RMF</div>

                    <div 
                        ref={RWF_Ref} 
                        style={{ transform: `translate(${RWFPlayerPosition.left}px, ${RWFPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 flex 
                        justify-center items-center text-[9px] text-white ballMotion">RWF</div>

                    {/* Attack line */}
                    <div 
                        ref={LF_Ref} 
                        style={{ transform: `translate(${LFPlayerPosition.left}px, ${LFPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 
                        flex justify-center items-center text-[9px] text-white ballMotion">LF</div>

                    <div 
                        ref={RF_Ref} 
                        style={{ transform: `translate(${RFPlayerPosition.left}px, ${RFPlayerPosition.top}px)` }} 
                        className="absolute rounded-full bg-cyan-600 border-[2px] border-white w-6 h-6 
                        flex justify-center items-center text-[9px] text-white ballMotion">RF</div>


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
                    Start Match
                </button>
                <button onClick={kickBall} className='rounded-[25px] bg-cyan-500 text-gray-800 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[14px] font-semibold'>
                    Kick Ball
                </button>
                <button onClick={resetMatch} className='rounded-[25px] bg-red-500 text-gray-800 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[14px] my-2 font-semibold'>
                    Reset Match
                </button>
                <button 
                    onClick={ () => navigate("/render") } 
                    className='rounded-[25px] bg-green-800 text-gray-200 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[14px] my-2 font-semibold'>
                    Render Data
                </button>
            </div>
        </section>
    );

}



export default FootballSimulation;