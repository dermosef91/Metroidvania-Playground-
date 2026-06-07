import Phaser from 'phaser';
import { Player } from '../entities/Player.js';
import { NPC } from '../entities/NPC.js';
import { Item } from '../entities/Item.js';
import { Dialogue } from '../systems/Dialogue.js';
import { DarknessOverlay } from '../systems/DarknessOverlay.js';
import { DIALOGUE } from '../data/dialogueData.js';
import { WORLD, GROUND, OBJECTS, GATES, NPCS, ITEMS, INTERACTABLES, HAZARDS, TRIGGERS, LIGHTS } from '../data/levelData.js';

export class WorldScene extends Phaser.Scene {
  constructor() {
    super('WorldScene');
  }

  create() {
    this.physics.world.setBounds(0, 0, WORLD.width, WORLD.height);
    this.cameras.main.setBounds(0, 0, WORLD.width, WORLD.height);

    this._triggeredIds = new Set();
    this._dialogueLocked = false;
    this._interactCooldown = 0;

    this._buildBackground();
    this._buildGround();
    this._buildObjects();
    this._buildGates();
    this._buildHazards();
    this._buildNPCs();
    this._buildItems();
    this._buildInteractables();

    this._player = new Player(this, 80, 195);
    this.cameras.main.startFollow(this._player.sprite, true, 0.12, 0.12);
    this.cameras.main.setDeadzone(60, 30);

    // Colliders — all after player is created
    this._setupColliders();

    this._dialogue = new Dialogue(this);
    this._darkness = new DarknessOverlay(this);

    // Register static lights
    this._staticLights = [];
    for (const l of LIGHTS) {
      const ref = this._darkness.addLight(l.x, l.y, l.radius, l.pulse);
      this._staticLights.push(ref);
    }

    // Player light
    this._playerLight = this._darkness.addLight(
      this._player.x, this._player.y, 60, false
    );
    this._player.playerLight = this._playerLight;

    this._cursors = this._buildCursors();
    this._setupGameEvents();

    // Forest enter event wires darkness
    this._forestEntered = false;
    this._demoEndPlayed = false;

    // Campfire particle emitter
    this._buildCampfireParticles();

    // Entry fade in — fadeIn resets the camera fade effect cleanly
    this.cameras.main.fadeIn(600, 0, 0, 0);

    // Set initial UI label
    this.game.events.emit('ui-area-label', 'Campsite — Dorf Tirol');
  }

  _buildCursors() {
    const keys = this.input.keyboard.addKeys({
      left: Phaser.Input.Keyboard.KeyCodes.LEFT,
      right: Phaser.Input.Keyboard.KeyCodes.RIGHT,
      up: Phaser.Input.Keyboard.KeyCodes.UP,
      a: Phaser.Input.Keyboard.KeyCodes.A,
      d: Phaser.Input.Keyboard.KeyCodes.D,
      w: Phaser.Input.Keyboard.KeyCodes.W,
      space: Phaser.Input.Keyboard.KeyCodes.SPACE,
      e: Phaser.Input.Keyboard.KeyCodes.E,
      f: Phaser.Input.Keyboard.KeyCodes.F,
    });
    return {
      left: { isDown: false },
      right: { isDown: false },
      up: { isDown: false },
      _keys: keys,
    };
  }

  _updateCursors() {
    const k = this._cursors._keys;
    this._cursors.left.isDown = k.left.isDown || k.a.isDown || this._touchLeft;
    this._cursors.right.isDown = k.right.isDown || k.d.isDown || this._touchRight;
    this._cursors.up.isDown = k.up.isDown || k.w.isDown || k.space.isDown;
  }

  _touchLeft = false;
  _touchRight = false;

  _setupGameEvents() {
    const ge = this.game.events;
    this._geHandlers = [];
    const on = (evt, fn) => { ge.on(evt, fn); this._geHandlers.push([evt, fn]); };

    on('touch-left', (v) => { this._touchLeft = v; });
    on('touch-right', (v) => { this._touchRight = v; });
    on('touch-jump', () => { this._player.doJump(); });
    on('touch-interact', () => { this._tryInteract(); });
    on('touch-lamp', () => { this._player.toggleHeadlamp(); });
    on('dialogue-advance', () => { this._dialogue.advance(); });
    on('dialogue-close', () => { this._dialogueLocked = false; });
    on('dialogue-open', () => { this._dialogueLocked = true; });

    on('ability-gained', (key) => {
      if (key === 'has_headlamp') {
        this._onHeadlampGained();
      }
    });

    on('set-player-light-radius', (radius) => {
      this._darkness.setLightRadius(this._playerLight, radius, 700);
    });

    // Remove global listeners when this scene shuts down (e.g. restart)
    this.events.once('shutdown', () => {
      for (const [evt, fn] of this._geHandlers) ge.off(evt, fn);
    });

    // Keyboard interact / lamp
    this.input.keyboard.on('keydown-E', () => this._tryInteract());
    this.input.keyboard.on('keydown-F', () => this._player.toggleHeadlamp());
    this.input.keyboard.on('keydown-SPACE', () => {
      if (this._dialogue.isActive()) this._dialogue.advance();
    });
  }

  _buildBackground() {
    const W = WORLD.width;
    const H = WORLD.height;

    // Sky gradient (fixed, drawn on a scrolling object that moves slow)
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x040408, 0x040408, 0x080818, 0x080818, 1);
    sky.fillRect(0, 0, W, 200);
    sky.setScrollFactor(0.1);

    // Stars (parallax bg)
    for (let i = 0; i < 120; i++) {
      const sx = Phaser.Math.Between(0, W);
      const sy = Phaser.Math.Between(0, 140);
      const sg = this.add.graphics();
      sg.fillStyle(0xffffff, Math.random() * 0.5 + 0.2);
      sg.fillRect(sx, sy, 1, 1);
      sg.setScrollFactor(0.08 + Math.random() * 0.05);
      sg.setDepth(0);
    }

    // Mountain silhouettes (parallax)
    const mtn = this.add.graphics();
    mtn.fillStyle(0x0a0a18, 1);
    mtn.fillTriangle(200, 190, 600, 60, 1000, 190);
    mtn.fillTriangle(700, 190, 1100, 50, 1500, 190);
    mtn.fillTriangle(1400, 190, 1800, 40, 2200, 190);
    mtn.fillTriangle(2100, 190, 2500, 55, 2900, 190);
    mtn.fillTriangle(2800, 190, 3200, 45, 3600, 190);
    mtn.setScrollFactor(0.2);
    mtn.setDepth(1);

    // Mid ground / treeline silhouette
    const treeline = this.add.graphics();
    treeline.fillStyle(0x06100a, 1);
    treeline.fillRect(0, 170, W, 60);
    for (let tx = 0; tx < W; tx += 20) {
      const th = Phaser.Math.Between(15, 35);
      treeline.fillTriangle(tx, 172, tx + 10, 172 - th, tx + 20, 172);
    }
    treeline.setScrollFactor(0.4);
    treeline.setDepth(2);
  }

  _buildGround() {
    this._platforms = this.physics.add.staticGroup();

    for (const [x, y, w, h] of GROUND) {
      const seg = this.add.tileSprite(x + w / 2, y + h / 2, w, h,
        y > 220 ? 'ground' : 'ground_stone');
      seg.setDepth(5);
      this.physics.add.existing(seg, true);
      this._platforms.add(seg);
    }
  }

  _buildObjects() {
    for (const obj of OBJECTS) {
      switch (obj.type) {
        case 'campfire': this._placeCampfire(obj.x, obj.y); break;
        case 'tent_orange':
          this.add.image(obj.x, obj.y, 'tent_orange').setDepth(6).setOrigin(0.5, 1); break;
        case 'tent_blue':
          this.add.image(obj.x, obj.y, 'tent_blue').setDepth(6).setOrigin(0.5, 1); break;
        case 'tree':
          this.add.image(obj.x, obj.y, 'tree_larch').setDepth(6).setOrigin(0.5, 1); break;
        case 'sign': this._placeSign(obj.x, obj.y, obj.label, obj.warning); break;
        case 'hut': this._placeHut(obj.x, obj.y); break;
        default: break;
      }
    }
  }

  _placeCampfire(x, y) {
    this._campfireSprite = this.add.image(x, y, 'campfire').setDepth(7).setOrigin(0.5, 1);
    // Flicker
    this.tweens.add({
      targets: this._campfireSprite,
      scaleX: 1.05,
      scaleY: 0.97,
      duration: 180,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  _placeSign(x, y, label, warning = false) {
    const sign = this.add.image(x, y, 'sign_post').setDepth(7).setOrigin(0.5, 1);
    this.add.text(x, y - 14, label, {
      fontFamily: 'monospace',
      fontSize: '5px',
      color: warning ? '#ffaa00' : '#3a2800',
      align: 'center',
      resolution: 2,
    }).setOrigin(0.5, 1).setDepth(8);
  }

  _placeHut(x, y) {
    // Stone walls
    const g = this.add.graphics();
    g.fillStyle(0x6a6050, 1);
    g.fillRect(x, y, 250, 100);
    // Roof
    g.fillStyle(0x3a2a18, 1);
    g.fillTriangle(x - 10, y, x + 125, y - 40, x + 260, y);
    // Door gap (open)
    g.fillStyle(0x050508, 1);
    g.fillRect(x + 8, y + 50, 28, 50);
    // Window
    g.fillStyle(0x1a1a08, 1);
    g.fillRect(x + 180, y + 20, 30, 24);
    g.lineStyle(1, 0xaa9060, 0.4);
    g.strokeRect(x, y, 250, 100);
    // Mortar lines
    g.lineStyle(1, 0x4a3a28, 0.3);
    for (let gy = y + 16; gy < y + 100; gy += 16) {
      g.lineBetween(x, gy, x + 250, gy);
    }
    g.setDepth(6);

    // Wall platform (top of hut for platforming)
    const wallTop = this.add.rectangle(x + 125, y, 250, 6, 0x6a6050);
    wallTop.setDepth(5);
    this.physics.add.existing(wallTop, true);
    this._platforms.add(wallTop);
  }

  _buildGates() {
    this._gates = {};
    for (const gate of GATES) {
      const g = this.add.image(gate.x, gate.y + gate.height / 2, 'gate_dark')
        .setDisplaySize(gate.width, gate.height)
        .setDepth(8);
      const body = this.physics.add.staticImage(gate.x, gate.y + gate.height / 2, 'gate_dark')
        .setDisplaySize(gate.width, gate.height)
        .refreshBody();
      body.setDepth(8);
      // "!" text
      const warn = this.add.text(gate.x, gate.y + gate.height / 2 - 20, gate.label || '!', {
        fontFamily: 'monospace',
        fontSize: '10px',
        color: '#ff4444',
        resolution: 2,
      }).setOrigin(0.5).setDepth(9);
      this.tweens.add({ targets: warn, alpha: 0.3, duration: 600, yoyo: true, repeat: -1 });

      this._gates[gate.id] = { visual: g, body, warn, data: gate };
    }
  }

  _buildHazards() {
    this._hazards = this.physics.add.group();
    for (const h of HAZARDS) {
      const haz = this.add.tileSprite(h.x, h.y, h.width, h.height, 'hazard_branch');
      haz.setDepth(6);
      this.physics.add.existing(haz, false);
      haz.body.setAllowGravity(false);
      haz.body.setImmovable(true);
      haz.body.setVelocityX(h.speed);
      haz._moveRange = h.moveRange;
      haz._originX = h.x;
      haz._dir = 1;
      this._hazards.add(haz);
    }
  }

  _buildNPCs() {
    this._npcs = [];
    for (const data of NPCS) {
      this._npcs.push(new NPC(this, data));
    }
  }

  _buildItems() {
    this._items = [];
    for (const data of ITEMS) {
      this._items.push(new Item(this, data));
    }
  }

  _buildInteractables() {
    this._interactables = INTERACTABLES.map(i => ({ ...i, _used: false }));
  }

  _buildCampfireParticles() {
    // Simple particle emitter for campfire sparks
    try {
      this.add.particles(300, 208, 'particle_fire', {
        speed: { min: 10, max: 40 },
        angle: { min: 250, max: 290 },
        scale: { start: 0.5, end: 0 },
        lifespan: { min: 300, max: 700 },
        quantity: 1,
        frequency: 120,
        alpha: { start: 0.9, end: 0 },
        gravityY: -40,
      }).setDepth(8);
    } catch (e) {
      // Particles API varies by Phaser version; silently skip
    }
  }

  _openGate(id) {
    const gate = this._gates[id];
    if (!gate) return;
    gate.warn.destroy();
    this.tweens.add({
      targets: [gate.visual, gate.body],
      alpha: 0,
      duration: 600,
      onComplete: () => {
        gate.body.destroy();
        gate.visual.destroy();
      },
    });
  }

  _onHeadlampGained() {
    // Open forest gate
    this._openGate('forest_gate');
    // Switch player light to headlamp radius (toggleable from now on)
    this._playerLight._baseRadius = 60;
    // Start darkness for next zone but don't enable yet — enable on forest enter
  }

  _tryInteract() {
    if (this._dialogueLocked) {
      this._dialogue.advance();
      return;
    }
    if (this._interactCooldown > 0) return;

    const px = this._player.x;
    const py = this._player.y;

    // Check items
    for (const item of this._items) {
      if (item.collected) continue;
      if (item.update(px, py)) {
        this._collectItem(item);
        this._interactCooldown = 500;
        return;
      }
    }

    // Check NPCs
    for (const npc of this._npcs) {
      const d = Phaser.Math.Distance.Between(px, py, npc.x, npc.y);
      if (d < 65) {
        const key = npc.getDialogue();
        this._showDialogue(DIALOGUE[key]);
        this._interactCooldown = 400;
        return;
      }
    }

    // Check interactables
    for (const ia of this._interactables) {
      if (ia.condition) {
        const cond = ia.condition;
        if (cond.startsWith('!')) {
          if (this._player.hasAbility(cond.slice(1))) continue;
        } else {
          if (!this._player.hasAbility(cond)) continue;
        }
      }
      const d = Phaser.Math.Distance.Between(px, py, ia.x, ia.y);
      if (d < (ia.radius || 55)) {
        this._showDialogue(DIALOGUE[ia.dialogue]);
        this._interactCooldown = 400;
        return;
      }
    }
  }

  _collectItem(item) {
    item.collect();
    const pages = DIALOGUE[item.dialogue] || [];
    if (item.ability) {
      this._player.giveAbility(item.ability);
    }
    this._showDialogue(pages);
  }

  _showDialogue(pages) {
    if (!pages || pages.length === 0) return;
    this._dialogue.show(pages);
  }

  _checkTriggers() {
    const px = this._player.x;
    const py = this._player.y;

    if (!this._forestEntered && px > 1200) {
      this._forestEntered = true;
      this._darkness.enable(1400);
      if (this.scene.get('UIScene')) {
        this.game.events.emit('ui-area-label', 'Lärchwald / Larch Forest');
      }
    }

    if (px > 2800 && !this._hutEntered) {
      this._hutEntered = true;
      this.game.events.emit('ui-area-label', 'Almhütte Ruins');
    }

    if (!this._demoEndPlayed && px > 3450) {
      this._demoEndPlayed = true;
      this._playDemoEnd();
    }
  }

  _playDemoEnd() {
    this._dialogueLocked = true;
    const endPages = DIALOGUE.DEMO_END;

    // Slight camera shake
    this.cameras.main.shake(300, 0.006);

    this.time.delayedCall(400, () => {
      this._dialogue.show(endPages, () => {
        // The end card draws its own full-screen black overlay (no camera fade)
        this._showEndCard();
      });
    });
  }

  _showEndCard() {
    // Overlay on camera (scroll factor 0)
    const W = this.scale.width;
    const H = this.scale.height;

    const endBg = this.add.graphics();
    endBg.fillStyle(0x000000, 1);
    endBg.fillRect(0, 0, W, H);
    endBg.setScrollFactor(0).setDepth(300).setAlpha(0);

    const title = this.add.text(W / 2, H * 0.38, 'VERLORENE NACHT', {
      fontFamily: 'monospace',
      fontSize: '18px',
      color: '#e8e0c0',
      letterSpacing: 3,
      resolution: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301).setAlpha(0);

    const sub = this.add.text(W / 2, H * 0.52, '/ LOST NIGHT', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#706870',
      letterSpacing: 2,
      resolution: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301).setAlpha(0);

    const note = this.add.text(W / 2, H * 0.68,
      'Demo ends here.\nThe Tatzelwurm is awake.\nThe adventure continues...', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#505060',
      align: 'center',
      lineSpacing: 5,
      resolution: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301).setAlpha(0);

    const restart = this.add.text(W / 2, H * 0.86, '[ tap / press to restart ]', {
      fontFamily: 'monospace',
      fontSize: '6px',
      color: '#353545',
      resolution: 2,
    }).setOrigin(0.5).setScrollFactor(0).setDepth(301).setAlpha(0);

    this.tweens.add({ targets: endBg, alpha: 1, duration: 600, delay: 200 });
    this.tweens.add({ targets: title, alpha: 1, duration: 900, delay: 900 });
    this.tweens.add({ targets: sub, alpha: 0.7, duration: 700, delay: 1300 });
    this.tweens.add({ targets: note, alpha: 1, duration: 700, delay: 1900 });
    this.tweens.add({
      targets: restart, alpha: 1, duration: 600, delay: 2800,
      onComplete: () => {
        this.tweens.add({ targets: restart, alpha: 0.3, duration: 800, yoyo: true, repeat: -1 });
      },
    });

    this.time.delayedCall(3000, () => {
      this.input.once('pointerdown', () => this.scene.start('TitleScene'));
      this.input.keyboard.once('keydown', () => this.scene.start('TitleScene'));
    });
  }

  _updateInteractHint() {
    const px = this._player.x;
    const py = this._player.y;
    let near = false;

    for (const item of this._items) {
      if (!item.collected && item.update(px, py)) { near = true; break; }
    }
    if (!near) {
      for (const npc of this._npcs) {
        if (Phaser.Math.Distance.Between(px, py, npc.x, npc.y) < 65) { near = true; break; }
      }
    }
    if (!near) {
      for (const ia of this._interactables) {
        if (Phaser.Math.Distance.Between(px, py, ia.x, ia.y) < (ia.radius || 55)) { near = true; break; }
      }
    }
    this.game.events.emit('show-interact-hint', near);
  }

  update(time, delta) {
    this._updateCursors();
    this._interactCooldown = Math.max(0, this._interactCooldown - delta);

    if (!this._dialogueLocked) {
      this._player.update(this._cursors, delta);
    }

    // NPC updates
    for (const npc of this._npcs) {
      npc.update(this._player.x, this._player.y);
    }

    // Hazard movement
    for (const haz of this._hazards.getChildren()) {
      const dx = haz.x - haz._originX;
      if (Math.abs(dx) > haz._moveRange) {
        haz.body.setVelocityX(-haz.body.velocity.x);
      }
    }

    // Darkness update
    this._darkness.update(
      this.cameras.main.scrollX,
      this.cameras.main.scrollY,
      delta
    );

    this._checkTriggers();
    this._updateInteractHint();
  }

  _setupColliders() {
    this.physics.add.collider(this._player.sprite, this._platforms);

    // Gate colliders
    for (const id in this._gates) {
      this.physics.add.collider(this._player.sprite, this._gates[id].body);
    }

    // Hazard overlap (knock player back)
    this.physics.add.overlap(this._player.sprite, this._hazards, (playerSprite, haz) => {
      // Nudge player away
      const dir = playerSprite.x < haz.x ? -1 : 1;
      playerSprite.body.setVelocityX(dir * 200);
      playerSprite.body.setVelocityY(-180);
    });
  }
}
