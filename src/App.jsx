import { Stage } from "@pixi/react";
import Image from "./components/Image";

function App() {
 return (
  <Stage
   width={window.innerWidth}
   height={window.innerHeight}
   options={{ background: "#1099bb", autoDensity: true }}
  >
   <Image />
  </Stage>
 );
}

export default App;
