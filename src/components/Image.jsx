import { AnimatedSprite, Container, useApp, useTick } from "@pixi/react";
import { useEffect, useState } from "react";
import { Assets, Texture } from "pixi.js";

function Image() {
 const [rotation, setRotation] = useState(0);
 const [frames, setFrames] = useState([]);
 const app = useApp();

 const [width, height] = [app.screen.width, app.screen.height];

 useTick((delta) => setRotation((prev) => prev + 0.01 * delta));

 useEffect(() => {
  async function load() {
   const spritesheet = await Assets.load(
    "https://pixijs.io/examples/examples/assets/spritesheet/fighter.json"
   );

   console.log(spritesheet);
   setFrames(
    Object.keys(spritesheet.data.frames).map((frame) => Texture.from(frame))
   );
  }
  load();
 }, [app.loader]);

 if (frames.length === 0) {
  return null;
 }

 return (
  <Container>
   <AnimatedSprite
    x={width / 2}
    y={height - 100}
    scale={0.5}
    anchor={0.5}
    animationSpeed={0.1}
    isPlaying={false}
    textures={frames}
   />
  </Container>
 );
}

export default Image;
