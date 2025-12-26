import { useNavigate } from "react-router-dom";
import clickSoundAsset from "../sounds/click.wav";

const clickSound = new Audio(clickSoundAsset);
clickSound.volume = 0.5;

function HomePage() {
  const navigate = useNavigate();
  const playClickSound = () => {
    clickSound.currentTime = 0;
    clickSound.play();
  };
  const onStartPvP = () => {
    playClickSound();
    navigate("/pvp");
  };
  const onStartPvB = () => {
    playClickSound();
    navigate("/pvb");
  };
  return (
    <div>
      <h1>TIC TAC TOE</h1>
      <button onClick={onStartPvP} className="buttons">
        Player vs Player
      </button>
      <button onClick={onStartPvB} className="buttons">
        Player vs Bot
      </button>
    </div>
  );
}

export default HomePage;
