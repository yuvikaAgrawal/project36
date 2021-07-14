var dog,sadDog,happyDog,foodObj,feed,addFood,lastFed,fedTime;
var database,foodS,foodStock;


function preload(){
  sadDog=loadImage("Images/Dog.png");
  happyDog=loadImage("Images/happy dog.png");
}

function setup() {
  database=firebase.database();
  createCanvas(1000,400);

  foodObj=new Food();

    
  dog=createSprite(800,200,150,150);
  dog.addImage(sadDog);
  dog.scale=0.15;
  
  feed=createButton("feed the dog");
  feed.position(700,95);
  feed.mousePressed('feedDog');
  
  foodStock=database.ref('Food');
  foodStock.on("value",readStock);
  
  
  addFood=createButton("add the food");
  addFood.position(800,95);
  addFood.mousePressed('addFood');
}


function draw() {
  background(46,139,87);
  
  foodObj.display();


  fedTime=database.ref("feedTime");
  fedTime.on("value",function(data){
    lastFed=data.val();
    
  });


  fill(255,255,254)
  textSize(15);
  if(lastFed>=12){
    text("last Feed :"+ lastFed%12 +"PM",350,30)
  }else if(lastFed===0){
    text("Last Feed : 12 AM",350,30);
  }else{
    text("Last Feed :"+ lastFed +"AM",350,30);
  }
  drawSprites();
}

//function to read food Stock
function readStock(data){
  foodS=data.val();
  foodObj.updateFoodStock(foodS);
}

//function to update food stock and last fed time
function feedDog(){
  dog.addImage(happyDog);

  var food_S=foodObj.getFoodStock();
  
  if(food_S<=0){
    foodObj.updateFoodStock(food_S*0);
  }else{
    foodObj.updateFoodStock(food_S-1);
  }
  
  database.ref('/').update({
    Food:foodObj.getFoodStock(),
    feedTime:hour()
  })
}

//function to add food in stock
function addFood(){
  foodS++;
  database.ref('/').update({
    Food:foodS
  })
}