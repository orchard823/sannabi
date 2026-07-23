import { COLORS, FLOOR_Y, GAME_HEIGHT, GAME_WIDTH } from "./constants.js";
import { clamp, lerp } from "./geometry.js";

export function render(ctx, state) {
  const { cameraX, world } = state;
  ctx.clearRect(0, 0, GAME_WIDTH, GAME_HEIGHT);
  drawBackdrop(ctx, state);

  ctx.save();
  ctx.translate(-cameraX, 0);
  drawWorld(ctx, world, cameraX);
  drawExit(ctx, world.exit);
  drawParticles(ctx, state.particles);
  drawBullets(ctx, state.bullets);
  drawEnemies(ctx, state.enemies, state.time);
  drawPlayer(ctx, state.player, state.time);
  ctx.restore();

  drawAim(ctx, state);
  drawCanvasHud(ctx, state);
}

function drawBackdrop(ctx, state) {
  const gradient = ctx.createLinearGradient(0, 0, 0, GAME_HEIGHT);
  gradient.addColorStop(0, "#0d121a");
  gradient.addColorStop(0.48, "#05070b");
  gradient.addColorStop(1, "#000000");
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, GAME_WIDTH, GAME_HEIGHT);

  ctx.globalAlpha = 0.2;
  for (let x = -120; x < GAME_WIDTH + 120; x += 80) {
    const offset = (x - (state.cameraX * 0.18) % 80);
    ctx.strokeStyle = COLORS.platformEdge;
    ctx.beginPath();
    ctx.moveTo(offset, 0);
    ctx.lineTo(offset - 160, GAME_HEIGHT);
    ctx.stroke();
  }
  ctx.globalAlpha = 1;
}

function drawWorld(ctx, world, cameraX) {
  for (const building of world.skyline) {
    const x = building.x - cameraX * 0.18;
    ctx.fillStyle = building.light > 0.55 ? "rgba(0, 112, 204, 0.12)" : "rgba(255, 255, 255, 0.05)";
    ctx.fillRect(x, building.y, building.w, building.h);
  }

  for (const platform of world.platforms) {
    ctx.fillStyle = COLORS.platform;
    ctx.fillRect(platform.x, platform.y, platform.w, platform.h);
    ctx.fillStyle = COLORS.platformEdge;
    ctx.globalAlpha = 0.8;
    ctx.fillRect(platform.x, platform.y, platform.w, 3);
    ctx.globalAlpha = 1;
  }

  for (const node of world.nodes) {
    ctx.strokeStyle = "rgba(30, 174, 219, 0.32)";
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
    ctx.stroke();
    ctx.fillStyle = COLORS.wire;
    ctx.beginPath();
    ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawExit(ctx, exit) {
  const gradient = ctx.createLinearGradient(exit.x, exit.y, exit.x + exit.w, exit.y + exit.h);
  gradient.addColorStop(0, "rgba(0, 112, 204, 0.12)");
  gradient.addColorStop(1, "rgba(30, 174, 219, 0.56)");
  ctx.fillStyle = gradient;
  ctx.fillRect(exit.x, exit.y, exit.w, exit.h);
  ctx.strokeStyle = COLORS.wire;
  ctx.lineWidth = 2;
  ctx.strokeRect(exit.x, exit.y, exit.w, exit.h);
}

function drawPlayer(ctx, player, time) {
  if (player.grapple) {
    ctx.strokeStyle = COLORS.wire;
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(player.x + player.w / 2, player.y + 12);
    ctx.lineTo(player.grapple.x, player.grapple.y);
    ctx.stroke();
  }

  const pulse = 0.5 + Math.sin(time * 16) * 0.08;
  ctx.fillStyle = COLORS.player;
  roundRect(ctx, player.x, player.y, player.w, player.h, 10);
  ctx.fill();
  ctx.fillStyle = COLORS.playerCore;
  roundRect(ctx, player.x + 8, player.y + 12, player.w - 16, player.h * pulse, 6);
  ctx.fill();
  ctx.fillStyle = COLORS.bullet;
  ctx.fillRect(player.x + (player.face > 0 ? player.w - 2 : -14), player.y + 24, 16, 6);
}

function drawEnemies(ctx, enemies, time) {
  for (const enemy of enemies) {
    const bob = enemy.type === "drone" ? Math.sin(time * 4 + enemy.phase) * 6 : 0;
    ctx.fillStyle = enemy.type === "drone" ? COLORS.enemyAlt : COLORS.enemy;
    roundRect(ctx, enemy.x, enemy.y + bob, enemy.w, enemy.h, enemy.type === "drone" ? 16 : 8);
    ctx.fill();
    ctx.fillStyle = COLORS.black;
    ctx.fillRect(enemy.x + 8, enemy.y + bob + 10, enemy.w - 16, 5);
  }
}

function drawBullets(ctx, bullets) {
  for (const bullet of bullets) {
    ctx.fillStyle = bullet.owner === "player" ? COLORS.bullet : COLORS.enemyBullet;
    ctx.beginPath();
    ctx.arc(bullet.x, bullet.y, bullet.r, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawParticles(ctx, particles) {
  for (const particle of particles) {
    ctx.globalAlpha = clamp(particle.life, 0, 1);
    ctx.fillStyle = particle.color;
    ctx.fillRect(particle.x, particle.y, particle.size, particle.size);
  }
  ctx.globalAlpha = 1;
}

function drawAim(ctx, state) {
  const x = state.input.mouse.x;
  const y = state.input.mouse.y;
  ctx.strokeStyle = "rgba(255, 255, 255, 0.46)";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x - 12, y);
  ctx.lineTo(x + 12, y);
  ctx.moveTo(x, y - 12);
  ctx.lineTo(x, y + 12);
  ctx.stroke();
}

function drawCanvasHud(ctx, state) {
  const heatRatio = clamp(state.player.heat / state.player.fireDelay, 0, 1);
  ctx.fillStyle = "rgba(255, 255, 255, 0.16)";
  roundRect(ctx, 32, GAME_HEIGHT - 42, 220, 10, 999);
  ctx.fill();
  ctx.fillStyle = heatRatio > 0.8 ? COLORS.bullet : COLORS.wire;
  roundRect(ctx, 32, GAME_HEIGHT - 42, lerp(10, 220, heatRatio), 10, 999);
  ctx.fill();

  ctx.fillStyle = COLORS.textSoft;
  ctx.font = "13px Consolas, monospace";
  ctx.fillText(`남은 적 ${state.enemies.length}`, 32, GAME_HEIGHT - 58);
}

function roundRect(ctx, x, y, w, h, radius) {
  const r = Math.min(radius, w / 2, h / 2);
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}
