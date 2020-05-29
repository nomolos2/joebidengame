
function init() {
 
  conf = getConfig()
  let s1 = new Space()
  let joe = new Thing({...conf.player, space: s1})

  let objDic = {}
}
class Space {
  constructor() {
    this.things = []
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.w = this.width / 2
    this.h = this.height / 2
    setInterval(this.advanceTime.bind(this), 50)
  }
  injectThing(thing) {
    this.things.push(thing)
    let el = new Element('img',{
      src: thing.src,
      id: thing.id,
    })
    el.inject(document.body)
    this.renderThing(thing)
    return el
  }
  advanceTime() {
    this.things
      .filter(t => t.move())
      .map(t => this.renderThing(t))
    //this.checkForCollisions()
  }
  renderThing(thing) {
    thing.el.style.left = thing.pos.x + this.w
    thing.el.style.top =  thing.pos.y + this.h
  }
  endOfTime() {
    this.things.forEach(t => t.disappear())
  }
  checkForCollisions() {
    let colliders = this.things.filter()
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
    this.el = this.space.injectThing(this)
  }
  render() {

  }
  move() {  // returns boolean of whether it moved or not
    if (this.speed.x == 0 && this.speed.y == 0) {
      return false
    }
    this.pos.x += this.speed.x
    this.pos.y += this.speed.y
    return true
  }
  disappear() {

  }
}
class Candidate extends Thing {
  constructor(...props) {
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
let joe = document.querySelector("#joe");


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
}*/
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
  }

  const candidates = {
    swallwell: {
      name: "Eric Swallwell",
      src: "swallwell.jpeg",
      level: 1,
      start: { x:250, y:50, },
      size: { width: 100, height: 60, },
      speed: {x: -1, y: 0},
    },
    hickenlooper: {
      name: "John Hickenlooper",
      src: "hickenlooper.jpeg",
      level: 1,
      start: { x:550, y:50, },
      size: { width: 100, height: 60, },
      speed: {x: -2, y: 0},
    },
    inslee: {
      name: "Jay Inslee",
      src: "inslee.jpg",
      level: 1,
      start: { x:850, y:50, },
      size: { width: 100, height: 60, },
      speed: {x: -3, y: 0},
    },
    gillibrand: {
      name: "Kirsten Gillibrand",
      src: "gillibrand.jpeg",
      level: 1,
      start: { x:1150, y:50, },
      size: { width: 100, height: 60, },
      speed: {x: -4, y: 0},
    },
  }
  const directions = {
    "39": {x:  1, y:  0},
    "37": {x: -1, y:  0},
    "40": {x:  0, y:  1},
    "38": {x:  0, y: -1},
  }
  return {player, candidates, directions}
}
