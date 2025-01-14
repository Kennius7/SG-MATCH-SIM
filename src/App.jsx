import { BrowserRouter, Routes, Route } from "react-router-dom";
import FootballSimulation from "./components/FootballSimulation";
import RenderData from "./components/RenderData";
import Coordinate from "./components/Coordinate";




function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path={"/"} element={ <FootballSimulation /> } />
        <Route path={"/render"} element={ <RenderData /> } />
        <Route path={"/coordinate"} element={ <Coordinate /> } >
          <Route path={":coordinateID"} element={ <Coordinate /> } />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
