import React, { createRef, useEffect } from 'react';


const Scribbler = ({scribblerCanvas}) => {
  useEffect(()=>{
    const canvas = scribblerCanvas.current
    canvas.width = window.innerWidth - 16
    canvas.height = window.innerHeight - canvas.getBoundingClientRect().y - 13
  })

  return (
    <div>
      <canvas  ref={scribblerCanvas}>
        Sorry, your browser is too old for this demo.
      </canvas>
    </div>
  );
}

export default Scribbler;