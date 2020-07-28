const canvas = document.querySelectorAll('canvas')[0]
canvas.width = window.innerWidth
canvas.height = window.innerHeight

class Notebook {
  constructor(canvas){
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.isMousedown = false
    this.isPen = false
    this.lineWidth = 0
    this.begin = (state)=>{}
    this.move = (state)=>{}
    this.end = (state)=>{}


    this.ctx.globalAlpha = 0.003;
    this.ctx.fillRect(0,0,canvas.width,canvas.height)
    this.ctx.globalAlpha = 1;


    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'

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
        nb.points = []
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

    return {x, y, pressure}
  }
  pen({color, strokeSize, fingerPaint}){
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

let nb = new Notebook(canvas)
nb.pen({
  color: "black",
  strokeSize: 2,
  fingerPaint: true
})
