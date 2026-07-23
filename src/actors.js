import { ENEMY_BULLET_SPEED, FLOOR_Y } from "./constants.js";
import { centerOf, normalize } from "./geometry.js";

export function createPlayer() {
  return {
    x: 90,
    y: 460,
    prevY: 460,
    w: 34,
    h: 58,
    vx: 0,
    vy: 0,
    onGround: false,
    hp: 100,
    maxHp: 100,
    heat: 0,
    fireDelay: 0.18,
    damage: 22,
    speedBonus: 1,
    wirePower: 1,
    pierce: 0,
    face: 1,
    grapple: null,
    invuln: 0,
  };
}

export function spawnEnemies(world, sector) {
  const enemies = [];
  const count = 4 + sector * 2;
  for (let index = 0; index < count; index += 1) {
    const x = Math.min(world.length - 520, 660 + index * 270);
    const type = index % 3 === 0 ? "drone" : "runner";
    enemies.push({
      type,
      x,
      y: type === "drone" ? 250 + (index % 4) * 54 : FLOOR_Y - 46,
      prevY: 0,
      w: type === "drone" ? 42 : 38,
      h: type === "drone" ? 34 : 46,
      vx: 0,
      vy: 0,
      hp: type === "drone" ? 44 + sector * 8 : 62 + sector * 10,
      cooldown: 1.8 + index * 0.28,
      phase: index * 0.7,
    });
  }
  return enemies;
}

export function createPlayerBullet(player, target) {
  const origin = { x: player.x + player.w * 0.62, y: player.y + player.h * 0.42 };
  const direction = normalize(target.x - origin.x, target.y - origin.y);
  player.face = direction.x >= 0 ? 1 : -1;
  return {
    owner: "player",
    x: origin.x,
    y: origin.y,
    r: 5,
    vx: direction.x * 920,
    vy: direction.y * 920,
    life: 0.82,
    damage: player.damage,
    pierce: player.pierce,
  };
}

export function createEnemyBullet(enemy, player) {
  const origin = centerOf(enemy);
  const target = centerOf(player);
  const direction = normalize(target.x - origin.x, target.y - origin.y);
  return {
    owner: "enemy",
    x: origin.x,
    y: origin.y,
    r: 6,
    vx: direction.x * ENEMY_BULLET_SPEED,
    vy: direction.y * ENEMY_BULLET_SPEED,
    life: 2.2,
    damage: 5,
    pierce: 0,
  };
}

export function applyUpgrade(player, id) {
  switch (id) {
    case "rapid":
      player.fireDelay = Math.max(0.07, player.fireDelay * 0.82);
      break;
    case "damage":
      player.damage = Math.round(player.damage * 1.28);
      break;
    case "mobility":
      player.speedBonus *= 1.12;
      player.wirePower *= 1.16;
      break;
    case "heal":
      player.maxHp += 20;
      player.hp = Math.min(player.maxHp, player.hp + 44);
      break;
    case "pierce":
      player.pierce += 1;
      break;
    default:
      break;
  }
}
