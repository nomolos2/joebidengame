
function init() {

  $$('#startstop').addEvent("click",callMakeLevel)
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
function callMakeLevel(){
  makeLevel()
}
function makeLevel(level = 1, hearts,bankScore = 0){
  if (level == 4){
    let el = new Element('p',{
      text:`You Won The Primary.`,
      fontsize:50})
      
  
    el.inject(document.body)
    el.style.position = "absolute"
    el.style.left= window.innerWidth/2+"px"
    el.style.top =window.innerHeight/2 + "px"

    
    return true
  }
  
  let space = new Space({level,hearts,bankScore})
  let conf = getConfig(space)
  let joe = new Joe({...conf.player, space})
  let enemies = conf.candidates[level]
  firstD = {}
  _.forEach(enemies,d=>  firstD[d.name] = new Candidate({...d, space})) 


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
    space.interval = setInterval(space.advanceTime.bind(space), 50)
    $$('#startstop').set("text","pause")
    $$('#startstop').removeEvent("click", unpauser);
    $$('#startstop').addEvent("click",pauser)
    
  }
  function pauser() {
    clearInterval(space.interval)
    $$('#startstop').set("text","unpause")
    $$('#startstop').removeEvent("click", pauser);
    $$('#startstop').addEvent("click",unpauser)
  }
  $("l0").setStyle('display', 'none')  
  $$('#startstop').removeEvent("click", callMakeLevel);
  $$('#startstop').addEvent("click",pauser)
  $$('#startstop').set("text","pause")

}


class Space {
  constructor(props) {
    this.level = props.level
    this.hearts = props.heart || 3
    this.things = []
    this.bankScore = props.bankScore
    this.newScore = 0
    
    this.bullets = {}
    this.interval = setInterval(this.advanceTime.bind(this), 50)
    this.intervals = [this.interval]
    this.setWindowDims()

    window.onresize = () => {
      this.setWindowDims()
    }
  }
  immunify(person,bullId,who){
    if(person.id==who){
      person.addImmunity(bullId)
    }
  }
  addBullet(bulletType,originPos){
    let bulletPos = _.clone(originPos)
    let difX = (bulletPos.x-this.things[0].pos.x)
    let difY = (bulletPos.y - this.things[0].pos.y)
    let bulletSpeed = {x:-5,y:-5}
    let bullNum = "bullet"+ (Object.keys(this.bullets).length+1)
    let bulletDic= {...bulletType,pos:bulletPos,space:this,speed:bulletSpeed,id:bullNum}
    this.things.forEach(d=>this.immunify(d,bullNum,bulletType.whose))

    this.bullets[bullNum] = new Bullet(bulletDic)
    this.bullets["bullet"+ (Object.keys(this.bullets).length)].addImmunity(bulletType.whose)
    
    //bullet.pos = bulletPos 
    //this.bullets.push("bullet"+ (Object.keys(this.bullets).length+1))
    //bullet.el = "bullet" + this.bullets.length
    //this.injectThing(bullet.el)

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
      width: thing.size.width,
      height: thing.size.height,
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
    this.newScore= this.xScale(this.things[0].pos.x)
    $$("#score").set("text", `Score: ${this.totalScore()}`)
    //this.checkForCollisions()
  }
  totalScore(){
    return(this.bankScore + this.newScore)
  }
  heightBounce(thing){
    if (Math.abs(thing.hFromCenter) >= this.h && thing.speed.y/thing.pos.y>0) {
      
      thing.pos.y = -(thing.pos.y+10)     
    }
    
  }
  hitLeft(thing){
    if(thing.pos.x-thing.w<=-this.w && thing.speed.x/thing.pos.x>0){
      thing.passLeft()
      
    }  

  }
  hitRight(thing){
    if(thing.pos.x+thing.w>=this.w && thing.speed.x/thing.pos.x>0){
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
    this.intervals.forEach(i => clearInterval(i))
    
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
  thing.hold(oThing)
  oThing.hold(thing)
  }
}

class Thing {
  constructor(props) {
    this.name = props.name
    this.space = props.space
    this.id = props.id
    this.src = props.src
    this.pos = {...props.pos}
    this.size = {...props.size}
    this.w = this.size.width / 2
    this.h = this.size.height / 2
    this.speed = {...props.speed}
    this.shootableThing = props.shootableThing || []
    this.classes = props.classes
    this.immunity = []
    this.tempSpeed = {
     x:0,
     y:0,

    }
    this.space.injectThing(this)
    this.hFromCenter = (Math.abs(this.pos.y)+this.h)*((this.pos.y)/Math.abs(this.pos.y))
  
  }
 
  addImmunity(oId){
    this.immunity.push(oId)
     let endImunnity = setTimeout(this.immunity.filter(d => d !== oId),200)
  }
  switch(oThing){
    if (this.immunity.indexOf(oThing.id) < 0){
      this.tempSpeed.x = oThing.speed.x
      this.tempSpeed.y = oThing.speed.y
      
    }
  }
  hold(oThing){
    if (this.immunity.indexOf(oThing.id) < 0){
      this.speed.x=this.tempSpeed.x
      this.speed.y = this.tempSpeed.y
      this.addImmunity(oThing.id)
      this.specialCollide(oThing)
    }
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
  
  
}
class Bullet extends Thing{
  /*switch(){
    //this is blank
  }
  hold(){
    this.disappear()
  }*/
  hold(oThing){
    if (this.immunity.indexOf(oThing.id) < 0){
      this.el.destroy()
      this.addImmunity(oThing.id)
      this.specialCollide(oThing)
    }
  }
  specialCollide(oThing){

  }
  rightHit(space){
    this.changeSpeed({x:-this.speed.x,y:this.speed.y})
  }
  passLeft(){
    this.pos.x = -(this.pos.x+10)
  }
  
}
class Candidate extends Politician {
  
  constructor(props) {
    super(props)
    this.bullet = props.bullet || null
    if (this.bullet !== null) {
    this.shots = setInterval( this.space.addBullet.bind(this.space),5000,this.bullet,this.pos)
    this.space.intervals.push(this.shots)
    }
  }
 
   

  rightHit(space){
    this.pos.x = -(this.pos.x+10)
  }
  passLeft(){
    this.pos.x = -(this.pos.x+10)
  }
  
  specialCollide(oThing){

  }
}

class Joe extends Politician{
  constructor(props) {
    super(props)
  }
  rightHit(space){
    
    makeLevel(space.level+1,space.hearts,space.totalScore())
    space.endOfTime()
  }
  passLeft(){
    this.speed.x=0
  }
  specialCollide(oThing){
    document.querySelector(`#heart${this.space.hearts}`).style.display="none"
    this.space.hearts --
    if(this.space.hearts == 0){
      this.lose(oThing)
    }
  }
  lose(oThing){
    
    //$$("#gameOver").set("text",`${oThing.name} made you drop out. \n Final Score: ${this.space.totalScore()} `)
    let el = new Element('p',{
      text:`${oThing.name} made you drop out. \n Final Score: ${this.space.totalScore()} `,
      

    })
    
    el.inject(document.body)
    el.style.position = "absolute"
    el.style.left= this.space.w+"px"
    el.style.top =this.space.h + "px"

    this.space.endOfTime()
  }}

function getConfig(space) {
  //imgHeight = yScale(60)
  //imgWidth = xScale(100)

  imgHeight = 60
  imgWidth = 100

  const player = {
    name: "Joe Biden",
    id: "joe",
    pos: { x: -space.w + imgWidth / 2, y: 0, },
    src: "joeBiden.jpeg",
    size: { width: imgWidth, height: imgHeight},
    speed: {x: 0, y: 0},
    classes:"thingy"
 
  }
  const bullets = {
    kamalaBullet:{
      
      name:"a bus",
      whose:"kamala",
      src:"bus.jpeg",
      classes:"thingy",
      frequency:1000,
      adjustSpeed:1000,
      size: { width: imgWidth, height: imgHeight},
    }
  }
  const candidates={
    1:{
      swallwell: {
        name: "Eric Swallwell",
        id:"swallwell",
        src: "swallwell.jpeg",
        level: 1,
        pos: { x:-3*space.w/5, y:50, },
        size: { width: imgWidth, height: imgHeight},
        speed: {x: 0, y: -1},
        classes: 'thingy',
      },
      hickenlooper: {
        name: "John Hickenlooper",
        id:"hickenlooper",
        src: "hickenlooper.jpeg",
        level: 1,
        pos: { x:-space.w/5, y:0, },
        size: { width: imgWidth, height: imgHeight},
        speed: {x: 0, y: -2},
        classes: 'thingy',
      },
      inslee: {
        name: "Jay Inslee",
        id:"inslee",
        src: "inslee.jpg",
        level: 1,
        pos: { x:space.w/5, y:0, },
        size: { width: imgWidth, height: imgHeight},
        speed: {x: 0, y: -3},
        classes: 'thingy',
      },
      gillibrand: {
        name: "Kirsten Gillibrand",
        id:"gillibrand",
        src: "gillibrand.jpeg",
        level: 1,
        pos: { x:3*space.w/5, y:0, },
        size: { width: imgWidth, height: imgHeight},
        speed: {x: 0, y: -4},
        classes: 'thingy',
      },
    },
    2:{/*{
    harris: {
      name: "Kamala Harris",
      id:"harris",
      src: "kamala.jpg",
      level: 2,
      start: { x:3*space.w/5, y:0, },
      size: { width: imgWidth, height: imgHeight},
      speed: {x: 0, y: -4},
      classes: 'character',
  }*/
    kamala: {
      name: "Kamala Harris",
      id:"kamala",
      src: "kamala.jpg",
      level: 1,
      pos: { x:3*space.w/5, y:0, },
      size: { width: imgWidth, height: imgHeight},
      speed: {x: 0, y: -4},
      classes: 'thingy',
      bullet:bullets.kamalaBullet

      }
         
    },
    3:{
      deBlasio: {
      name: "Bill De Blasio",
      id:"deblasio",
      src: "deblasio.jpeg",
      level: 3,
      pos: { x:3*space.w/5, y:0, },
      size: { width: imgWidth, height: imgHeight},
      speed: {x: 5, y: -4},
      classes: 'thingy',
      bullet:null
      },
      bennet: {
        name: "Michael Bennet",
        id:"bennet",
        src: "bennet.jpeg",
        level: 3,
        pos: { x:-3*space.w/5, y:0, },
        size: { width: imgWidth, height: imgHeight},
        speed: {x: 12, y: -5},
        classes: 'thingy',
        bullet:null
        },
        yang: {
          name: "Andrew Yang",
          id:"yang",
          src: "yang.jpeg",
          level: 3,
          pos: { x:1*space.w/3, y:0, },
          size: { width: imgWidth, height: imgHeight},
          speed: {x: 12, y: 12},
          classes: 'thingy',
          bullet:null
          },
          bennet: {
            name: "Michael Bennet",
            id:"bennet",
            src: "bennet.jpeg",
            level: 3,
            pos: { x:-3*space.w/5, y:0, },
            size: { width: imgWidth, height: imgHeight},
            speed: {x: 12, y: -5},
            classes: 'thingy',
            bullet:null
            },
    }
  }
  
  const directions = {
    "39": {x:  13, y:  0},
    "37": {x: -13, y:  0},
    "40": {x:  0, y:  -13},
    "38": {x:  0, y: 13},
  }
  return {player, candidates, directions}

}