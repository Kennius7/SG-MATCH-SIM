


let playerPosInterval;


export const getNewPos = (refA, refB) => {
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

export const playAudio = (audioContext, audioBuffer, playbackPosition, startTimeRef, sourceRef) => {
    if (audioContext && audioBuffer) {
        const source = audioContext.createBufferSource();
        source.buffer = audioBuffer;
        source.loop = true;
        source.connect(audioContext.destination);
        source.start(0, playbackPosition);
        startTimeRef.current = audioContext.currentTime - playbackPosition;
        sourceRef.current = source;
    }
}

export const pauseAudio = (audioContext, sourceRef, startTimeRef, setPlaybackPosition) => {
    if (audioContext && sourceRef.current) {
        sourceRef.current.stop();
        sourceRef.current = null;
        const elapsed = audioContext.currentTime - startTimeRef.current;
        setPlaybackPosition(elapsed);
    }
}

export const calcPosition = (ref, setPosition) => {
    if (ref.current) {
        const playerPosLeft = ref.current.offsetLeft + 14;
        const playerPosTop = ref.current.offsetTop - 5;
        setPosition({
            top: playerPosTop,
            left: playerPosLeft,
        })
    }
}

export const goalScorePosition = (goalPostRef, setPosition) => {
    const goalRandom = Math.random() * 4;
    if (goalPostRef.current && goalRandom <= 2 ) {
        const playerPosLeft = goalPostRef.current.offsetLeft + 4;
        const playerPosTop = goalPostRef.current.offsetTop + 5;
        setPosition({
            top: playerPosTop,
            left: playerPosLeft,
        })
    }
    if (goalPostRef.current && goalRandom > 2 ) {
        const playerPosLeft = goalPostRef.current.offsetLeft + 64;
        const playerPosTop = goalPostRef.current.offsetTop + 5;
        setPosition({
            top: playerPosTop,
            left: playerPosLeft,
        })
    }
}



export const updatePlayerPosition = (
    playerPosFunction, heightValue, widthValue, polarity, footballPitchHeight, footballPitchWidth,
    topBoundaryPitchHeightDivisor, topBoundaryPitchHeightSubtractor, bottomBoundaryPitchHeightDivisor,
    bottomBoundaryPitchHeightSubtractor, leftBoundaryPitchWidthDivisor, leftBoundaryPitchWidthSubtractor,
    rightBoundaryPitchWidthDivisor, rightBoundaryPitchWidthSubtractor, isClearInterval,
) => {
    let playerInterval = setInterval(() => {
        playerPosFunction((pos) => {
            const newTop = pos.top + (heightValue * polarity);
            const newLeft = pos.left + (widthValue * polarity);

            if (newTop < Math.round((footballPitchHeight / topBoundaryPitchHeightDivisor) + topBoundaryPitchHeightSubtractor) 
                || newTop > Math.round((footballPitchHeight / bottomBoundaryPitchHeightDivisor) + bottomBoundaryPitchHeightSubtractor)) {
                heightValue = heightValue * -1;
                // console.log("NewTop: ", newTop, "NewLeft: ", newLeft, "Random Polarity: ", polarity);
                return { top: newTop, left: newLeft};
            }
            if (newLeft < Math.round((footballPitchWidth / leftBoundaryPitchWidthDivisor) + leftBoundaryPitchWidthSubtractor) 
                || newLeft > Math.round((footballPitchWidth / rightBoundaryPitchWidthDivisor) + rightBoundaryPitchWidthSubtractor)) {
                widthValue = widthValue * -1;
                // console.log("NewTop: ", newTop, "NewLeft: ", newLeft, "Polarity: ", polarity);
                return { top: newTop, left: newLeft};
            }
            // console.log("NewTop: ", newTop, "NewLeft: ", newLeft, "Normal Polarity: ", polarity);
            return { top: newTop, left: newLeft};
        });
    }, 300);

    if (isClearInterval) {
        clearInterval(playerInterval);
        console.log("Cleared...");
    }

    // playerPosInterval = playerInterval;
}





export default playerPosInterval;
