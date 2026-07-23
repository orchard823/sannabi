import { COLORS, GAME_HEIGHT, GAME_WIDTH, GRAVITY, MAX_DT, PLAYER_JUMP, PLAYER_SPEED, UPGRADES } from "./constants.js";
import { applyUpgrade, createPlayer, createPlayerBullet, spawnEnemies } from "./actors.js";
import { updateBullets, updateEnemies } from "./combat.js";
import { centerOf, clamp, distance, normalize, pickUnique, resolvePlatformCollision, seededRandom } from "./geometry.js";
import { InputController } from "./input.js";
import { render } from "./render.js";
import { createUi } from "./ui.js";
import { createWorld, findGrappleNode } from "./world.js";

const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");
const input = new InputController(canvas);
const ui = createUi({ startRun, chooseUpgrade });

let state = createState();
let lastTime = performance.now();

function createState() {
  const world = createWorld(1);
  return {
    mode: "start",
    sector: 1,
    score: 0,
    time: 0,
    sectorStartedAt: 0,
    combatArmed: false,
    cameraX: 0,
    world,
    player: createPlayer(),
    enemies: spawnEnemies(world, 1),
    bullets: [],
    particles: [],
    choices: [],
    input,
  };
}

function startRun() {
  state = createState();
  state.mode = "running";
  ui.hidePanels();
  canvas.focus();
}

function loop(now) {
  const dt = Math.min(MAX_DT, (now - lastTime) / 1000);
  lastTime = now;
  update(dt);
  render(ctx, state);
  updateUpgradeKeys();
  ui.updateHud(state);
  input.endFrame();
  requestAnimationFrame(loop);
}

function update(dt) {
  state.time += dt;
  if (input.consume("KeyR")) {
    startRun();
  }
  if (state.mode !== "running") {
    return;
  }

  updatePlayer(dt);
  updateEnemies(state, dt, damagePlayer);
  updateBullets(state, dt, { damagePlayer, burst });
  updateParticles(dt);
  updateCamera();
  maybeOpenUpgrade();
}

function updatePlayer(dt) {
  const player = state.player;
  const wasGrounded = player.onGround;
  player.prevY = player.y;
  player.onGround = false;
  player.invuln = Math.max(0, player.invuln - dt);
  player.heat = Math.max(0, player.heat - dt);

  const left = input.isDown("KeyA", "ArrowLeft");
  const right = input.isDown("KeyD", "ArrowRight");
  const wantsJump = input.consume("Space", "KeyW", "ArrowUp");
  const wantsShot = input.mouse.clicked || input.isDown("KeyJ");
  const wantsGrapple = input.mouse.right || input.isDown("KeyE");
  if (left || right || wantsJump || wantsShot || wantsGrapple) {
    state.combatArmed = true;
  }

  movePlayerHorizontally(player, left, right, dt);
  if (wantsJump && wasGrounded) {
    player.vy = -PLAYER_JUMP;
  }

  const target = { x: input.mouse.x + state.cameraX, y: input.mouse.y };
  if (wantsShot && player.heat <= 0) {
    state.bullets.push(createPlayerBullet(player, target));
    player.heat = player.fireDelay;
    burst(player.x + player.w / 2, player.y + 24, COLORS.bullet, 5);
  }

  updateGrapple(player, target, wantsGrapple, dt);
  player.vy += GRAVITY * dt;
  player.x += clamp(player.vx, -760, 760) * dt;
  player.y += clamp(player.vy, -940, 980) * dt;

  for (const platform of state.world.platforms) {
    resolvePlatformCollision(player, platform);
  }
  player.x = clamp(player.x, 0, state.world.length - player.w);
  if (player.y > GAME_HEIGHT + 160) {
    damagePlayer(999);
  }
}

function movePlayerHorizontally(player, left, right, dt) {
  const speed = PLAYER_SPEED * player.speedBonus;
  if (left && !right) {
    player.vx -= speed * 7.5 * dt;
    player.face = -1;
  }
  if (right && !left) {
    player.vx += speed * 7.5 * dt;
    player.face = 1;
  }
  if (!left && !right) {
    player.vx *= 0.84;
  }
}

function updateGrapple(player, target, wantsGrapple, dt) {
  if (wantsGrapple && !player.grapple) {
    const node = findGrappleNode(state.world, centerOf(player), target);
    if (node) {
      player.grapple = { x: node.x, y: node.y };
      burst(node.x, node.y, COLORS.wire, 16);
    }
  }
  if (!wantsGrapple) {
    player.grapple = null;
  }
  if (!player.grapple) {
    return;
  }

  const anchor = player.grapple;
  const playerCenter = centerOf(player);
  const direction = normalize(anchor.x - playerCenter.x, anchor.y - playerCenter.y);
  const pull = 1500 * player.wirePower;
  player.vx += direction.x * pull * dt;
  player.vy += direction.y * pull * dt;
  if (distance(anchor, playerCenter) < 54) {
    player.grapple = null;
  }
}

function damagePlayer(amount) {
  const player = state.player;
  if (player.invuln > 0) {
    return;
  }
  player.hp -= amount;
  player.invuln = 0.48;
  burst(player.x + player.w / 2, player.y + player.h / 2, COLORS.enemyBullet, 18);
  if (player.hp <= 0) {
    state.mode = "gameover";
    ui.showGameOver(state.score);
  }
}

function maybeOpenUpgrade() {
  if (state.enemies.length > 0 || state.mode !== "running") {
    return;
  }
  state.mode = "upgrade";
  const random = seededRandom(state.sector * 491 + state.score);
  state.choices = pickUnique(UPGRADES, 3, random);
  ui.showUpgrades(state.choices);
}

function chooseUpgrade(index) {
  const upgrade = state.choices[index];
  if (!upgrade) {
    return;
  }
  applyUpgrade(state.player, upgrade.id);
  state.score += 250;
  state.sector += 1;
  state.sectorStartedAt = state.time;
  state.combatArmed = false;
  state.world = createWorld(state.sector);
  state.player.x = 90;
  state.player.y = 460;
  state.player.vx = 0;
  state.player.vy = 0;
  state.player.grapple = null;
  state.enemies = spawnEnemies(state.world, state.sector);
  state.bullets = [];
  state.mode = "running";
  ui.hideUpgrade();
  canvas.focus();
}

function updateParticles(dt) {
  for (const particle of state.particles) {
    particle.x += particle.vx * dt;
    particle.y += particle.vy * dt;
    particle.life -= dt * 1.8;
  }
  state.particles = state.particles.filter((particle) => particle.life > 0);
}

function burst(x, y, color, count) {
  for (let index = 0; index < count; index += 1) {
    const angle = (Math.PI * 2 * index) / count + state.time;
    const speed = 60 + (index % 4) * 42;
    state.particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      size: 2 + (index % 3),
      life: 0.5,
      color,
    });
  }
}

function updateCamera() {
  const target = clamp(state.player.x - GAME_WIDTH * 0.38, 0, state.world.length - GAME_WIDTH);
  state.cameraX += (target - state.cameraX) * 0.12;
}

function updateUpgradeKeys() {
  if (state.mode !== "upgrade") {
    return;
  }
  for (let index = 0; index < 3; index += 1) {
    if (input.consume(`Digit${index + 1}`)) {
      chooseUpgrade(index);
    }
  }
}

requestAnimationFrame(loop);
