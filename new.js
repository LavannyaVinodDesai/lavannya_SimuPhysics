let Engine = Matter.Engine,
    World = Matter.World,
    Bodies = Matter.Bodies,
    Runner = Matter.Runner;

let engine, world, ground, ball;

function setup() {
  const container = document.querySelector(".simulation-container");
  let w = container.offsetWidth;
  let h = container.offsetHeight;

  let canvas = createCanvas(w, h);
  canvas.parent("simulation-placeholder");

  engine = Engine.create();
  world = engine.world;
  engine.runner = Runner.create();
  Runner.run(engine.runner, engine);

  ground = Bodies.rectangle(w / 2, h - 20, w, 20, { isStatic: true });
  World.add(world, ground);

  ball = Bodies.circle(w / 2, 50, 20, { restitution: 0.8 });
  World.add(world, ball);
}

function draw() {
  background(30);
  fill(255);
  rectMode(CENTER);
  rect(ground.position.x, ground.position.y, width, 20);
  ellipseMode(CENTER);
  ellipse(ball.position.x, ball.position.y, 40, 40);
}
