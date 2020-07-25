class StrokePoint {
  constructor(color, x, y, father=null){
    this.x = x
    this.y = y
    this.color = color
    this.brothers = []
    this.father = father
    this.son = null
    this.flag = 0
  }
  addBrother(e){
    this.brothers.push(e)
    e.brothers.push(this)
  }
  forAllBrothers(cb){
    this._forAllBrothers(cb)
    this._clean()
  }
  _forAllBrothers(cb){
    cb(this)
    this.flag = 1
    this.brothers.forEach((e)=>{
      if(e.flag==0){
        cb(e)
        e._forAllBrothers(cb)
      }
    })
  }
  _clean(){
    this.flag = 0
    this.brothers.forEach((e)=>{
      if(e.flag==1)
        e._clean()
    })
  }
}

class History {
  constructor(canvas){
    this.canvas = canvas
    this.map = {}
  }
  getDrawing(x,y,x2,y2){}
  setDrawing(x,y,x2,y2){}
  
  eraese(x,y){
    if(this.map[`${x},${y}`]){
      let sp = this.map[`${x},${y}`]
      sp.forAllBrothers((e)=>{
        this.map[`${e.x},${e.y}`] = undefined
        if(e.father)
          e.father.son = e.son
      })
    }
  }
}


// let h = new History()
// h.map[`1,1`] = new StrokePoint('black', 1, 1)
// h.map[`1,2`] = new StrokePoint('black', 1, 2)
// h.map[`1,3`] = new StrokePoint('black', 1, 3)

// console.log(h.map);

// h.map[`1,3`].addBrother(h.map[`1,2`])
// h.map[`1,3`].addBrother(h.map[`1,1`])

// h.eraese(1,1)

// console.log(h.map);