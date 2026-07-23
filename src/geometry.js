export function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

export function lerp(start, end, t) {
  return start + (end - start) * t;
}

export function distance(a, b) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.hypot(dx, dy);
}

export function normalize(x, y) {
  const length = Math.hypot(x, y);
  if (length <= 0.0001) {
    return { x: 1, y: 0 };
  }
  return { x: x / length, y: y / length };
}

export function rectsOverlap(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}

export function centerOf(rect) {
  return { x: rect.x + rect.w / 2, y: rect.y + rect.h / 2 };
}

export function seededRandom(seed) {
  let value = seed % 2147483647;
  if (value <= 0) {
    value += 2147483646;
  }
  return () => {
    value = (value * 16807) % 2147483647;
    return (value - 1) / 2147483646;
  };
}

export function pickUnique(items, count, random) {
  const pool = [...items];
  const picks = [];
  while (pool.length > 0 && picks.length < count) {
    const index = Math.floor(random() * pool.length);
    const [item] = pool.splice(index, 1);
    picks.push(item);
  }
  return picks;
}

export function resolvePlatformCollision(actor, platform) {
  const previousBottom = actor.prevY + actor.h;
  const currentBottom = actor.y + actor.h;
  const horizontal = actor.x + actor.w > platform.x && actor.x < platform.x + platform.w;

  if (horizontal && previousBottom <= platform.y && currentBottom >= platform.y && actor.vy >= 0) {
    actor.y = platform.y - actor.h;
    actor.vy = 0;
    actor.onGround = true;
    return true;
  }

  return false;
}
