
function init() {
  let objDic = {}
  /*window.addEvent('domready', function() {
    let jb = new Element('img', {
      src: 'joeBiden.jpeg',
      id: 'jb'
    })*/
    
    let joe = {"person":"jb",src:"joeBiden.jpeg"}
    createEl(joe,objDic)
    /*objDic["jb"] = new Element('img', {
      src: 'joeBiden.jpeg',
      id: 'jb'})
    objDic["jb"].inject(document.body)*/
    console.log(jb)
    console.log($$('#ediv'))
  };
function createEl(personDic,place){
  place[personDic["person"]] = new Element('img',{
    src: personDic["src"],
    id:personDic["person"]})
    place[personDic["person"]].inject(document.body)
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
let directions = {
  "39": d => {
    d.x +=2
    d.xEnd +=2 }, 
  "37" : d => {
    d.x -=2
    d.xEnd -=2}, 
  "40": d => {
    d.y+=2, 
    d.yEnd +=2 },
   "38" :d => {
    d.y -=2
    d.yEnd -=2}  }
levels = [enemyDic,kamala]
level = 0
onkeydown = evt => act(evt.keyCode,joeM)
*/


class Thing {
  constructor(...props) {
    this.space = props.space
    this.id = props.id
    this.src = props.src
    this.width = props.width
    this.height = props.height
    this.w = this.width / 2
    this.h = this.height / 2
    this.xSpeed = props.xSpeed
    this.ySpeed = props.ySpeed
    this.x = props.x
    this.y = props.y
    this.shootableThing = props.shootableThing || []
  }
  render() {

  }
  move() {
    this.x += this.xSpeed
    this.y += this.ySpeed
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
class Space {
  constructor(...props) {
    this.things = props.things || []

    setInterval(this.advanceTime, 50)
  }
  newThing(thing) {
    this.things.push(thing)
  }
  advanceTime() {
    this.things.forEach(t => t.move())
    this.checkForCollisions()
  }
  endOfTime() {
    this.things.forEach(t => t.disappear())
  }
  checkForCollisions() {
    let colliders = this.things.filter()
  }
}

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
