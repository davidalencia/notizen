const canvas = document.querySelectorAll('canvas')[0]
const ctx = canvas.getContext('2d')
let lineWidth = 0
let isMousedown = false
let points = []

canvas.width = window.innerWidth
canvas.height = window.innerHeight



//console.log(e.touches[0].radiusX);


class Notebook {
  constructor(canvas){
    this.canvas = canvas
    this.ctx = canvas.getContext('2d')
    this.points = []
    this.isMousedown = false
    this.isPen = false
    this.lineWidth = 0
    this.begin = (state)=>{}
    this.move = (state)=>{}
    this.end = (state)=>{}

    this.ctx.lineCap = 'round'
    this.ctx.lineJoin = 'round'

    let nb = this

    for (const ev of ["touchstart", "mousedown"]) {
      canvas.addEventListener(ev, function (e) {  
        this.isPen = e.touches[0].radiusX == 0;  
        nb.isMousedown = true
        nb.begin(nb.data(e))
      })
    }

    for (const ev of ['touchmove', 'mousemove']) {
      canvas.addEventListener(ev, function (e) {
        this.isPen = e.touches[0].radiusX == 0;   
        if (!nb.isMousedown) return
        e.preventDefault()
        nb.move(nb.data(e))
      })
    }

    for (const ev of ['touchend', 'touchleave', 'mouseup']) {
      canvas.addEventListener(ev, function (e) {
        nb.isMousedown = false
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
    this.points.push({ x, y })
    return {x, y, pressure}
  }
  pen({color, strokeSize}){
    
    this.ctx.strokeStyle = color
    this.strokeSize = strokeSize

    this.begin = ({x, y, pressure}) =>{
      this.lineWidth = Math.log(pressure + 1) * this.strokeSize
      this.ctx.lineWidth = this.lineWidth
      this.ctx.beginPath()
      this.ctx.moveTo(x, y)
    }
    this.move = ({x, y, pressure}) =>{
      this.lineWidth = (Math.log(pressure + 1) * this.strokeSize * 0.2 + this.lineWidth * 0.8)

      if (this.points.length >= 3) {
        const l = this.points.length - 1
        const xc = (this.points[l].x + this.points[l - 1].x) / 2
        const yc = (this.points[l].y + this.points[l - 1].y) / 2
        this.ctx.lineWidth = this.lineWidth
        this.ctx.quadraticCurveTo(this.points[l - 1].x, this.points[l - 1].y, xc, yc)
        this.ctx.stroke()
        this.ctx.beginPath()
        this.ctx.moveTo(xc, yc)
      }
    }
    this.end = ({x, y}) =>{
      if (this.points.length >= 3) {
        const l = this.points.length - 1
        this.ctx.quadraticCurveTo(this.points[l].x, this.points[l].y, x, y)
        this.ctx.stroke()
      }
    }
  }
}

let nb = new Notebook(canvas)
nb.pen({
  color: "black",
  strokeSize: 10
})
