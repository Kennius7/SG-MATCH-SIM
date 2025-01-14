import { useNavigate, useParams } from "react-router-dom";
import { generateAllCornersWithUniqueIds } from "../utils/data";
// import { useEffect, useState } from "react";


// { id: 1, corner: 'top-left', x: 0, y: 0 }

const Coordinate = () => {
    const navigate = useNavigate();
    // const [renderData, setRenderData] = useState([]);
    const renderData = generateAllCornersWithUniqueIds(320, 550, 10);
    const { coordinateID }= useParams();
    const Coordinate = renderData.find(p => p.id === Number(coordinateID));
    // console.log("Coordinate ID: >>>", coordinateID);
    // console.log("Coordinate Data: >>>", Coordinate);
    // console.log("renderData: >>>", renderData);
    
    // useEffect(() => {
    //     const data = generateAllCornersWithUniqueIds(320, 550, 10);
    //     setRenderData({ ...renderData, id: data.id, corner: data.corner, x: data.x, y: data.y });
    // }, [renderData]);

    return (
        <section className="w-full">
            <div className="w-full h-dvh flex flex-col justify-center items-center">
                <div className={`w-[300px] h-[200px] text-[22px] font-sans text-slate-900
                    p-2 font-medium
                    ${Coordinate.boxId % 4 === 0 
                    ? "bg-red-200" : Coordinate.boxId % 4 === 1 
                    ? "bg-blue-200" : Coordinate.boxId % 4 === 2 
                    ? "bg-yellow-200" : "bg-green-200"}`}
                >
                    <span className="italic">
                        {Coordinate.id}.
                    </span>&nbsp;
                    <span className="text-blue-900">
                        Box Number:
                    </span>&nbsp;
                    <span className="italic">
                        {Coordinate.boxId}
                    </span>,&nbsp;<br/>
                    <span className="text-blue-900">
                        Corner:
                    </span>&nbsp;
                    <span className="italic">
                        {Coordinate.corner}
                    </span>,&nbsp;<br/>
                    <span className="text-blue-900">
                        XPos:
                    </span>&nbsp;
                    <span className="italic">
                        {Coordinate.x}
                    </span>,&nbsp;
                    <span className="text-blue-900">
                        YPos:
                    </span>&nbsp;
                    <span className="text-blue-900">
                        {Coordinate.y}
                    </span>
                </div>
                <div className="w-full flex justify-center items-center my-1">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-[150px] h-[40px] text-[22px] font-sans font-medium bg-amber-800 
                        text-white rounded-3xl">
                        Back
                    </button>
                </div>
            </div>
        </section>
    )
}


export default Coordinate

