title = "   CUBEJUMP   ";

description = `
   TAP TO JUMP

  AVOID OBSTACLES!
`;

characters = [
  `
  _
 / \\
( o o )
 \\_/_/
`,
];

options = {
  theme: "dark",
  isPlayingBgm: true,
  isReplayEnabled: true,
};

let player;
let obstacles;
let ground;
let score = 0;
let highScore = 0;
let isGameOver = false;

let powerUp;
let isInvincible = false;
let invincibleTimer = 0;

function update() {
  if (!ticks) {
    resetGame();
  }

  if (input.isJustPressed && player.pos.y === ground.pos.y) {
    player.vel.y = -4;
    play("jump");
  }

  player.vel.y += 0.2;
  player.pos.add(player.vel);

  if (player.pos.y > ground.pos.y) {
    player.pos.y = ground.pos.y;
  }

  if (!isGameOver) {
    if (ticks % 60 === 0) {
      obstacles.push({
        pos: vec(120, ground.pos.y - rnd(5, 20)),
        size: vec(rnd(10, 20), rnd(10, 20)),
      });
    }

    if (ticks % 200 === 0 && !powerUp) {
      let powerUpPos = vec(120, ground.pos.y - rnd(5, 20));

      let isOverlapping = obstacles.some((obstacle) => {
        return (
          powerUpPos.x < obstacle.pos.x + obstacle.size.x &&
          powerUpPos.x + 10 > obstacle.pos.x &&
          powerUpPos.y < obstacle.pos.y + obstacle.size.y &&
          powerUpPos.y + 10 > obstacle.pos.y
        );
      });

      if (!isOverlapping) {
        powerUp = {
          pos: powerUpPos,
          size: vec(10, 10),
        };
      }
    }

    if (powerUp) {
      powerUp.pos.x -= 2;
      color("yellow");
      box(powerUp.pos, powerUp.size);

      if (
        player.pos.x < powerUp.pos.x + powerUp.size.x &&
        player.pos.x + player.width > powerUp.pos.x &&
        player.pos.y < powerUp.pos.y + powerUp.size.y &&
        player.pos.y + player.height > powerUp.pos.y
      ) {
        powerUp = null; 
        isInvincible = true; 
        invincibleTimer = 120; 
      }
    }

    if (isInvincible) {
      invincibleTimer--;

      if (invincibleTimer <= 0) {
        isInvincible = false; 
      }
    }

    obstacles.forEach((obstacle) => {
      obstacle.pos.x -= 2;
      color("light_red");
      box(obstacle.pos, obstacle.size);

      if (
        !isInvincible &&
        player.pos.x < obstacle.pos.x + obstacle.size.x &&
        player.pos.x + player.width > obstacle.pos.x &&
        player.pos.y < obstacle.pos.y + obstacle.size.y &&
        player.pos.y + player.height > obstacle.pos.y
      ) {
        isGameOver = true;

        if (score > highScore) {
          highScore = score;
        }
      }
    });

    obstacles = obstacles.filter((obstacle) => obstacle.pos.x > -20);

    color("light_black");
    rect(ground.pos.x, ground.pos.y, ground.size.x, ground.size.y);

    color("black");
    char("0", player.pos);

    color("black");
    text(`Score: ${score}`, 10, 10);
    text(`High: ${highScore}`, 10, 20);

    if (isInvincible) {
      color("yellow");
      text("Invincible!", 10, 30);
    }

    if (!input.isPressed) {
      score++;
    }
  } else {
    color("black");
    text("GAME OVER", 24, 20);
    text(`Score: ${score}`, 24, 38);
    text(`High: ${highScore}`, 24, 52);
    text("Tap to replay", 16, 70);

    if (input.isJustPressed) {
      resetGame();
    }
  }
}

function resetGame() {
  player = {
    pos: vec(20, 70),
    vel: vec(0, 0),
    width: 8,
    height: 8,
  };
  obstacles = [];
  ground = {
    pos: vec(0, 90),
    size: vec(120, 10),
  };
  score = 0;
  isGameOver = false;
  powerUp = null; 
  isInvincible = false; 
  invincibleTimer = 0; 
}

addEventListener("load", onLoad);