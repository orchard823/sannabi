export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;
export const FLOOR_Y = 642;
export const GRAVITY = 2050;
export const PLAYER_SPEED = 430;
export const PLAYER_JUMP = 760;
export const BULLET_SPEED = 920;
export const ENEMY_BULLET_SPEED = 430;
export const MAX_DT = 0.033;

export const COLORS = {
  black: "#000000",
  panel: "#121a26",
  platform: "#1b2637",
  platformEdge: "#53b1ff",
  wire: "#1eaedb",
  player: "#ffffff",
  playerCore: "#0070cc",
  bullet: "#f6c343",
  enemy: "#d53b00",
  enemyAlt: "#7c4dff",
  enemyBullet: "#c81b3a",
  heal: "#2fd36b",
  text: "#ffffff",
  textSoft: "#aeb8c8",
};

export const UPGRADES = [
  {
    id: "rapid",
    title: "속사 코일",
    description: "총열 회복이 빨라져 연속 사격이 쉬워집니다.",
    tag: "발사 간격 -18%",
  },
  {
    id: "damage",
    title: "레일 탄두",
    description: "탄환 피해량이 증가해 장갑 적을 더 빨리 제거합니다.",
    tag: "피해량 +28%",
  },
  {
    id: "mobility",
    title: "와이어 안정기",
    description: "이동 속도와 와이어 당김 힘이 증가합니다.",
    tag: "기동력 +12%",
  },
  {
    id: "heal",
    title: "응급 탄창",
    description: "최대 체력이 오르고 즉시 일부 체력을 회복합니다.",
    tag: "최대 HP +20",
  },
  {
    id: "pierce",
    title: "관통 약실",
    description: "일부 탄환이 한 번 더 적을 통과합니다.",
    tag: "관통 +1",
  },
];
