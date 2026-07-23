import { FLOOR_Y, GAME_HEIGHT } from "./constants.js";
import { seededRandom } from "./geometry.js";

export function createWorld(sector) {
  const random = seededRandom(1000 + sector * 97);
  const length = 2700 + sector * 180;
  const platforms = [
    { x: -320, y: FLOOR_Y, w: length + 760, h: 90 },
    { x: 280, y: 510, w: 260, h: 22 },
    { x: 720, y: 420, w: 300, h: 22 },
  ];
  const nodes = [];
  const skyline = [];

  for (let x = 360; x < length - 260; x += 280 + random() * 220) {
    const y = 260 + random() * 210;
    const width = 170 + random() * 220;
    platforms.push({ x, y, w: width, h: 22 });
    nodes.push({ x: x + width * 0.5, y: y - 86 });
  }

  for (let x = -200; x < length + 600; x += 150) {
    skyline.push({
      x,
      y: 170 + random() * 190,
      w: 70 + random() * 110,
      h: GAME_HEIGHT,
      light: random(),
    });
  }

  nodes.push({ x: 170, y: 250 }, { x: length - 360, y: 230 });

  return {
    sector,
    length,
    platforms,
    nodes,
    skyline,
    exit: { x: length - 180, y: FLOOR_Y - 124, w: 88, h: 124 },
  };
}

export function findGrappleNode(world, playerCenter, target) {
  let best = null;
  let bestScore = Infinity;

  for (const node of world.nodes) {
    const toPlayer = Math.hypot(node.x - playerCenter.x, node.y - playerCenter.y);
    const toTarget = Math.hypot(node.x - target.x, node.y - target.y);
    const score = toPlayer + toTarget * 1.2;
    if (toPlayer < 560 && toTarget < 210 && score < bestScore) {
      best = node;
      bestScore = score;
    }
  }

  return best;
}
