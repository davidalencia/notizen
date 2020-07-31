import React, { useState, createRef, useEffect } from 'react';
import TopMenu from './TopMenu';
import LowMenu from './LowMenu';
import Scribbler from './Scribbler'
import ScribbleViewer from './ScribbleViewer'


class NotebookLogic {
  constructor(canvas){
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.isMousedown = false
    this.isPen = false
    this.lineWidth = 0
    this.begin = (state)=>{}
    this.move = (state)=>{}
    this.end = (state)=>{}

    let nb = this

    for (const ev of ["touchstart", "mousedown"]) {
      canvas.addEventListener(ev, function (e) {  
        this.isPen = e.touches? e.touches[0].radiusX == 0: false;  
        nb.begin(nb.data(e))
      })
    }

    for (const ev of ['touchmove', 'mousemove']) {
      canvas.addEventListener(ev, function (e) {
        this.isPen = e.touches? e.touches[0].radiusX == 0: false;   
        e.preventDefault()
        nb.move(nb.data(e))
      })
    }

    for (const ev of ['touchend', 'touchleave', 'mouseup']) {
      canvas.addEventListener(ev, function (e) {
        nb.end(nb.data(e))
      })
    };



  }
  data(e){
    let pressure = 0.1;
    let x, y;
    if (e.touches && e.touches[0] && typeof e.touches[0]["force"] !== "undefined") {
      if (e.touches[0]["force"] > 0) {
        pressure = e.touches[0]["force"]
      }
      x = e.touches[0].pageX
      y = e.touches[0].pageY
    } else {
      pressure = 1.0
      x = e.pageX
      y = e.pageY
    }
    y = y-window.innerHeight*0.1
    return {x, y, pressure}
  }
  pen({color, strokeSize, fingerPaint}){
    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'
    this.ctx.strokeStyle = color
    this.strokeSize = strokeSize

    this.begin = ({x, y, pressure}) =>{
      if(this.isPen || fingerPaint){ 
        this.lineWidth = Math.log(pressure + 1) * this.strokeSize
        this.ctx.lineWidth = this.lineWidth
        this.ctx.beginPath()
        this.ctx.arc(x, y, strokeSize/3, 0, 2 * Math.PI, true);
        this.ctx.stroke()
        this.ctx.moveTo(x, y)
        
      }
    }
    this.move = ({x, y, pressure}) =>{
      if(this.isPen || fingerPaint){
        this.lineWidth = (Math.log(pressure + 1) * this.strokeSize * 0.2 + this.lineWidth * 0.8)
        this.ctx.lineTo(x,y);
        this.ctx.stroke()
      }
    }
    this.end = ({x, y}) =>{
      if (this.isPen || fingerPaint) {
        this.ctx.lineTo(x,y);
        this.ctx.stroke()
      
      }
    }
  }
}





const Notebook = () => {
  const [scribbleStyle, setScribbleStyle] = useState({
                                        style: "pen",
                                        color: "black",
                                        strokeSize: 10,
                                        fingerPaint: true
                                      });

  const scribblerCanvas = createRef(null)



  useEffect(()=>{
    if(scribblerCanvas){
      let nb = new NotebookLogic(scribblerCanvas.current)
      nb.pen(scribbleStyle)
    }
 
  })
  
  return (
    <div style={{ 
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'stretch',
    }}>
      <TopMenu></TopMenu>
      <LowMenu></LowMenu>
      <Scribbler scribblerCanvas={scribblerCanvas}></Scribbler>
        {/* <ScribbleViewer></ScribbleViewer> */}
    </div>
  );
}

export default Notebook;