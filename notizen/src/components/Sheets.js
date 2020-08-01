import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js'

/**
 * Cubic interpolation based on https://github.com/osuushi/Smooth.js
 */
function clipInput(k, arr) {
  if (k < 0) k = 0;
  if (k > arr.length - 1) k = arr.length - 1;
  return arr[k];
}

function getTangent(k, factor, array) {
  return factor * (clipInput(k + 1, array) - clipInput(k - 1, array)) / 2;
}

function cubicInterpolation(array, t, tangentFactor) {
  if (tangentFactor == null) tangentFactor = 1;

  const k = Math.floor(t);
  const m = [getTangent(k, tangentFactor, array), getTangent(k + 1, tangentFactor, array)];
  const p = [clipInput(k, array), clipInput(k + 1, array)];
  t -= k;
  const t2 = t * t;
  const t3 = t * t2;
  return (2 * t3 - 3 * t2 + 1) * p[0] + (t3 - 2 * t2 + t) * m[0] + (-2 * t3 + 3 * t2) * p[1] + (t3 - t2) * m[1];
}









const Sheets = () => {  
  const divRef = useRef();
  
  useEffect(()=>{
    const box = divRef.current.getBoundingClientRect();
    const devicePixelRatio = 1 //window.devicePixelRatio || 1;
    const app = new PIXI.Application({ 
      width: (box.width) / devicePixelRatio, 
      height: (window.innerHeight -box.y -14) / devicePixelRatio, 
      transparent: true,
      resolution: devicePixelRatio
    });
    divRef.current.appendChild(app.view);

    const trailTexture = PIXI.Texture.from('images/eraser.svg');
    
    app.renderer.plugins.interaction.on('pointerdown', function (event){
      this.historyX = [];
      this.historyY = [];
      this.historySize = 100;
      this.ropeSize = 50;
      this.points = [];
      
      const newPosition = event.data.global;
      const x = newPosition.x
      const y = newPosition.y
      for (let i = 0; i < this.historySize; i++) {
        this.historyX.push(x);
        this.historyY.push(y);
      }
      // Create rope points.
      for (let i = 0; i < this.ropeSize; i++) {
        this.points.push(new PIXI.Point(x, y));
      }
      
      // Create the rope
      const rope = new PIXI.SimpleRope(trailTexture, this.points);
      
      // Set the blendmode
      rope.blendmode = PIXI.BLEND_MODES.ADD;
      
      app.stage.addChild(rope);
    })

    app.renderer.plugins.interaction.on('pointermove', function(event) {
      let newPosition = event.data.global
  //    this.historyX.pop();
      this.historyX.unshift(newPosition.x);
    //  this.historyY.pop();
      this.historyY.unshift(newPosition.y);
      // Update the points to correspond with history.
      for (let i = 0; i < this.ropeSize; i++) {
          const p = this.points[i];
  
          // Smooth the curve with cubic interpolation to prevent sharp edges.
          const ix = cubicInterpolation(this.historyX, i / this.ropeSize * this.historyX.length);
          const iy = cubicInterpolation(this.historyY, i / this.ropeSize * this.historyY.length);
  
          p.x = ix;
          p.y = iy;
      }
    })
    

    // ///--------------------PEN----------------------------------
    // const trailTexture = PIXI.Texture.from('images/eraser.svg');
    // const historyX = [];
    // const historyY = [];
    // // historySize determines how long the trail will be.
    // const historySize = 10;
    // // ropeSize determines how smooth the trail will be.
    // const ropeSize = 100;
    // const points = [];
    
    // // Create history array.
    // for (let i = 0; i < historySize; i++) {
    //     historyX.push(0);
    //     historyY.push(0);
    // }
    // // Create rope points.
    // for (let i = 0; i < ropeSize; i++) {
    //     points.push(new PIXI.Point(0, 0));
    // }
    
    // // Create the rope
    // const rope = new PIXI.SimpleRope(trailTexture, points);
    
    // // Set the blendmode
    // rope.blendmode = PIXI.BLEND_MODES.ADD;
    
    // app.stage.addChild(rope);

    
    // // Listen for animate update
    // app.ticker.add((delta) => {
    //     // Read mouse points, this could be done also in mousemove/touchmove update. For simplicity it is done here for now.
    //     // When implementing this properly, make sure to implement touchmove as interaction plugins mouse might not update on certain devices.
    //     const mouseposition = app.renderer.plugins.interaction.mouse.global;
    
    //     // Update the mouse values to history
    //     historyX.pop();
    //     historyX.unshift(mouseposition.x);
    //     historyY.pop();
    //     historyY.unshift(mouseposition.y);
    //     // Update the points to correspond with history.
    //     for (let i = 0; i < ropeSize; i++) {
    //         const p = points[i];
    
    //         // Smooth the curve with cubic interpolation to prevent sharp edges.
    //         const ix = cubicInterpolation(historyX, i / ropeSize * historySize);
    //         const iy = cubicInterpolation(historyY, i / ropeSize * historySize);
    
    //         p.x = ix;
    //         p.y = iy;
    //     }
    // });
  }, [])

  return (
    <div ref={divRef}>
    </div>
  );
}

export default Sheets;
