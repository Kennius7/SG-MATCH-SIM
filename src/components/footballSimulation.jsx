/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import Ball from "../assets/img/soccer-ball.png";
import ballSound from "../assets/sound/ballkick1.mp3";
import BGMatchSound from "../assets/sound/InMatchSounds1.mp3";



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
    const BGSoundRef = useRef(null);

    const [ballPosition, setBallPosition] = useState({ 
        top: (footballPitchHeight / 2) - 10, left: (footballPitchWidth / 2) - 10 
    });

    const [isStart, setIsStart] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(false);
    const leftValue = 14;
    const [playCount, setPlayCount] = useState(0);

    const matchPatternArray1 = [
        { ref: GK_Ref }, { ref: LWB_Ref }, { ref: RWB_Ref }, { ref: LCB_Ref }, { ref: RCB_Ref }, { ref: LCMF_Ref },
        { ref: RCMF_Ref }, { ref: LWF_Ref }, { ref: RWF_Ref }, { ref: LF_Ref }, { ref: RF_Ref },
    ];

    useEffect(() => {
        soundRef.current = new Audio(ballSound);
        soundRef.current.load();
        // BGSoundRef.current = new Audio(BGMatchSound);
        // BGSoundRef.current.load();
    }, [])

    const [audioContext, setAudioContext] = useState(null);
    const [audioBuffer, setAudioBuffer] = useState(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [playbackPosition, setPlaybackPosition] = useState(0);
    const sourceRef = useRef(null);
    const startTimeRef = useRef(null);

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

    const playAudio = () => {
        if (audioContext && audioBuffer) {
            const source = audioContext.createBufferSource();
            source.buffer = audioBuffer;
            source.loop = true;
            source.connect(audioContext.destination);
            source.start(0, playbackPosition);
            startTimeRef.current = audioContext.currentTime - playbackPosition;
            sourceRef.current = source;
            setIsPlaying(true);
        }
    }

    const pauseAudio = () => {
        if (audioContext && sourceRef.current) {
            sourceRef.current.stop();
            sourceRef.current = null;

            const elapsed = audioContext.currentTime - startTimeRef.current;
            setPlaybackPosition(elapsed);
            setIsPlaying(false);
        }
    }


    const calcPosition = () => {
        if (LCMF_Ref.current) {
            const playerPosLeft = LCMF_Ref.current.offsetLeft + 14;
            const playerPosTop = LCMF_Ref.current.offsetTop - 5;
            setBallPosition({
                top: playerPosTop,
                left: playerPosLeft,
            })
        }
    }

    const goalScorePosition = () => {
        const goalRandom = Math.random() * 4;
        if (goalBottomRef.current && goalRandom <= 2 ) {
            const playerPosLeft = goalBottomRef.current.offsetLeft + 4;
            const playerPosTop = goalBottomRef.current.offsetTop + 5;
            setBallPosition({
                top: playerPosTop,
                left: playerPosLeft,
            })
        }
        if (goalBottomRef.current && goalRandom > 2 ) {
            const playerPosLeft = goalBottomRef.current.offsetLeft + 64;
            const playerPosTop = goalBottomRef.current.offsetTop + 5;
            setBallPosition({
                top: playerPosTop,
                left: playerPosLeft,
            })
        }
    }

    const getNewPos = (refA, refB) => {
        if (refA.current && refB.current) {
            const firstPlayerPosLeft = refA.current.offsetLeft + 14;
            const firstPlayerPosTop = refA.current.offsetTop - 5;
            const secondPlayerPosLeft = refB.current.offsetLeft + 14;
            const secondPlayerPosTop = refB.current.offsetTop - 5;
            const newPosX = secondPlayerPosLeft - firstPlayerPosLeft;
            const newPosY = secondPlayerPosTop - firstPlayerPosTop;
            return {
                left: newPosX,
                top: newPosY,
            }
        }
    }

    // const updatePosition = () => {
    //     setBallPosition((pos) => {
    //         const newTop = pos.top + velocity.y;
    //         const newLeft = pos.left + velocity.x;
    //         // console.log("New Top and Left:", newTop, newLeft);

    //         // Boundary collision to prevent the ball from leaving the pitch
    //         const pitchWidth = pitchRef.current.offsetWidth;
    //         const pitchHeight = pitchRef.current.offsetHeight;

    //         let updatedX = velocity.x;
    //         let updatedY = velocity.y;


    //         if (newTop < 0 || newTop > pitchHeight - 15) {
    //             updatedY = -updatedY; // Reverse direction on Y axis
    //         }
    //         if (newLeft < 0 || newLeft > pitchWidth - 15) {
    //             updatedX = -updatedX; // Reverse direction on X axis
    //         }
    //         // if (playerTurn && newTop > (pitchHeight / 2) - 15) {
    //         //     updatedY = -updatedY;
    //         // }
    //         // if (!playerTurn && newTop < (pitchHeight / 2) - 15) {
    //         //     updatedY = -updatedY;
    //         // }

    //         setVelocity({
    //             x: updatedX * 0.98, // Apply friction
    //             y: updatedY * 0.98,
    //         });
    //         // setVelocity({
    //         //     x: updatedX, // Apply friction
    //         //     y: updatedY,
    //         // });

    //         // Store the current position in the trail
    //         setTrail((prevTrail) => {
    //             const newTrail = [...prevTrail, { top: newTop, left: newLeft }];
    //             // Limit the length of the trail array to avoid excessive memory usage
    //             if (newTrail.length > 500) {
    //                 newTrail.shift(); // Remove the oldest position
    //             }
    //             return newTrail;
    //         });

    //         return {
    //             top: Math.min(Math.max(newTop, 0), pitchHeight - 15),
    //             left: Math.min(Math.max(newLeft, 0), pitchWidth - 15),
    //         };
    //     });

    //     // Stop animation if velocity is very low
    //     // if (Math.abs(velocity.x) > 0.01 || Math.abs(velocity.y) > 0.01) {
    //     //     animationRef.current = requestAnimationFrame(updatePosition);
    //     // }
    // };

    const playBallSound = () => {
        if (soundRef.current) {
            soundRef.current.play();
        }
    }

    const startMatch = () => {
        playAudio();
    }

    const resetMatch = () => {
        setIsStart(false);
        setPlayCount(0);
        setBallPosition({ top: (footballPitchHeight / 2) - 10, left: (footballPitchWidth / 2) - 10 });
        pauseAudio();
    }

    const kickBall = () => {
        setIsStart(true);
        playBallSound();
        if (playCount === 0) {
            calcPosition();
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 1) {
            updatePosition(matchPatternArray1[5].ref, matchPatternArray1[6].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 2) {
            updatePosition(matchPatternArray1[6].ref, matchPatternArray1[7].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 3) {
            updatePosition(matchPatternArray1[7].ref, matchPatternArray1[8].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 4) {
            updatePosition(matchPatternArray1[8].ref, matchPatternArray1[9].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 5) {
            updatePosition(matchPatternArray1[9].ref, matchPatternArray1[10].ref);
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
        if (playCount === 6) {
            goalScorePosition();
            setPlayCount(prev => prev + 1);
            console.log("Match Count: ", playCount);
        }
    };

    const updatePosition = (refA, refB) => {
        setBallPosition((pos) => {
            const newTop = pos.top + getNewPos(refA, refB).top;
            const newLeft = pos.left + getNewPos(refA, refB).left;
            return { top: newTop, left: newLeft };
        });
    };

    const switchTurn = () => {
        setPlayerTurn(!playerTurn);
    }


  // Update ball position based on velocity with friction to slow it down
    // useEffect(() => {
    //     // const updatePosition = () => {
    //     //     setBallPosition((pos) => {
    //     //         const newTop = pos.top + velocity.y;
    //     //         const newLeft = pos.left + velocity.x;
    //     //         // console.log("New Top and Left:", newTop, newLeft);

    //     //         // Boundary collision to prevent the ball from leaving the pitch
    //     //         const pitchWidth = pitchRef.current.offsetWidth;
    //     //         const pitchHeight = pitchRef.current.offsetHeight;

    //     //         let updatedX = velocity.x;
    //     //         let updatedY = velocity.y;


    //     //         if (newTop < 0 || newTop > pitchHeight - 15) {
    //     //             updatedY = -updatedY; // Reverse direction on Y axis
    //     //         }
    //     //         if (newLeft < 0 || newLeft > pitchWidth - 15) {
    //     //             updatedX = -updatedX; // Reverse direction on X axis
    //     //         }
    //     //         // if (playerTurn && newTop > (pitchHeight / 2) - 15) {
    //     //         //     updatedY = -updatedY;
    //     //         // }
    //     //         // if (!playerTurn && newTop < (pitchHeight / 2) - 15) {
    //     //         //     updatedY = -updatedY;
    //     //         // }

    //     //         setVelocity({
    //     //             x: updatedX * 0.98, // Apply friction
    //     //             y: updatedY * 0.98,
    //     //         });
    //     //         // setVelocity({
    //     //         //     x: updatedX, // Apply friction
    //     //         //     y: updatedY,
    //     //         // });

    //     //         // Store the current position in the trail
    //     //         setTrail((prevTrail) => {
    //     //             const newTrail = [...prevTrail, { top: newTop, left: newLeft }];
    //     //             // Limit the length of the trail array to avoid excessive memory usage
    //     //             if (newTrail.length > 500) {
    //     //                 newTrail.shift(); // Remove the oldest position
    //     //             }
    //     //             return newTrail;
    //     //         });

    //     //         return {
    //     //             top: Math.min(Math.max(newTop, 0), pitchHeight - 15),
    //     //             left: Math.min(Math.max(newLeft, 0), pitchWidth - 15),
    //     //         };
    //     //     });

    //     //     // Stop animation if velocity is very low
    //     //     if (Math.abs(velocity.x) > 0.01 || Math.abs(velocity.y) > 0.01) {
    //     //         animationRef.current = requestAnimationFrame(updatePosition);
    //     //     }
    //     // };

    //     const updatePosition = () => {
    //         setBallPosition((pos) => {
    //             const newTop = pos.top + getVelocity(LCMF_Ref, RCMF_Ref).top/20;
    //             const newLeft = pos.left + getVelocity(LCMF_Ref, RCMF_Ref).left/20;
    //             console.log("Velocity Left: ", getVelocity(LCMF_Ref, RCMF_Ref).left/20, "Velocity Top: ", getVelocity(LCMF_Ref, RCMF_Ref).top/20);
    
    //             // Boundary collision to prevent the ball from leaving the pitch
    //             const pitchWidth = pitchRef.current.offsetWidth;
    //             const pitchHeight = pitchRef.current.offsetHeight;
    
    //             let updatedX = getVelocity(LCMF_Ref, RCMF_Ref).left/20;
    //             let updatedY = getVelocity(LCMF_Ref, RCMF_Ref).top/20;
    
    
    //             if (newTop < 0 || newTop > pitchHeight - 15) {
    //                 updatedY = -updatedY; // Reverse direction on Y axis
    //             }
    //             if (newLeft < 0 || newLeft > pitchWidth - 15) {
    //                 updatedX = -updatedX; // Reverse direction on X axis
    //             }
    //             // if (playerTurn && newTop > (pitchHeight / 2) - 15) {
    //             //     updatedY = -updatedY;
    //             // }
    //             // if (!playerTurn && newTop < (pitchHeight / 2) - 15) {
    //             //     updatedY = -updatedY;
    //             // }
    
    //             setVelocity({
    //                 x: updatedX * 0.98, // Apply friction
    //                 y: updatedY * 0.98,
    //             });
    //             // setVelocity({
    //             //     x: updatedX, // Apply friction
    //             //     y: updatedY,
    //             // });
    
    //             // Store the current position in the trail
    //             setTrail((prevTrail) => {
    //                 const newTrail = [...prevTrail, { top: newTop, left: newLeft }];
    //                 // Limit the length of the trail array to avoid excessive memory usage
    //                 if (newTrail.length > 500) {
    //                     newTrail.shift(); // Remove the oldest position
    //                 }
    //                 return newTrail;
    //             });
    
    //             return {
    //                 top: Math.min(Math.max(newTop, 0), pitchHeight - 15),
    //                 left: Math.min(Math.max(newLeft, 0), pitchWidth - 15),
    //             };
    //         });
    //     };

    //     // Start animation
    //     animationRef.current = requestAnimationFrame(updatePosition);

    //     // Cleanup animation on component unmount
    //     return () => cancelAnimationFrame(animationRef.current);
    // }, [velocity]);


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
                <div className={`absolute leftCalc1 top-0 w-[80px] h-[20px] ${playerTurn ? "bg-[#a6f1af]" : "bg-white"}`}></div>
                {/* Goal Box Bottom */}
                <div ref={goalBottomRef} className={`absolute leftCalc1 bottom-0 w-[80px] h-[20px] ${!playerTurn ? "bg-[#a6f1af]" : "bg-white"}`}></div>
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
                    <div ref={GK_Ref} style={{ left: `calc(50% - ${leftValue}px)` }} className="absolute rounded-full 
                        bg-cyan-600 border-[2px] border-white w-6 h-6 flex justify-center 
                        items-center text-[13px] text-white top-[20px]">H</div>
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
                <button onClick={startMatch} className='rounded-[25px] bg-green-500 text-gray-800 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[14px] font-semibold'>
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
            </div>
        </section>
    );

}



export default FootballPitchSimulation;