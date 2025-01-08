import { useNavigate } from "react-router-dom";
import { generateAllCornersWithUniqueIds } from "../utils/data";



const RenderData = () => {
    const navigate = useNavigate();
    const renderData = generateAllCornersWithUniqueIds(320, 550, 10);
    console.log(renderData);

    return (
        <>
            <div className="w-full">
                <div className="w-full flex justify-center items-center my-1">
                    <button 
                        onClick={() => navigate(-1)} 
                        className="w-[150px] h-[40px] text-[22px] font-sans font-medium bg-amber-800 
                        text-white rounded-3xl">
                        Back
                    </button>
                </div>
                <div className="w-full bg-slate-200 grid grid-cols-10 gap-[2px]">
                    { 
                        renderData.map(render => 
                            <div 
                                key={render.id} 
                                onClick={() => navigate(`/coordinate/${render.id}`)}
                                className={`p-1 text-[14px] font-sans text-slate-700 flex 
                                justify-evenly items-center m-1 cursor-pointer
                                ${render.id % 4 === 0 
                                ? "bg-red-200" : render.id % 4 === 1 
                                ? "bg-blue-200" : render.id % 4 === 2 
                                ? "bg-yellow-200" : "bg-green-200"}`}
                            >
                                {render.id}. Corner: {render.corner}, XPos: {render.x}, YPos: {render.y}
                            </div>
                        ) 
                    }
                </div>
            </div>
        </>
    )
}

export default RenderData


