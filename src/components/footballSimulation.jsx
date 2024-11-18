/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import Ball from "../assets/img/soccer-ball.png";



function FootballPitchSimulation() {
    const footballPitchWidth = 320;
    const footballPitchHeight = 550;
    const [ballPosition, setBallPosition] = useState({ top: (footballPitchHeight / 2) - 8, left: (footballPitchWidth / 2) - 10 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const pitchRef = useRef(null);
    const animationRef = useRef(null);
    const [trail, setTrail] = useState([]); // Store the ball's past positions
    const [isStart, setIsStart] = useState(false);
    const [playerTurn, setPlayerTurn] = useState(true);



    // Function to "kick" the ball in a random direction with a random speed
    const kickBall = () => {
        // const speed = Math.random() * 4 + 1; // Random speed between 1 and 5
        const speed = 3;
        const angle = Math.random() * 2 * Math.PI; // Random angle in radians

        setVelocity({
            x: speed * Math.cos(angle),
            y: speed * Math.sin(angle),
        });

        // console.log("The ball positions:", ballPosition);
        // console.log("The ball's past positions:", trail);
    };

    
    const startMatch = () => {
        setIsStart(true);
        const beginPlayInterval = setInterval(() => {
            kickBall();
        }, 1000);
        // beginPlayInterval()
    }

    const stopMatch = () => {
        // clearInterval(beginPlayInterval);
    }

    const switchTurn = () => {
        setPlayerTurn(!playerTurn);
    }


  // Update ball position based on velocity with friction to slow it down
    useEffect(() => {
        const updatePosition = () => {
            setBallPosition((pos) => {
                const newTop = pos.top + velocity.y;
                const newLeft = pos.left + velocity.x;
                // console.log("New Top and Left:", newTop, newLeft);

                // Boundary collision to prevent the ball from leaving the pitch
                const pitchWidth = pitchRef.current.offsetWidth;
                const pitchHeight = pitchRef.current.offsetHeight;

                let updatedX = velocity.x;
                let updatedY = velocity.y;


                if (newTop < 0 || newTop > pitchHeight - 15) {
                    updatedY = -updatedY; // Reverse direction on Y axis
                }
                if (newLeft < 0 || newLeft > pitchWidth - 15) {
                    updatedX = -updatedX; // Reverse direction on X axis
                }
                // if (playerTurn && newTop > (pitchHeight / 2) - 15) {
                //     updatedY = -updatedY;
                // }
                // if (!playerTurn && newTop < (pitchHeight / 2) - 15) {
                //     updatedY = -updatedY;
                // }

                setVelocity({
                    x: updatedX * 0.98, // Apply friction
                    y: updatedY * 0.98,
                });

                // Store the current position in the trail
                setTrail((prevTrail) => {
                    const newTrail = [...prevTrail, { top: newTop, left: newLeft }];
                    // Limit the length of the trail array to avoid excessive memory usage
                    if (newTrail.length > 1000) {
                        newTrail.shift(); // Remove the oldest position
                    }
                    return newTrail;
                });

                return {
                    top: Math.min(Math.max(newTop, 0), pitchHeight - 15),
                    left: Math.min(Math.max(newLeft, 0), pitchWidth - 15),
                };
            });

            // Stop animation if velocity is very low
            if (Math.abs(velocity.x) > 0.01 || Math.abs(velocity.y) > 0.01) {
                animationRef.current = requestAnimationFrame(updatePosition);
            }
        };

        // Start animation
        animationRef.current = requestAnimationFrame(updatePosition);

        // Cleanup animation on component unmount
        return () => cancelAnimationFrame(animationRef.current);
    }, [velocity, playerTurn]);


    return (
        <section className='pt-10 bg-[#e9e7e0] h-dvh flex sm:flex-row flex-col sm:justify-center justify-center 
            items-center'>Hello World
            {/* Football Pitch */}
            <div 
                ref={pitchRef} 
                className={`relative w-[${footballPitchWidth}px] h-[${footballPitchHeight}px] 
                mx-auto sm:mx-0 mb-8 bg-[#006400] border-[2px] border-white rounded-[5px] overflow-hidden`}
            >
                {/* Center Circle
                <div 
                    className='absolute top-[50%] left-[50%] w-[60px] h-[60px] -mt-[30px] -ml-[30px] 
                    border-[2px] border-white rounded-[999px]'>
                </div>
                {/* Center Line */}
                {/* <div 
                    className='absolute top-[50%] left-0 w-full h-[1px] bg-white border-[0.5px] border-white'>
                </div> */}
                {/* Goal Box Top */}
                {/* <div className='absolute leftCalc1 top-0 w-[80px] h-[20px] bg-white'></div> */}
                {/* Goal Box Bottom */}
                {/* <div className='absolute leftCalc1 bottom-0 w-[80px] h-[20px] bg-white'></div> */}
                {/* 18 Yard Box Top */}
                {/* <div className='absolute leftCalc2 top-0 w-[120px] h-[40px] bg-transparent border-[1px] border-white'></div> */}
                {/* 18 Yard Box Bottom */}
                {/* <div className='absolute leftCalc2 bottom-0 w-[120px] h-[40px] bg-transparent border-[1px] border-white'></div> */}

                <svg 
                    style={{ pointerEvents: 'none' }} 
                    className='absolute top-[10px] left-[8px] w-full h-full'
                >
                    <polyline 
                        fill="none"
                        stroke="rgba(255, 255, 255, 0.8)"
                        strokeWidth="2"
                        points={trail.map((pos) => `${pos.left},${pos.top}`).join(' ')} 
                    />
                </svg>

                {/* Soccer ball */}
                <div 
                    className={`ball absolute w-[15px] h-[15px] bg-white rounded-full cursor-pointer 
                    ${isStart ? "animate-spin" : "animate-none"}`}
                    style={{ top: `${ballPosition.top}px`, left: `${ballPosition.left}px` }}
                    onClick={kickBall}
                ><img src={Ball} alt='Ball' className='w-full h-full' /></div>
            </div>

            {/* Button controls */}
            <div className='sm:w-[200px] w-[250px] flex flex-col justify-center items-center my-2'>
                <button onClick={startMatch} className='rounded-[25px] bg-green-500 text-gray-800 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[14px] font-semibold'>
                    Start Match
                </button>
                <button onClick={stopMatch} className='rounded-[25px] bg-red-500 text-gray-800 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[14px] my-2 font-semibold'>
                    Stop Match
                </button>
                <button onClick={switchTurn} className='rounded-[25px] bg-yellow-800 text-gray-800 w-[80%] h-[40px] 
                    border-[2px] border-white/60 text-[13px] font-semibold'>
                    Switch Player Turn
                </button>
            </div>
        </section>
    );

}



export default FootballPitchSimulation;