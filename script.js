
function init() {

  $$('#startstop').addEvent("click",beginOne)
}

function makeScaleConvert(d0,d1,r0,r1){
  return function(dn){
    dRange = (d1 - d0)  
    rRange = (r1 - r0)  
    rValue = (((dn - d0) * rRange) / dRange) + r0
    return (rValue)

    //(10°F − 32) × 5/9 = -12.22°C

    //return (d1-d0)/(r1-r0)*(dn)-(d0-r0)
  }
}
function beginOne(){
  

  let sDic = {1:{"space":null,"level":1}}
  
  sDic[1].space = new Space({level:1})
  conf = getConfig(sDic[1].space)
  let joe = new Joe({...conf.player, space: sDic[1].space})
  let firstEnemies = conf.candidates[sDic[1].level]
  firstD = {}
  _.forEach(firstEnemies,d=>  firstD[d.name] = new Candidate({...d, space : sDic[1].space})) 


  document.onkeydown= evt => {
    conf.directions = {
      "39": {x:  13, y:  0},
      "37": {x: -13, y:  0},
      "40": {x:  0, y:  -13},
      "38": {x:  0, y: 13},
    }
    let speed = conf.directions[evt.keyCode] || joe.speed
    joe.changeSpeed(speed)
  }
  function unpauser(){
    s1.interval = setInterval(s1.advanceTime.bind(s1), 50)
    $$('#startstop').set("text","pause")
    $$('#startstop').removeEvent("click", unpauser);
    $$('#startstop').addEvent("click",pauser)
    
  }
  function pauser(space) {
    clearInterval(s1.interval)
    $$('#startstop').set("text","unpause")

    $$('#startstop').removeEvent("click", pauser);
    $$('#startstop').addEvent("click",unpauser)
  }
  $("l0").setStyle('display', 'none')  
  $$('#startstop').removeEvent("click", beginOne);
  $$('#startstop').addEvent("click",pauser)
  $$('#startstop').set("text","pause")

}


class Space {
  constructor(props) {
    this.level = props.level
    this.things = []
    this.interval = setInterval(this.advanceTime.bind(this), 50)
    this.setWindowDims()

    window.onresize = () => {
      this.setWindowDims()
    }
  }
  setWindowDims() {
    this.width = window.innerWidth
    this.height = window.innerHeight
    //this.w = 500
    //this.h = 250
    this.w = this.width / 2
    this.h = this.height / 2 
    this.xScale = makeScaleConvert(-this.w, this.w, 0, this.width)
    this.yScale = makeScaleConvert(-this.h, this.h, this.height, 0)
  }
  injectThing(thing) {
    this.things.push(thing)
    let el = new Element('img',{
      src: thing.src,
      id: thing.id,
      "class": thing.classes,
    })
    el.inject(document.body)
    thing.el = el
    this.renderThing(thing)
  }
  advanceTime() {
    this.checkForCollisions()
    this.things
      .filter(t => t.move())
      .map(t => this.checkAndDealWithWalllHit(t))
      .map(t => this.renderThing(t))
    
    //this.checkForCollisions()
  }
  heightBounce(thing){
    if (Math.abs(thing.hFromCenter) >= this.h) {
      
      thing.changeSpeed({x:thing.speed.x,y:-thing.speed.y})
    }
    
  }
  hitLeft(thing){
    if(thing.pos.x-thing.w<=-this.w){
      thing.changeSpeed({x:-thing.speed.x,y:thing.speed.y})
    }  

  }
  hitRight(thing){
    if(thing.pos.x+thing.w>=this.w){
      thing.rightHit(this)
    }  
  }
  
  checkAndDealWithWalllHit(thing) {
    this.heightBounce(thing)
    this.hitLeft(thing)
    this.hitRight(thing)
    return(thing)
}
  renderThing(thing) {
    thing.el.style.left = this.xScale(thing.pos.x - thing.w) + 'px'
    thing.el.style.top  = this.yScale(thing.pos.y + thing.h) + 'px'
  }
  edgePos(thing, whichEdge) {
    if (whichEdge === 't') return thing.pos.y - thing.h
    if (whichEdge === 'b') return thing.pos.y + thing.h
    if (whichEdge === 'l') return thing.pos.y - thing.h
    if (whichEdge === 'r') return thing.pos.y + thing.h
  }
  spaceCoords2winCoords(pos) {
    
  }
  
  endOfTime() {
    this.things.forEach(t => t.disappear())
  }
  checkForCollisions() {
    let colliders = this.things
    colliders.forEach(thing =>this.iCollided(thing,colliders))

  }
  iCollided(thing,colliders){
    let newColl = colliders.slice(colliders.indexOf(thing)+1)
    //console.log(newColl.length)
    newColl.forEach(d => this.weCollided(thing,d))
  
  }
  weCollided(thing,oThing){
    /*
    if (Math.abs(thing.pos.x-oThing.pos.x)>(thing.w+oThing.w)){
      return(false)

    }
    if (Math.abs(thing.pos.y-oThing.pos.y)>(thing.h)){
      return(false)

    }*/
  if( (thing.pos.x-thing.w) > (oThing.pos.x+oThing.w)) return(false)
  if((oThing.pos.x-oThing.w) > (thing.pos.x+thing.w)) return(false)
  if( (thing.pos.y-thing.h) > (oThing.pos.y+oThing.h)) return(false)
  if((oThing.pos.y-oThing.h) > (thing.pos.y+thing.h)) return(false)

  
  //clearInterval(person)
  //clearInterval(moveTime)
  thing.switch(oThing)
  oThing.switch(thing)
  thing.hold()
  oThing.hold()
  }
}

class Thing {
  constructor(props) {
    this.space = props.space
    this.id = props.id
    this.src = props.src
    this.pos = {...props.start}
    this.size = {...props.size}
    this.w = this.size.width / 2
    this.h = this.size.height / 2
    this.speed = {...props.speed}
    this.shootableThing = props.shootableThing || []
    this.classes = props.classes
    this.tempSpeed = {
     x:0,
     y:0,

    }
    this.space.injectThing(this)
    this.hFromCenter = (Math.abs(this.pos.y)+this.h)*((this.pos.y)/Math.abs(this.pos.y))
  
  }
 
  

  render() {

  }
  move() {  // returns boolean of whether it moved or not
    if (this.speed.x == 0 && this.speed.y == 0) {
      return false
    }
    
    this.pos.x += this.speed.x
    this.pos.y += this.speed.y
    this.hFromCenter=(Math.abs(this.pos.y)+this.h)*((this.pos.y)/Math.abs(this.pos.y))
    return true
  }
  changeSpeed(speed) {
    this.speed = speed
  }
  disappear() {
    this.el.destroy()
  }
}

class Politician extends Thing {
  constructor(props) {
    super(props)
    this.heart = 1
  }
  switch(oThing){
    this.tempSpeed.x = oThing.speed.x
    this.tempSpeed.y = oThing.speed.y
    this.specialCollide()
  }
  hold(){
    this.speed.x=this.tempSpeed.x
    this.speed.y = this.tempSpeed.y
  }
}
  
class Candidate extends Politician {
  
  constructor(props) {
    super(props)
    
  }
  rightHit(space){
    this.changeSpeed({x:-this.speed.x,y:this.speed.y})
  }
  shoot() {
    this.space.newThing(this.shootableThing)
  }
  specialCollide(){
    console.log(1)
  }
}
class Joe extends Politician{
  constructor(props) {
    super(props)
    
  }
  rightHit(space){
    this.pos.x = -space.w + 50
    space.endOfTime()

  }
  specialCollide(){
    document.querySelector(`#heart${this.heart}`).style.display="none"
  }
}

function getConfig(space) {
  //imgHeight = yScale(60)
  //imgWidth = xScale(100)

  imgHeight = 60
  imgWidth = 100

  const player = {
    name: "Joe Biden",
    id: "joe",
    start: { x: -space.w + imgWidth / 2, y: 0, },
    src: "joeBiden.jpeg",
    size: { width: imgWidth, height: imgHeight},
    speed: {x: 0, y: 0},
    classes: 'character',
  }
  const candidates={
  1:{
    swallwell: {
      name: "Eric Swallwell",
      id:"swallwell",
      src: "swallwell.jpeg",
      level: 1,
      start: { x:-3*space.w/5, y:50, },
      size: { width: imgWidth, height: imgHeight},
      speed: {x: 0, y: -1},
      classes: 'character',
    },
    hickenlooper: {
      name: "John Hickenlooper",
      id:"hickenlooper",
      src: "hickenlooper.jpeg",
      level: 1,
      start: { x:-space.w/5, y:0, },
      size: { width: imgWidth, height: imgHeight},
      speed: {x: 0, y: -2},
      classes: 'character',
    },
    inslee: {
      name: "Jay Inslee",
      id:"inslee",
      src: "inslee.jpg",
      level: 1,
      start: { x:space.w/5, y:0, },
      size: { width: imgWidth, height: imgHeight},
      speed: {x: 0, y: -3},
      classes: 'character',
    },
    gillibrand: {
      name: "Kirsten Gillibrand",
      id:"gillibrand",
      src: "gillibrand.jpeg",
      level: 1,
      start: { x:3*space.w/5, y:0, },
      size: { width: imgWidth, height: imgHeight},
      speed: {x: 0, y: -4},
      classes: 'character',
    },
  },}
  const directions = {
    "39": {x:  13, y:  0},
    "37": {x: -13, y:  0},
    "40": {x:  0, y:  -13},
    "38": {x:  0, y: 13},
  }
  return {player, candidates, directions}

}