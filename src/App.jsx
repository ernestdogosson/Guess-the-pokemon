import PokemonGame from "./PokemonGame.jsx";
import AudioControls from './components/AudioControls';

function App() {
  return (
    <>
      <AudioControls className="audio-controls" />
      <PokemonGame />
    </>
  );
}

export default App;
