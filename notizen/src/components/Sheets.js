import React, { useEffect, useRef } from 'react';
import * as PIXI from 'pixi.js'

const Sheets = () => {  
  const divRef = useRef();
  
  useEffect(()=>{
    console.log(divRef.current);
    const app = new PIXI.Application({ transparent: true });
    document.body.appendChild(app.view);
    
    // create a new Sprite from an image path.
    const bunny = PIXI.Sprite.from('./images/eraser.svg');
    
    // center the sprite's anchor point
    bunny.anchor.set(0.5);
    
    // move the sprite to the center of the screen
    bunny.x = app.screen.width / 2;
    bunny.y = app.screen.height / 2;
    
    app.stage.addChild(bunny);
    
    app.ticker.add(() => {
        // just for fun, let's rotate mr rabbit a little
        bunny.rotation += 0.1;
    });
  }, [])

  return (
    <div ref={divRef}>
    </div>
  );
}

export default Sheets;