import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import HomePage from "./components/HomePage";
import PlayervsPlayer from "./components/PlayervsPlayer";
import PlayervsBot from "./components/PlayervsBot";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/pvp" element={<PlayervsPlayer />} />
        <Route path="/pvb" element={<PlayervsBot />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
