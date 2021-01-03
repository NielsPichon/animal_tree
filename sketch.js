// canvas size
w = 500;
h = 500;

// How fast to grow the tree
growSpeed = 0.05;
// how often to spawn a branch
branchProbability = 0.95;
// how often to kill a branch
stopProbability = 0.3;
// max number of branches alive simultaneously
maxBranch = 20;
// max growth angle with respect to the vertical
maxAngle = Math.PI / 2;

// distance interval where to spawn the next branch piece
minDist = 50;
maxDist = 100;

// create root at bottom center of canvas
activeSources = [];
// set first target point at vertical of root
activeTargets = [];
// set of fully grown branches
lines = [];

hasbranched = false;

t = 0;

function setup() {
  createCanvas(w, h);
  
  // create root at bottom center of canvas
  append(activeSources, createVector(width / 2, height - 1));
  
  // set first target point at vertical of root
  append(activeTargets, createVector(width / 2, height - 1 - minDist));
}

function draw() {
  background(0);
  stroke(255);
  
  t += growSpeed;
  
  // draw all static branches
  for (i = 0; i < lines.length; i++) {
    line(lines[i][0].x, lines[i][0].y, lines[i][1].x, lines[i][1].y);
    line(w - lines[i][0].x, lines[i][0].y, w - lines[i][1].x, lines[i][1].y);
  }
  
  strokeWeight(3);
  // draw growing branches
  for (i = 0; i < activeTargets.length; i++) {
    tgt = createVector(activeTargets[i].x * t + activeSources[i].x * (1 - t), activeTargets[i].y * t + activeSources[i].y * (1 - t));
    line(activeSources[i].x, activeSources[i].y, tgt.x, tgt.y);
    line(w - activeSources[i].x, activeSources[i].y, w - tgt.x, tgt.y);
  }
  
  // once the target point is reached, compute new branch
  if (t >= 1) {
    // store the fully grown branches
    for (i = 0; i < activeSources.length; i++) {
      append(lines, [activeSources[i].copy(), activeTargets[i].copy()]);
    }
    
    newTgt = [];
    newSrc = [];
    // for each new source, select the new targets
    for (i = 0; i < activeSources.length; i++) {
      // if the branch is randomly stopped or exits the canvas, do nothing
      stop = stopProbability;
      branch = branchProbability;
      if (activeTargets[i].y < height / 10) {
        stop = 0.99;
        branch = 0.1;
      }
      if ((random(0, 1) > stop || !hasbranched) && isInBounds(activeTargets[i])) {
        // create new target
        append(newTgt, setTarget(activeTargets[i].copy()));
        append(newSrc, activeTargets[i].copy());
      
        // if branching, create second new target
        if (random(0, 1) < branch && newSrc.length < maxBranch) {
          hasbranched = true;
          append(newTgt, setTarget(activeTargets[i].copy()));
          append(newSrc, activeTargets[i].copy());
        }
      }
    }
    activeTargets.splice(0, activeTargets.length);
    activeSources.splice(0, activeSources.length);
    arrayCopy(newTgt, activeTargets);
    arrayCopy(newSrc, activeSources);
    
    t = 0;
  }
}


function setTarget(src) {
  distance = random(minDist, maxDist);
  angle = random(-maxAngle, maxAngle);
  tgt = createVector(-distance * Math.cos(angle + Math.PI / 2) + src.x, -distance * Math.sin(angle + Math.PI / 2) + src.y);

  return tgt;
}

function  isInBounds(vec) {
  return vec.x > 0 && vec.x < width && vec.y > 0 && vec.y < height;
}