


export const getPosValues = (ref) => {
    const element = ref.current;
    let translateX = 0;
    let translateY = 0;
    if (element) {
        const style = window.getComputedStyle(element);
        const transform = style.transform || style.webkitTransform || style.mozTransform;
        if (transform && transform !== "none") {
            const matrix = transform.match(/matrix.*\((.+)\)/)[1].split(", ");
            translateX = parseFloat(matrix[4]);
            translateY = parseFloat(matrix[5]);
        }
    }
    console.log("Ref:>>>>", ref.current.innerText, "Position Vals:>>>>>", { translateX, translateY });
    return { translateX, translateY };
}


let playerPosInterval;

// export const getNewPos = (refA, refB) => {
//     if (refA.current && refB.current) {
//         const firstPlayerPosLeft = refA.current.offsetLeft + 14;
//         const firstPlayerPosTop = refA.current.offsetTop - 5;
//         const secondPlayerPosLeft = refB.current.offsetLeft + 14;
//         const secondPlayerPosTop = refB.current.offsetTop - 5;
//         const newPosX = secondPlayerPosLeft - firstPlayerPosLeft;
//         const newPosY = secondPlayerPosTop - firstPlayerPosTop;
//         return {
//             left: newPosX,
//             top: newPosY,
//         }
//     }
// }

export const getNewPos = (refA, refB) => {
    if (refA.current && refB.current) {
        const firstPlayerPosLeft = getPosValues(refA).translateX
        const firstPlayerPosTop = getPosValues(refA).translateY
        const secondPlayerPosLeft = getPosValues(refB).translateX
        const secondPlayerPosTop = getPosValues(refB).translateY
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
        console.log("Current Ref: >>>>>", ref.current.offsetLeft);
        console.log("Current Ref: >>>>>", ref.current.offsetTop);
        console.log("Current Ref: >>>>>", ref.current.innerText);
        const playerPosLeft = getPosValues(ref).translateX;
        const playerPosTop = getPosValues(ref).translateY;
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
    playerPosFunction, heightValue, widthValue, polarity, topBoundaryPitchHeightDivisor, 
    topBoundaryPitchHeightSubtractor, bottomBoundaryPitchHeightDivisor, bottomBoundaryPitchHeightSubtractor, 
    leftBoundaryPitchWidthDivisor, leftBoundaryPitchWidthSubtractor, rightBoundaryPitchWidthDivisor, 
    rightBoundaryPitchWidthSubtractor, isClearInterval, footballPitchHeight=550, footballPitchWidth=320,
) => {
    let playerInterval = setInterval(() => {
        playerPosFunction((pos) => {
            const newTop = pos.top + (heightValue * polarity);
            const newLeft = pos.left + (widthValue * polarity);

            if (
                newTop < Math.round(
                    (footballPitchHeight / topBoundaryPitchHeightDivisor) + topBoundaryPitchHeightSubtractor
                ) 
                || 
                newTop > Math.round(
                    (footballPitchHeight / bottomBoundaryPitchHeightDivisor) + bottomBoundaryPitchHeightSubtractor)
                ) {
                heightValue = heightValue * -1;
                // console.log("NewTop: ", newTop, "NewLeft: ", newLeft, "Random Polarity: ", polarity);
                return { top: newTop, left: newLeft};
            }

            if (
                newLeft < Math.round(
                    (footballPitchWidth / leftBoundaryPitchWidthDivisor) + leftBoundaryPitchWidthSubtractor
                ) 
                || 
                newLeft > Math.round(
                    (footballPitchWidth / rightBoundaryPitchWidthDivisor) + rightBoundaryPitchWidthSubtractor)
                ) {
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


export const randomValueRange = (min, max) => {
    const randomNumber = Math.floor(Math.random() * (max - min + 1)) + min;
    if (randomNumber >= min && randomNumber <= max) {
        return randomNumber;
    } else randomValueRange(min, max);
}

export const generateAllCornersWithUniqueIds = (W, H, inc=2) => {
    if (W <= 0 || H <= 0) throw new Error("Width and height must be greater than 0");
    const corners = [];
    let id = 1;
    let boxId = 1

    for (let y = 0; y < H; y += inc) {
        for (let x = 0; x < W; x += inc) {
            corners.push({ id: id++, boxId: boxId, corner: "top-left", x, y });
            corners.push({ id: id++, boxId: boxId, corner: "top-right", x: x + inc, y });
            corners.push({ id: id++, boxId: boxId, corner: "bottom-left", x, y: y + inc });
            corners.push({ id: id++, boxId: boxId, corner: "bottom-right", x: x + inc, y: y + inc });
            boxId++;
        }
    }

    return corners;
}






