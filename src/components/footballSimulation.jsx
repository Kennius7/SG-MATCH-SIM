/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';
import Ball from "../assets/img/soccer-ball.png";



function FootballPitchSimulation() {
    const [ballPosition, setBallPosition] = useState({ top: 50, left: 50 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const pitchRef = useRef(null);
    const animationRef = useRef(null);
    const [trail, setTrail] = useState([]); // Store the ball's past positions
    const [isStart, setIsStart] = useState(false);

  // Function to "kick" the ball in a random direction with a random speed
    const kickBall = () => {
        const speed = Math.random() * 4 + 1; // Random speed between 1 and 5
        const angle = Math.random() * 2 * Math.PI; // Random angle in radians

        setVelocity({
            x: speed * Math.cos(angle),
            y: speed * Math.sin(angle),
        });
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


  // Update ball position based on velocity with friction to slow it down
    useEffect(() => {
        const updatePosition = () => {
            setBallPosition((pos) => {
                const newTop = pos.top + velocity.y;
                const newLeft = pos.left + velocity.x;

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

                setVelocity({
                    x: updatedX * 0.98, // Apply friction
                    y: updatedY * 0.98,
                });

                // Store the current position in the trail
                setTrail((prevTrail) => {
                    const newTrail = [...prevTrail, { top: newTop, left: newLeft }];
                    // Limit the length of the trail array to avoid excessive memory usage
                    if (newTrail.length > 250) {
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
    }, [velocity]);


    return (
        <section className='pt-24 bg-red-200 h-dvh'>
            <div 
                id={"Football Pitch"}
                ref={pitchRef} 
                className='relative w-[600px] h-[400px] mx-auto bg-[#006400] border-[2px] border-white 
                rounded-[5px] overflow-hidden'
            >
                <div 
                    id={"Center Circle"} 
                    className='absolute top-[50%] left-[50%] w-[60px] h-[60px] -mt-[30px] -ml-[30px] 
                    border-[2px] border-white rounded-[999px]'>
                </div>
                <div 
                    id={"Center Line"} 
                    className='absolute top-0 left-[50%] w-[1px] h-full bg-white border-[0.5px] border-white'>
                </div>
                <div id={"Goal Left"} className='absolute topCalc1 left-0 w-[20px] h-[80px] bg-white'></div>
                <div id={"Goal Right"} className='absolute topCalc1 right-0 w-[20px] h-[80px] bg-white'></div>
                <div id={"18 Yard Left"} className='absolute topCalc2 left-0 w-[50px] h-[120px] bg-transparent border-[1px] border-white'></div>
                <div id={"18 Yard Right"} className='absolute topCalc2 right-0 w-[50px] h-[120px] bg-transparent border-[1px] border-white'></div>

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

                <div id={"Soccer Ball"}
                    className={`ball absolute w-[15px] h-[15px] bg-white rounded-full cursor-pointer 
                    ${isStart ? "animate-spin" : "animate-none"}`}
                    style={{ top: `${ballPosition.top}px`, left: `${ballPosition.left}px` }}
                    onClick={kickBall}
                ><img src={Ball} alt='Ball' className='w-full h-full' /></div>
            </div>

            <div className='w-full flex justify-center items-center mt-6'>
                <button onClick={startMatch} className='rounded-[25px] bg-green-500 text-gray-800 px-6 py-2 
                    border-[2px] border-white/60 mr-2'>
                    Start Match
                </button>
                <button onClick={stopMatch} className='rounded-[25px] bg-red-500 text-gray-800 px-6 py-2 
                    border-[2px] border-white/60 ml-2'>
                    Stop Match
                </button>
            </div>
        </section>
    );

}



export default FootballPitchSimulation;