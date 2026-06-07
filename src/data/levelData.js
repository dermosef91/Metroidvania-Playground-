// World is one continuous scrolling scene, width: 3600, height: 270

export const WORLD = {
  width: 3600,
  height: 270,
  gravity: 600,
};

// Ground segments [x, y, width, height]
export const GROUND = [
  // Area 1: Campsite
  [0, 230, 1200, 40],
  // Raised platforms in campsite
  [120, 195, 80, 16],   // small platform near tent A
  [680, 190, 100, 16],  // platform near tent B (slightly elevated)

  // Area 2: Forest (uneven terrain)
  [1200, 230, 200, 40],
  [1400, 215, 150, 40],
  [1550, 230, 200, 40],
  [1750, 210, 180, 40],
  [1930, 225, 120, 40],
  [2050, 230, 300, 40],
  [2350, 215, 180, 40],
  [2530, 225, 270, 40],

  // Area 3: Almhütte
  [2800, 230, 800, 40],
  // Hut interior floor
  [2870, 200, 240, 12],  // table platform inside hut
];

// Platforms that can be jumped through from below (one-way)
export const ONE_WAY_PLATFORMS = [
  [2960, 170, 80, 10],  // shelf inside hut
];

// Static environmental objects (drawn, not physics-active wide shapes)
// { type, x, y, [extra] }
export const OBJECTS = [
  // Campsite
  { type: 'campfire', x: 300, y: 210 },
  { type: 'tent_orange', x: 160, y: 185 },
  { type: 'tent_blue', x: 680, y: 175 },
  { type: 'sign', x: 55, y: 200, label: 'LÄRCHWALD ↓\nFORESTA DI LARICI' },
  { type: 'star_field', count: 60 },  // background

  // Forest
  { type: 'tree', x: 1280, y: 130 },
  { type: 'tree', x: 1370, y: 110 },
  { type: 'tree', x: 1480, y: 125 },
  { type: 'tree', x: 1600, y: 115 },
  { type: 'tree', x: 1700, y: 130 },
  { type: 'tree', x: 1820, y: 120 },
  { type: 'tree', x: 1960, y: 125 },
  { type: 'tree', x: 2080, y: 115 },
  { type: 'tree', x: 2180, y: 130 },
  { type: 'tree', x: 2280, y: 120 },
  { type: 'tree', x: 2400, y: 110 },
  { type: 'tree', x: 2500, y: 125 },
  { type: 'tree', x: 2650, y: 120 },
  { type: 'sign', x: 1555, y: 200, label: 'ACHTUNG /\nATTENZIONE', warning: true },

  // Almhütte
  { type: 'hut', x: 2860, y: 130 },
  { type: 'mountain_bg', x: 0, y: 0 },
];

// Gates (block passage until condition met)
// { id, x, y, width, height, condition }
export const GATES = [
  {
    id: 'forest_gate',
    x: 1130,
    y: 150,
    width: 20,
    height: 80,
    condition: 'has_headlamp',
    label: '!',
  },
];

// NPCs { id, x, y, type, dialogueFirst, dialogueRepeat }
export const NPCS = [
  {
    id: 'lucas',
    x: 450,
    y: 200,
    type: 'npc_lucas',
    dialogueFirst: 'LUCAS_FIRST',
    dialogueRepeat: 'LUCAS_AGAIN',
  },
];

// Items { id, x, y, type, ability, dialogue }
export const ITEMS = [
  {
    id: 'headlamp',
    x: 700,
    y: 165,
    type: 'item_headlamp',
    ability: 'has_headlamp',
    dialogue: 'HEADLAMP_PICKUP',
  },
  {
    id: 'wastl_journal',
    x: 2980,
    y: 155,
    type: 'item_journal',
    ability: null,
    dialogue: 'WASTL_JOURNAL',
  },
  {
    id: 'mia_backpack',
    x: 3380,
    y: 200,
    type: 'item_backpack',
    ability: null,
    dialogue: 'MIA_BACKPACK',
  },
];

// Interactables (read-only, no pickup)
export const INTERACTABLES = [
  { id: 'tent_a', x: 160, y: 185, radius: 50, dialogue: 'TENT_EMPTY' },
  { id: 'campfire', x: 300, y: 215, radius: 55, dialogue: 'CAMPFIRE_REST' },
  { id: 'forest_sign', x: 1555, y: 200, radius: 50, dialogue: 'FOREST_WARNING_SIGN' },
  { id: 'mia_note', x: 1900, y: 185, radius: 50, dialogue: 'MIA_NOTE_ON_TREE' },
  { id: 'forest_gate_sign', x: 1130, y: 190, radius: 40, dialogue: 'FOREST_GATE_BLOCKED', condition: '!has_headlamp' },
];

// Moving hazards { x, y, width, moveRange, speed }
export const HAZARDS = [
  { x: 1650, y: 175, width: 60, height: 10, moveRange: 80, speed: 60 },
  { x: 2150, y: 170, width: 60, height: 10, moveRange: 100, speed: 75 },
];

// Story triggers (world-space rects that fire once)
export const TRIGGERS = [
  { id: 'demo_end', x: 3450, y: 130, width: 100, height: 140 },
  { id: 'forest_enter', x: 1200, y: 100, width: 80, height: 170 },
];

// Light sources (static)
export const LIGHTS = [
  { x: 300, y: 220, radius: 120, pulse: true },   // campfire
];
