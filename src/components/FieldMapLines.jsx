/* eslint-disable react/prop-types */
import { generateAllCornersWithUniqueIds } from "../utils/data"




const FieldMapLines = ({ width=320, height=550 }) => {
    const corners = generateAllCornersWithUniqueIds(320, 550, 10);
    const lines = [];

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
                        stroke="black"
                        strokeWidth={1}
                    />
                ))
            }
            {
                corners.map(corner => (
                    <circle 
                        key={corner.id} 
                        cx={corner.x}
                        cy={corner.y}
                        r={1}
                        fill="red"
                    />
                ))
            }
        </svg>
    )
}


export default FieldMapLines

