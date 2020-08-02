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

    const trailTexture = PIXI.Texture.from('images/dot.svg');
    
    app.renderer.plugins.interaction.on('pointerdown', function (event){
      this.init = (pos) =>{ 
        this.counter = 1
        this.historyX = [];
        this.historyY = [];
        this.historySize = 10;
        this.ropeSize = 100;
        this.points = [];
        for (let i = 0; i < this.historySize; i++) {
          this.historyX.push(pos.x);
          this.historyY.push(pos.y);
        }
        for (let i = 0; i < this.ropeSize; i++) {
          this.points.push(new PIXI.Point(pos.x, pos.y));
        }
        const rope = new PIXI.SimpleRope(trailTexture, this.points, 5);
        rope.blendmode = PIXI.BLEND_MODES.ADD;
        app.stage.addChild(rope);
      }
      const pos = event.data.global
      this.init(pos)
    })

    app.renderer.plugins.interaction.on('pointermove', function(event) {
      const pos = event.data.global
      if(this.counter==5){
        let pPoint = new PIXI.Point(this.historyX[1], this.historyY[1])
        this.init(new PIXI.Point(this.historyX[0], this.historyY[0]))
        this.counter++
        this.historyX[1] = pPoint.x
        this.historyY[1] = pPoint.y
      }
     
      this.historyX.pop();
      this.historyX.unshift(pos.x);
      this.historyY.pop();
      this.historyY.unshift(pos.y);
      // Update the points to correspond with history.
      for (let i = 0; i < this.ropeSize; i++) {
          const p = this.points[i];
  
          // Smooth the curve with cubic interpolation to prevent sharp edges.
          const ix = cubicInterpolation(this.historyX, i / this.ropeSize * this.historySize);
          const iy = cubicInterpolation(this.historyY, i / this.ropeSize * this.historySize);
  
          p.x = ix;
          p.y = iy;
      }
      this.counter++

    })

    app.renderer.plugins.interaction.on('pointerup', function(event) {
      // const pos = event.data.global
      //app.stage.addChild(this.graph)
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
