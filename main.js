title = "RUNNING CHALLENGE";

description = `
TAP TO JUMP
AVOID OBSTACLES
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

function update() {
  if (!ticks) {
    player = {
      pos: vec(20, 90),
      vel: vec(0, 0),
    };
    obstacles = [];
    ground = {
      pos: vec(0, 90),
      size: vec(120, 10),
    };
    score = 0;
  }

  if (input.isJustPressed && player.pos.y === ground.pos.y) {
    player.vel.y = -2.5;
    play("jump");
  }

  player.vel.y += 0.1;
  player.pos.add(player.vel);

  if (player.pos.y > ground.pos.y) {
    player.pos.y = ground.pos.y; // Keep the player on the ground
  }

  if (player.pos.y >= 90) {
    end();
  }

  if (input.isPressed && ticks % 20 === 0) {
    // Add obstacles on the ground
    obstacles.push({
      pos: vec(120, ground.pos.y),
      size: rnd(10, 20),
    });
  }

  // Draw ground
  color("light_black");
  rect(ground.pos.x, ground.pos.y, ground.size.x, ground.size.y);

  // Draw and move obstacles
  obstacles.forEach((obstacle) => {
    obstacle.pos.x -= 4;
    color("light_red");
    box(obstacle.pos, obstacle.size, 10);

    // Check for collisions with obstacles
    if (char("0", player.pos).isColliding.rect.light_red) {
      end();
    }
  });

  // Remove off-screen obstacles
  obstacles = obstacles.filter((obstacle) => obstacle.pos.x > -20);

  // Draw player
  color("black");
  char("0", player.pos);

  // Display the score
  color("black");
  text(`Score: ${score}`, 10, 10);

  // Increment the score for each frame survived
  score++;
}

addEventListener("load", onLoad);

function end() {
  console.log("Game Over. Score: " + score);
  // Add your game over logic here
  // For example, stop the game, show the score, etc.
}
