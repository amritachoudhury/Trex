const PLAY = 1;
const END = 0;
var gs = PLAY;
var trex, trex_run, trex_collided;
var rand, randNo;
var obs1, obs2, obs3, obs4, obs5, obs6;
var score = 0;
var restartImg, restart, gameOverImg, gameOver;
var birdImg

function preload(){
  trex_run =     loadAnimation("trex1.png","trex3.png","trex4.png");
  groundImg=loadImage("ground2.png");
  cloudImg=loadImage("cloud.png");
  obs1 = loadImage("obs1.png");
  obs2 = loadImage("obs2.png");
  obs3 = loadImage("obs3.png");
  obs4 = loadImage("obs4.png");
  obs5 = loadImage("obs5.png");
  obs6 = loadImage("obs6.png");
  trex_collided = loadAnimation("trex_collision.png");
  gameOverImg = loadImage("gameOver.png");
  restartImg = loadImage("restart.png");
  birdImg = loadImage("bird.png");
  
  jump = loadSound("jump.mp3");
  checkpoint = loadSound("checkpoint.mp3");
  die = loadSound("die.mp3");
  
}

function setup(){
  createCanvas(600,200);
  trex = createSprite(50,160,20,50);
  edges = createEdgeSprites();
  trex.addAnimation("running",trex_run);
  trex.addAnimation("collision",trex_collided);
  trex.scale = 0.5;
  trex.x = 30;
  
  gameOver = createSprite(270,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5
  
  restart = createSprite(390,100);
  restart.addImage(restartImg);
  restart.scale = 0.25;
  
  restart.visible = false;
  gameOver.visible = false;
  
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImg);
  ground.velocityX = -2;
  groundI = createSprite(200,190,400,20);
  groundI.visible = false;
  
  randNo = Math.round(random(1,100));
  
  console.log("1"+1);
  
  cloudGroup = new Group();
  obsGroup = createGroup();
  
  trex.setCollider("circle",0,0,40);
  
  //For AI
  //trex.setCollider("rectangle",0,0,trex.width+200,trex.height)
  
  trex.debug=true;
}

function draw(){
 // console.time("Time Elapsed");
  background("green"); 
  
  trex.collide(groundI);
  
  text("Score: "+score, 300,30);
  //console.log("The current Game State is "+gs);  
  //console.log(score,frameCount);  
  //console.timeEnd("Time Elapsed");
  //console.log("Frame Count: "+frameCount);
  //console.log("FPS: "+frameCount/60);
  //console.log("FPS Round Off: "+Math.round(frameCount/60));
  
  if (gs === PLAY) {
    // if(frameCount%60==0){
    //   score++
    // }
    //score = score + Math.round(frameCount/60);
    console.log(getFrameRate());
    score = score + Math.round(getFrameRate()/60);
    if(score > 0 && score%100 == 0) {
      checkpoint.play();
      ground.velocityX = ground.velocityX - 1;
      //console.log(ground.velocityX)
    }
    if(ground.x<0) {
      ground.x = ground.width/2;
    }
    if (keyDown("space")  && trex.y >= 156) {
      trex.velocityY = -12;
      jump.play();
      //playSound("jump.mp3")
    }
    trex.velocityY = trex.velocityY + 0.8;
    spawnClouds();
    spawnObstacles();
    if (trex.isTouching(obsGroup)) {
      gs = END;
      die.play();
      console.log("Trex is touching obstacle");
      //For AI
      //trex.velocityY = -15;
      //jump.play();  
    }
  }
  else if (gs === END) {
    restart.visible = true;
  	gameOver.visible = true;
    ground.velocityX = 0;
    trex.velocityY=0;
    trex.changeAnimation("collision",trex_collided);
    obsGroup.setVelocityXEach(0);
    cloudGroup.setVelocityXEach(0);
    obsGroup.setLifetimeEach(-1);
    cloudGroup.setLifetimeEach(-1);
    if(mousePressedOver(restart)){
      reset();
    }
  }
  drawSprites();
}

function spawnClouds() {
  if(frameCount % (Math.round(random(1,1000))) == 0) {
    var clouds = createSprite(600,100,40,10);
    var bird = createSprite(500,20,10,10);
    bird.addImage(birdImg);
    bird.scale = 0.15;
    clouds.addImage(cloudImg);
    clouds.scale = 0.4; 
    clouds.velocityX = -3;    
    clouds.y=random(1,100);
    
    clouds.lifetime = 200;
    
    clouds.depth = trex.depth;
    trex.depth = trex.depth + 1;
    cloudGroup.add(clouds);
  }
}

function spawnObstacles() {
  if(frameCount%100 == 0) {
    var obs = createSprite(600,165,10,10);
    //obs.velocityX = -3;
    obs.velocityX = ground.velocityX;
    var rand = Math.round(random(1,6));
    switch(rand){
      case 1: 
        obs.addImage(obs1);
        break;
      case 2:
        obs.addImage(obs2);
        break;
      case 3:
        obs.addImage(obs3);
        break;
      case 4:
        obs.addImage(obs4);
        break;
      case 5:
        obs.addImage(obs5);
        break;
      case 6:
        obs.addImage(obs6);
        break;
      default:
        break;
    }
    obs.scale = 0.5;
    obs.lifetime = 300;
    obsGroup.add(obs);
  }
}

function reset() {
  console.log("Reset")
  gs = PLAY;
  ground.velocityX = -2;
  score = 0;
  restart.visible = false;
  gameOver.visible = false;
  obsGroup.destroyEach();
  cloudGroup.destroyEach();
  trex.changeAnimation("running",trex_run);
}