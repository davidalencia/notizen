import Notebook from './notebook.js'


const canvas = document.querySelectorAll('canvas')[0]
canvas.width = window.innerWidth
canvas.height = window.innerHeight - window.innerHeight*0.1
let nb = new Notebook(canvas)

document.querySelector('#pen').addEventListener("click", ()=>{
  nb.pen({
    color: "black",
    strokeSize: 2,
    fingerPaint: true
  })
})

document.querySelector('#eraser').addEventListener("click", ()=>{
  nb.eraser()
})

nb.pen({
  color: "black",
  strokeSize: 10,
  fingerPaint: true
})
console.log(canvas);
