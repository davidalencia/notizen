import React, { createRef } from 'react';


const SheetManager = () => {
  const canvasRef  = createRef(null)
  const canvas = canvasRef.current


  return (
    <div>
      <canvas  ref={canvasRef} >Sorry, your browser is too old for this demo.</canvas>
    </div>
  );
}

export default SheetManager;