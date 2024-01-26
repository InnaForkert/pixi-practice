import { AnimatedSprite, Container, useApp } from "@pixi/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { Assets, Texture } from "pixi.js";

function Image() {
 const app = useApp();
 const [width, height] = [app.screen.width, app.screen.height];
 const tiltAngle = 50; // even only

 //  const [rotation, setRotation] = useState(0);
 const [x, setX] = useState(width / 2);
 //  const [y, setY] = useState(height - 100);
 const [frames, setFrames] = useState([]);
 const [frame, setFrame] = useState(0);
 const [isMoving, setIsMoving] = useState(false);
 const interval = useRef(null);
 const moveXInterval = useRef(null);
 //  const moveYInterval = useRef(null);

 const bound = useMemo(() => [0, 20], []);

 function setAngle(diff) {
  if (Math.abs(diff) < 10) {
   setIsMoving(false);
   return;
  }
  setIsMoving(true);
  setTimeout(() => setIsMoving(false), 200);
  clearInterval(interval.current);
  setFrame((prev) => {
   return calculateNextFrame(diff, prev);
  });
 }

 function calculateNextFrame(diff, frame) {
  const calculated = diff / tiltAngle;
  if (calculated > 29) return frame;
  const res = frame + Math.round(calculated);
  // console.log(diff, res);
  if (res < bound[0]) {
   return bound[1] + res;
  }

  if (res > bound[1]) {
   return bound[0] + res - bound[1];
  }

  return res;
 }

 //  function calculateRotation(diffX, diffY) {
 //   console.log(diffX, diffY);
 //   if (diffX > 0) {
 //    if (diffY >= 0) {
 //     setRotation(0.5 * Math.PI + Math.atan(Math.abs(diffX / diffY)));
 //     return;
 //    }
 //    setRotation(Math.atan(Math.abs(diffX / diffY)));
 //    return;
 //   }
 //   if (diffY >= 0) {
 //    setRotation(Math.PI + Math.atan(Math.abs(diffX / diffY)));
 //    return;
 //   }
 //   setRotation(1.5 * Math.PI + Math.atan(Math.abs(diffX / diffY)));
 //  }

 function slowlyMoveX(diffX) {
  const maxSpeed = 2;
  clearInterval(moveXInterval.current);
  clearInterval(interval.current);
  setIsMoving(true);

  if (Math.abs(diffX) < maxSpeed) {
   setX((prev) => prev + diffX);
   setTimeout(() => setIsMoving(false), 200);
   return;
  }

  if (diffX > 0) {
   setX((prev) => prev + maxSpeed);
   moveXInterval.current = setTimeout(() => slowlyMoveX(diffX - maxSpeed));
   return;
  }

  setX((prev) => prev - maxSpeed);
  moveXInterval.current = setTimeout(() => slowlyMoveX(diffX + maxSpeed));
 }

 //  function slowlyMoveY(diffY) {
 //   const maxSpeed = 10;
 //   clearInterval(moveYInterval.current);

 //   if (Math.abs(diffY) < maxSpeed) {
 //    setY((prev) => prev + diffY);
 //    return;
 //   }

 //   if (diffY > 0) {
 //    setY((prev) => prev + maxSpeed);
 //    moveYInterval.current = setTimeout(() => slowlyMoveY(diffY - maxSpeed), 50);
 //    return;
 //   }

 //   setY((prev) => prev - maxSpeed);
 //   moveYInterval.current = setTimeout(() => slowlyMoveY(diffY + maxSpeed), 50);
 //  }

 function mousemove(e) {
  const diffX = e.global.x - x;
  // const diffY = e.global.y - y;
  setAngle(diffX);
  slowlyMoveX(diffX);
  // slowlyMoveY(diffY);
  // if (Math.abs(diffX) > 10 || Math.abs(diffY) > 10) {
  //  calculateRotation(diffX, diffY);
  // }
 }

 useEffect(() => {
  const pause = 100;
  if (!isMoving) {
   if (frame > frames.length / 2) {
    if (frame + 3 > frames.length) {
     interval.current = setTimeout(() => setFrame(0), pause);
     return;
    }
    interval.current = setTimeout(() => setFrame((prev) => prev + 2), pause);
    return;
   }
   if (frame > 1) {
    interval.current = setTimeout(() => setFrame((prev) => prev - 2), pause);
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

 useEffect(() => {
  if (frame > bound[1]) {
   setFrame(bound[1]);
   return;
  }

  if (frame < bound[0]) {
   setFrame(bound[0]);
  }
 }, [bound, frame]);

 //  useEffect(() => {
 // console.log(rotation);
 //  }, [rotation]);

 if (frames.length === 0 || frame > bound[1] || frame < bound[0]) {
  return null;
 }

 return (
  <Container>
   <AnimatedSprite
    eventMode="dynamic"
    onglobalmousemove={mousemove}
    x={x}
    y={height - 100}
    scale={0.5}
    anchor={0.5}
    textures={frames}
    currentFrame={frame}
    // rotation={rotation}
   />
  </Container>
 );
}

export default Image;
