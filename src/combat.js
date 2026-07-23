import { COLORS, FLOOR_Y, GRAVITY } from "./constants.js";
import { createEnemyBullet } from "./actors.js";
import { centerOf, clamp, normalize, rectsOverlap, resolvePlatformCollision } from "./geometry.js";

export function updateEnemies(state, dt, damagePlayer) {
  const playerCenter = centerOf(state.player);
  const sectorAge = state.time - state.sectorStartedAt;
  const canShoot = sectorAge > 1.6 && (state.combatArmed || sectorAge > 8);

  for (const enemy of state.enemies) {
    const enemyCenter = centerOf(enemy);
    const direction = normalize(playerCenter.x - enemyCenter.x, playerCenter.y - enemyCenter.y);
    enemy.cooldown -= dt;

    if (enemy.type === "runner") {
      updateRunner(enemy, state, direction, dt);
    } else {
      enemy.x += direction.x * 88 * dt;
      enemy.y += direction.y * 54 * dt + Math.sin(state.time * 3 + enemy.phase) * dt * 28;
    }

    if (canShoot && enemy.cooldown <= 0 && Math.abs(enemyCenter.x - playerCenter.x) < 620) {
      state.bullets.push(createEnemyBullet(enemy, state.player));
      enemy.cooldown = enemy.type === "drone" ? 2 : 2.55;
    }
    if (rectsOverlap(enemy, state.player)) {
      damagePlayer(10);
      enemy.vx *= -0.8;
    }
  }
}

export function updateBullets(state, dt, callbacks) {
  for (const bullet of state.bullets) {
    bullet.x += bullet.vx * dt;
    bullet.y += bullet.vy * dt;
    bullet.life -= dt;
    if (bullet.owner === "player") {
      hitEnemiesWith(state, bullet, callbacks.burst);
    } else if (circleHitsRect(bullet, state.player)) {
      callbacks.damagePlayer(bullet.damage);
      bullet.life = 0;
    }
  }
  state.bullets = state.bullets.filter((bullet) => bullet.life > 0 && bullet.y < FLOOR_Y + 80);
}

function updateRunner(enemy, state, direction, dt) {
  enemy.prevY = enemy.y;
  enemy.vx += direction.x * 520 * dt;
  enemy.vy += GRAVITY * dt;
  enemy.x += clamp(enemy.vx, -230, 230) * dt;
  enemy.y += clamp(enemy.vy, -800, 840) * dt;
  for (const platform of state.world.platforms) {
    resolvePlatformCollision(enemy, platform);
  }
}

function hitEnemiesWith(state, bullet, burst) {
  for (const enemy of state.enemies) {
    if (circleHitsRect(bullet, enemy)) {
      enemy.hp -= bullet.damage;
      bullet.pierce -= 1;
      burst(bullet.x, bullet.y, COLORS.enemy, 8);
      if (bullet.pierce < 0) {
        bullet.life = 0;
      }
    }
  }
  const before = state.enemies.length;
  state.enemies = state.enemies.filter((enemy) => enemy.hp > 0);
  state.score += (before - state.enemies.length) * 100;
}

function circleHitsRect(circle, rect) {
  const x = clamp(circle.x, rect.x, rect.x + rect.w);
  const y = clamp(circle.y, rect.y, rect.y + rect.h);
  return Math.hypot(circle.x - x, circle.y - y) <= circle.r;
}
