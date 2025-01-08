import { BrowserRouter, Routes, Route } from "react-router-dom";
import FootballPitchSimulation from "./components/footballSimulation"
import RenderData from "./components/RenderData"
import Coordinate from "./components/Coordinate";




function App() {


  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={ <FootballPitchSimulation /> } />
        <Route path={"/render"} element={ <RenderData /> } />
        <Route path={"/coordinate"} element={ <Coordinate /> } >
          <Route path={":coordinateID"} element={ <Coordinate /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
