/* eslint-disable react/prop-types */
import { generateAllCornersWithUniqueIds } from "../utils/data"




const FieldMapLines = ({ width=320, height=550 }) => {
    const corners = generateAllCornersWithUniqueIds(320, 550, 10);
    const lines = [];

    // const selectedCorners = () => {
    //     const selected = [];
    //     corners.forEach((corner) => {
    //         if (corner.x > 25 && corner.x < 100 && corner.y > 65 && corner.y < 120 ) {
    //             selected.push({ x: corner.x, y: corner.y });
    //         }
    //     })
    //     return selected;
    // }
    // console.log("Selected Corners: >>>>>>", selectedCorners());

    for (let i = 0; i < corners.length; i += 4) {
        const topLeft = corners[i];
        const topRight = corners[i + 1];
        const bottomLeft = corners[i + 2];
        const bottomRight = corners[i + 3];

        lines.push({ start: topLeft, end: topRight });
        lines.push({ start: topLeft, end: bottomLeft });
        lines.push({ start: topRight, end: bottomRight });
        lines.push({ start: bottomLeft, end: bottomRight });
    }


    return (
        <svg width={width} height={height} style={{ border: "1px solid black" }}>
            {
                lines.map((line, i) => (
                    <line 
                        key={i} 
                        x1={line.start.x} 
                        y1={line.start.y} 
                        x2={line.end.x} 
                        y2={line.end.y} 
                        stroke={"black"}
                        strokeWidth={0.5}
                    />
                ))
            }
            {
                corners.map(corner => (
                    <circle 
                        key={corner.id} 
                        cx={corner.x}
                        cy={corner.y}
                        r={0.5}
                        fill={
                            corner.x > 25 && corner.x < 100 && corner.y > 65 && corner.y < 120 
                            ? "yellow" : corner.x > 85 && corner.x < 170 && corner.y > 65 && corner.y < 120 
                            ? "red" : corner.x > 155 && corner.x < 230 && corner.y > 65 && corner.y < 120 
                            ? "blue" : corner.x > 225 && corner.x < 300 && corner.y > 65 && corner.y < 120 
                            ? "#31f1b1" : "black"
                        }
                    />
                ))
            }
        </svg>
    )
}


export default FieldMapLines

