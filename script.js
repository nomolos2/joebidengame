
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
  
  conf = getConfig()
  let s1 = new Space()
  let joe = new Politician({...conf.player, space: s1})
  let firstEnemies = conf.candidates
  firstD = {}
  _.forEach(firstEnemies,d=>  firstD[d.name] = new Candidate({...d, space : s1}))

  console.log(firstD)
  document.onkeydown= evt => {
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
  constructor() {
    this.things = []
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.w = this.width / 2
    this.h = this.height / 2
    this.interval = setInterval(this.advanceTime.bind(this), 50)
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
    if (Math.abs(thing.hFromCenter)>=this.h){
      thing.changeSpeed({x:0,y:-thing.speed.y})
      
    }
    if ("swallwell" == thing.id){
      console.log(thing.hFromCenter)
    }

    
    
  }
  
  checkAndDealWithWalllHit(thing) {
    this.heightBounce(thing)
    return(thing)
}
  renderThing(thing) {
    thing.el.style.left = this.xScale(thing.pos.x) + 'px'
    thing.el.style.top  = this.yScale(thing.pos.y+thing.h) + 'px'
  }
  edgePos(thing, whichEdge) {
    if (whichEdge === 't') return thing.pos.y - thing.h
    if (whichEdge === 'b') return thing.pos.y + thing.h
    if (whichEdge === 'l') return thing.pos.y - thing.h
    if (whichEdge === 'r') return thing.pos.y + thing.h
  }
  spaceCoords2winCoords(pos) {
    
  }
  



  /*
  d3xScale() {
    return d3.linearScale().domain([-this.w, this.w]).range([0, this.width])
  }
  d3yScale() {
    return d3.linearScale().domain([-this.h, this.h]).range([this.height, 0])
  }*/
  endOfTime() {
    this.things.forEach(t => t.disappear())
  }
  checkForCollisions() {
    let colliders = this.things
    colliders.forEach(thing =>this.iCollided(thing,colliders))

  }
  iCollided(thing,colliders){
    colliders.slice(colliders.indexOf(thing)+1,).forEach(d => this.weCollided(thing,d))
  
  }
  weCollided(thing,oThing){
    
    if (Math.abs(thing.pos.x-oThing.pos.x)>(thing.w+oThing.w)){
      return(false)

    }
    if (Math.abs(thing.pos.y-oThing.pos.y)>(thing.h)){
      return(false)

    }
    thing.collide(oThing)
    oThing.collide(thing)

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

  }
}
class Politician extends Thing {
  constructor(props) {
    super(props)
  }
  collide(oThing){
    this.speed.x = oThing.speed.x
    this.speed.y = oThing.speed.y
  }
}
class Candidate extends Politician {
  constructor(props) {
    super(props)
  }
  shoot() {
    this.space.newThing(this.shootableThing)
  }
}
/*
let kamala = []
let score = document.querySelector("#score")
let bankScore=0;
let newScore = 0;
pauser = document.querySelector("#startstop")
let lives=4
let  = document.querySelector("#joe");


cands = ['swallwell','hickenlooper','inslee','gillibrand']
models = [
  {"x":200,"y":20,"xEnd":300,"yEnd":80},
  {"x":500,"y":20,"xEnd":600,"yEnd":80},
  {"x":800,"y":20,"xEnd":900,"yEnd":80},
  {"x":1100,"y":20,"xEnd":1200,"yEnd":80}
]
let enemyList = models.map((m,i) => {
  o = {
    model: m,
    speed: i+1,
    id: cands[i],
    intervalId: null,
    el: document.querySelector('#' + cands[i]),
  }
  return(o)
})
let enemyDic = _.keyBy(enemyList, "id")


console.log(_.map(enemyDic, (o,id)=>`${id}: ${o.speed}`))

let swallwellM = {
  "x":150,
  "y":20,
  "xEnd":250,
  "yEnd":80
}
let hickenlooperM = {
  "x":400,
  "y":20,
  "xEnd":500,
  "yEnd":80
}
let insleeM = {
  "x":650,
  "y":20,
  "xEnd":750,
  "yEnd":80
}
let gillibrandM = {
  "x":900,
  "y":20,
  "xEnd":1000,
  "yEnd":80
}
var swallMove;
var hicMove;
var insMove;
var gilliMove;

let swallDic = {"id":document.querySelector("#swallwell"),"model": swallwellM, "speed": 1, "repeat":swallMove}
let hickenDic = { "id":document.querySelector("#hickenlooper"),"model": hickenlooperM, "speed": 2, "repeat":hicMove}
let insleeDic = {"id":document.querySelector("#inslee"),"model": insleeM, "speed": 3, "repeat":insMove}
let gilliDic = {"id":document.querySelector("#gillibrand"),"model": gillibrandM, "speed": 4, "repeat":gilliMove}
let enemiesOne = [swallDic,hickenDic,insleeDic,gilliDic]
/*
enemiesOne.forEach(d=>{
                      d.id.style.top="20px"
                      d.id.style.left = d.model.x+"px"})* /
_.forEach(enemyDic,(o,id)=>
                  {o.el.style.top="20px"
                  o.el.style.left=o.model.x+"px"})
joe.style.left="0px"
joe.style.top = "50%"
let joeM = {
  "x":10,
  "y":(window.innerHeight/2)-30,
  "xEnd":110,
  "yEnd":(window.innerHeight/2)+30
}
let scrWidth = window.innerWidth-100
let scrHeight = window.innerHeight-60


let swallDir = 1
let hicDir = 2
let insleeDir = 3
let gilliDir = 3 
levels = [enemyDic,kamala]
level = 0
onkeydown = evt => act(evt.keyCode,joeM)
*/


function continuous(kc,d){
  if (joeM["x"] <= 0){
    clearInterval(moveTime)
  }
  if (joeM["y"] <= 0){
    clearInterval(moveTime)
  }
  if (joeM["x"] >= scrWidth){
    
    bankScore = newScore
    joeM["x"]=0
    //_.forEach(enemyDic,(o)=>o.el.style.display="none")
    _.forEach(enemyDic,d=>clearInterval(d.intervalId))
    level++

  }
  if (joeM["y"] >=  scrHeight){
    clearInterval(moveTime)
  }
  
  if ((pauser.innerHTML !== "Unpause") && (typeof directions[kc] !== 'undefined')){
    directions[kc](d)
    joe.style.left=joeM["x"]+"px"
    joe.style.top=joeM["y"]+"px"}
    newScore = joeM["x"]
    score.innerHTML = `Score: ${newScore+bankScore}`
    
  
}
function act(kc,d){

  if (typeof moveTime !== 'undefined'){
    clearInterval(moveTime)}
 
  moveTime = window.setInterval(continuous,10,kc,d)
 
}
/*function candidateMove(canDic){
  canDic["id"].style.top = "20px"
  if ((canDic["model"]["y"] <=0) || (canDic["model"]["y"] >= scrHeight)){
    canDic["speed"] *= -1
  }
  overlapCheck(canDic["model"],canDic["repeat"])
  canDic["model"]["y"] += canDic["speed"]
  canDic["model"]["yEnd"] += canDic["speed"]
  canDic["id"].style.top = canDic["model"]["y"]+"px"
}
function candidateMove(canDic){
  canDic["el"].style.top = "20px"
  if ((canDic["model"]["y"] <=0) || (canDic["model"]["y"] >= scrHeight)){
    canDic["speed"] *= -1
  }
  overlapCheck(canDic["model"],canDic["intervalId"])
  canDic["model"]["y"] += canDic["speed"]
  canDic["model"]["yEnd"] += canDic["speed"]
  canDic["el"].style.top = canDic["model"]["y"]+"px"}
function characterMove(){
  text = document.querySelectorAll(".headtext")
  levelOne = document.querySelectorAll(".levelOne")
  text.forEach(d => d.style.display="none")
  levelOne.forEach(d => d.style.display="block")
  if (pauser.innerHTML == "Start" || pauser.innerHTML == "Unpause"){
    //enemiesOne.forEach(d=>d.repeat = window.setInterval(candidateMove,10,d))
    _.map(levels[level], (o,id)=>o.intervalId=setInterval(candidateMove,10,o))
    pauser.innerHTML = "Pause"
  }  else {
    _.forEach(enemyDic,d=>clearInterval(d.intervalId))
    pauser.innerHTML="Unpause"
  }
}
function overlapCheck(personDic,person){
  if( joeM["x"] > personDic["xEnd"]) return(false)
  if( personDic["x"] > joeM["xEnd"]) return(false)
  if( joeM["y"] > personDic["yEnd"]) return(false)
  if( personDic["y"] > joeM["yEnd"]) return(false)
  
  clearInterval(person)
  clearInterval(moveTime)
  lives -=1
  if (lives == 1){
    alert("Game Over")
  }
  let heartGone = document.querySelector(`#heart${lives}`)
  heartGone.style.display = "none"
  }

/*
let duckM = {
  "x":200,
  "y":10
}
let directions = {"39": d => duckM["x"]+=10, 
  "37" : d => duckM["x"]-=10, 
  "40": d => duckM["y"]+=10, 
   "38" :d => duckM["y"] -=10 }

function onLoad(){
    bernie.style.left="200px"
    bernie.style.top = "10px"
    document.onkeydown= evt => act(evt.keyCode)
}
function act(cd){
  //directions[event.keyCode][0]=directions[event.keyCode]
  directions[cd] 
  bernie.style.left=duckM["x"]+"px"
  bernie.style.top=duckM["y"]+"px"
  
}*/


function getConfig() {
  const player = {
    name: "Joe Biden",
    id: "joe",
    start: { x: - window.innerWidth / 2, y: 0, },
    src: "joeBiden.jpeg",
    size: { width: 100, height: 60, },
    speed: {x: 0, y: 0},
    classes: 'character',
  }

  const candidates = {
    swallwell: {
      name: "Eric Swallwell",
      id:"swallwell",
      src: "swallwell.jpeg",
      level: 1,
      start: { x:-450, y:50, },
      size: { width: 100, height: 60, },
      speed: {x: 0, y: -1},
      classes: 'character',
    },
    hickenlooper: {
      name: "John Hickenlooper",
      id:"hickenlooper",
      src: "hickenlooper.jpeg",
      level: 1,
      start: { x:-200, y:0, },
      size: { width: 100, height: 60, },
      speed: {x: 0, y: -2},
      classes: 'character',
    },
    inslee: {
      name: "Jay Inslee",
      id:"inslee",
      src: "inslee.jpg",
      level: 1,
      start: { x:50, y:0, },
      size: { width: 100, height: 60, },
      speed: {x: 0, y: -3},
      classes: 'character',
    },
    gillibrand: {
      name: "Kirsten Gillibrand",
      id:"gillibrand",
      src: "gillibrand.jpeg",
      level: 1,
      start: { x:300, y:0, },
      size: { width: 100, height: 60, },
      speed: {x: 0, y: -4},
      classes: 'character',
    },
  }
  const directions = {
    "39": {x:  3, y:  0},
    "37": {x: -3, y:  0},
    "40": {x:  0, y:  -3},
    "38": {x:  0, y: 3},
  }
  return {player, candidates, directions}

}