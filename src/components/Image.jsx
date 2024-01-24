import { AnimatedSprite, Container, useApp, useTick } from "@pixi/react";
import { useEffect, useRef, useState } from "react";
import { Assets, Texture, isMobile } from "pixi.js";

function Image() {
 const app = useApp();
 const speed = 1;
 const [width, height] = [app.screen.width, app.screen.height];
 const tiltAngle = 50; // even only

 const [rotation, setRotation] = useState(0);
 const [x, setX] = useState(width / 2);
 const [y, setY] = useState(height - 100);
 const [frames, setFrames] = useState([]);
 const [isDebounced, setIsDebounced] = useState(false);
 const [frame, setFrame] = useState(0);
 const [isMoving, setIsMoving] = useState(false);
 const interval = useRef(null);

 useTick((delta) => setRotation((prev) => prev + 0.01 * delta));

 function setAngle(diff) {
  if (Math.abs(diff) < 10) {
   setIsMoving(false);
   return;
  }
  setIsMoving(true);
  setTimeout(() => setIsMoving(false), 200);
  interval.current = null;
  setFrame((prev) => {
   return calculateNextFrame(diff, prev);
  });
 }

 function calculateNextFrame(diff, frame) {
  const bound = [0, 29];
  const res = frame + Math.round(diff / tiltAngle);
  console.log(diff, res);
  if (res < bound[0]) {
   return bound[0];
  }

  if (res > bound[1]) {
   return bound[1];
  }

  return res;
 }

 function mousemove(e) {
  if (isDebounced) {
   return;
  }
  setIsDebounced(true);
  setTimeout(() => setIsDebounced(false), 50);
  const diff = e.global.x - x;
  setAngle(diff);
  setX((prev) => prev + diff * speed);

  // while (float < 1000) {
  //  setTimeout(() => {
  //   if (e.global.x !== x) {
  //    setX((prev) => prev + diff * (speed / 1000));
  //   }
  //  }, float);
  //  float = float + speed > 1000 ? 1000 : float + speed;
  // }
 }

 useEffect(() => {
  if (!isMoving) {
   if (frame > frame.length / 2 && frame < frames.length - 2) {
    interval.current = setTimeout(() => setFrame((prev) => prev + 2), 50);
   } else if (frame > 1) {
    interval.current = setTimeout(() => setFrame((prev) => prev - 2), 50);
   }
  }
 }, [frame, frames.length, isMoving]);

 useEffect(() => {
  async function load() {
   const spritesheet = await Assets.load(
    "https://pixijs.io/examples/examples/assets/spritesheet/fighter.json"
   );

   setFrames(
    Object.keys(spritesheet.data.frames).map((frame) => Texture.from(frame))
   );
  }
  load();
 }, [app.loader]);

 useEffect(() => {});

 if (frames.length === 0) {
  return null;
 }

 return (
  <Container>
   <AnimatedSprite
    eventMode="dynamic"
    onglobalmousemove={mousemove}
    x={x}
    y={y}
    scale={0.5}
    anchor={0.5}
    textures={frames}
    currentFrame={frame}
   />
  </Container>
 );
}

export default Image;
