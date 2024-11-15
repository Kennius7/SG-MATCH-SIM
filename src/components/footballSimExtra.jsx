/* eslint-disable no-unused-vars */
import { useState, useEffect, useRef } from 'react';

const BallWithTrail = () => {
    const [ballPosition, setBallPosition] = useState({ top: 50, left: 50 });
    const [velocity, setVelocity] = useState({ x: 0, y: 0 });
    const [trail, setTrail] = useState([]); // Store the ball's past positions
    const pitchRef = useRef(null);
    const animationRef = useRef(null);

    // Function to "kick" the ball in a random direction with a random speed
    const kickBall = () => {
        const speed = Math.random() * 4 + 1; // Random speed between 1 and 5
        const angle = Math.random() * 2 * Math.PI; // Random angle in radians

        setVelocity({
            x: speed * Math.cos(angle),
            y: speed * Math.sin(angle),
        });
    };

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
                    if (newTrail.length > 50) {
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
        <div
            ref={pitchRef}
            style={{
                position: 'relative',
                width: '500px',
                height: '300px',
                border: '2px solid green',
                overflow: 'hidden',
                backgroundColor: '#d0f0c0', // Grass color
            }}
        >
            {/* Render the trail */}
            <svg
                style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    pointerEvents: 'none',
                    width: '100%',
                    height: '100%',
                }}
            >
                <polyline
                    fill="none"
                    stroke="rgba(0, 0, 255, 0.6)" // Blue trail
                    strokeWidth="2"
                    points={trail.map((pos) => `${pos.left},${pos.top}`).join(' ')}
                />
            </svg>

            {/* Render the ball */}
            <div
                style={{
                    position: 'absolute',
                    top: ballPosition.top,
                    left: ballPosition.left,
                    width: '15px',
                    height: '15px',
                    backgroundColor: 'red',
                    borderRadius: '50%',
                }}
            />
        </div>
    );
};

export default BallWithTrail;
