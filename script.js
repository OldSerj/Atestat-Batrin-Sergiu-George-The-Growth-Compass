//canvas stuff
const canvas = document.getElementById('myCanvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

//OG variables
var qnum = 0;
let minn = 0;
let unclear = false;
let see = -1;
let ended = false;
let currentTrait = 0;

//OG lists
let db = ['db/EI.txt', 'db/SN.txt', 'db/FT.txt', 'db/JP.txt'];
let colours=[
  {
    "number":1,
    "color": "rgb(255, 69, 69)",
    "red": 255,
    "green": 69,
    "blue": 69,
    "value": -10,
    "chosen": false
  },
  {
    "number":2,
    "color": "rgb(255, 124, 124)",
    "red": 255,
    "green": 124,
    "blue": 124,
    "value": -5,
    "chosen": false
  },
  {
    "number":3,
    "color": "lightgray",
    "red": 211,
    "green": 211,
    "blue": 211,
    "value": 0,
    "chosen": false
  },
  {
    "number":4,
    "color": "rgb(110, 180, 110)",
    "red": 110,
    "green": 180,
    "blue": 110,
    "value": 5,
    "chosen": false
  },
  {
    "number":5,
    "color": "rgb(29, 199, 29)",
    "red": 29,
    "green": 199,
    "blue": 29,
    "value": 10,
    "chosen": false
  }
]

//classes
class Circle{
  constructor(number)
  {
    this.info = colours[number];
    this.position = 0;
  }
  spawn()
  {
    this.info.chosen = false;
    ctx.fillStyle = "black";
    ctx.beginPath();
    ctx.arc(this.info.number*100, canvas.height-75, 50, 0, 2 * Math.PI); 
    ctx.fill();
    ctx.fillStyle = colours[this.info.number-1].color;
    ctx.beginPath();
    ctx.arc(this.info.number*100, canvas.height-75, 48, 0, 2 * Math.PI);
    ctx.fill();
  }
}

class Category
{
  static points = 0;
  constructor(number)
  {
    this.index = 0;
    this.stop = 10;
    this.score = 0;
    fetch(db[number])
    .then(response => response.text())
    .then(text => {
      this.questions = text.split('\n');
    })
  }
  
  canAsk()
  {
    return this.index<this.stop;
  }



  askQuestion(trait)
  {
    ctx.clearRect(0,0,canvas.width, canvas.height);
    ctx.textAlign = 'left';
    ctx.font = 70 - this.questions[this.index].length/2 + 'px Arial';
    ctx.fillStyle = 'black';
    ctx.textAlign = 'left';
    ctx.textBaseline = 'top';
    ctx.fillText(this.questions[this.index], 0,0);
    /*ctx.fillStyle = 'blue';
    ctx.textAlign = 'center';
    ctx.font = '50px Arial';
    ctx.fillText('points' + Category.points,canvas.width-200, canvas.height-40);*/
    this.index++;
  }
}

//class lists
const c = [new Circle(0), new Circle(1), new Circle(2), new Circle(3), new Circle(4)];
const query = [new Category(0), new Category(1), new Category(2), new Category(3)];



//intro code
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.font = '50px Arial';
ctx.fillText('Press Space',canvas.width/2, canvas.height/2 + 60);
ctx.fillText('Best used in fullscreen', canvas.width/2, canvas.height/2);


//functions
function spawnAgreementChooser()
{
  for(let i=0;i<=4;i++)
  {
    c[i].spawn();
  }  
}

function newQuestion(){
  if(qnum>=40) generateResult();
  ctx.fillStyle = 'white';
  ctx.textAlign = 'center';
  ctx.font = '50px Arial';
  currentTrait = Math.floor(Math.random() * 4);
  if(query[currentTrait].canAsk()){
    qnum++;
    query[currentTrait].askQuestion(currentTrait);
    spawnAgreementChooser();
  }
  else newQuestion();
}

function generateResult()
{
  ended = true;
  unclear = false;
  ctx.clearRect(0,0,canvas.width, canvas.height)
  ctx.fillStyle = 'blue';
  ctx.textAlign = 'center';
  ctx.font = '50px Arial';
  ctx.fillText((query[0].score+100)/2+ " " + (query[1].score+100)/2 + " " + (query[2].score+100)/2 + " " + (query[3].score+100)/2 ,canvas.width/2, canvas.height/2 + 60);
  let result = ['a', 'b', 'c', 'd'];
  result[0] = query[0].score > 0 ? 'E' : 'I';
  result[1] = query[1].score > 0 ? 'S' : 'N';
  result[2] = query[2].score > 0 ? 'F' : 'T';
  result[3] = query[3].score > 0 ? 'J' : 'P';
  ctx.fillText(result[0]+result[1]+result[2]+result[3],canvas.width/2, canvas.height/2 - 60);
}


//listeners
window.addEventListener('keydown', function(e){
  if(e.key === 'c')
  {
    see = (query[currentTrait].index-1)%2;
    ctx.fillStyle = 'blue';
    ctx.textAlign = 'center';
    ctx.font = '50px Arial';
    ctx.fillText(see ,canvas.width-160, canvas.height-60);
  }
  if(e.key === ' ' && qnum<=40)
  {
    let nr = 0;
    for(let i=0;i<=4;i++)
      if(c[i].info.chosen) nr++;
    if(nr!=1 && qnum>0 && ended === false)
    {
      ctx.fillStyle = 'red';
      ctx.textAlign = 'center';
      ctx.font = '70px Arial';
      ctx.fillText('Unclear choice',canvas.width-250, canvas.height-100);
      unclear = true;
      spawnAgreementChooser();
    }
    else
    {
      for(let i=0;i<=4;i++)
        if(c[i].info.chosen)
        {
          if((query[currentTrait].index-1)%2 === 0)
          {
            query[currentTrait].score+=c[i].info.value;
            Category.points+=c[i].info.value;
          }
          else
          {
            query[currentTrait].score-=c[i].info.value;
            Category.points-=c[i].info.value;
          }
          c[i].info.chosen = false;
        }
      newQuestion();
    }
  }
});

window.addEventListener('click', function(e){
  const pixelColour = ctx.getImageData(e.x, e.y, 1, 1);
  console.log(pixelColour);
  const pc = pixelColour.data;
  c.forEach(object => {
    if(object.info.red === pc[0] && object.info.green === pc[1] && object.info.blue === pc[2])
    {
      object.info.chosen = true;
      ctx.fillStyle = 'blue';
      ctx.textAlign = 'center';
      ctx.font = '50px Arial';
      ctx.fillText('x', object.info.number*100, canvas.height-100);
      if(unclear === true)
      {
        for(let i=1;i<=3;i++)
        {
          ctx.fillStyle = 'rgb(190, 255, 158)';
          ctx.textAlign = 'center';
          ctx.font = '70px Arial';
          ctx.fillText('Unclear choice',canvas.width-250, canvas.height-100);
        }
        unclear = false;
      }
    }
  });
});

window.addEventListener('resize', function () { 
  "use strict";
  window.location.reload();
});