import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super('BootScene');
  }

  create() {
    this._genPlayer();
    this._genPlayerHeadlamp();
    this._genNPCLucas();
    this._genGround();
    this._genGroundStone();
    this._genTentOrange();
    this._genTentBlue();
    this._genCampfire();
    this._genTree();
    this._genHeadlampItem();
    this._genJournal();
    this._genBackpack();
    this._genHazard();
    this._genGate();
    this._genSign();
    this._genParticle();

    this.scene.start('TitleScene');
  }

  _g(w, h) {
    return this.make.graphics({ x: 0, y: 0, add: false });
  }

  _genPlayer() {
    const g = this._g(20, 28);
    // Body
    g.fillStyle(0x4a7ec7, 1);
    g.fillRect(2, 4, 16, 22);
    // Head
    g.fillStyle(0x7aabee, 1);
    g.fillRect(4, 0, 12, 12);
    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillRect(6, 3, 3, 3);
    g.fillRect(11, 3, 3, 3);
    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(7, 4, 2, 2);
    g.fillRect(12, 4, 2, 2);
    // Boots
    g.fillStyle(0x2a4a8a, 1);
    g.fillRect(2, 24, 7, 4);
    g.fillRect(11, 24, 7, 4);
    g.generateTexture('player', 20, 28);
    g.destroy();
  }

  _genPlayerHeadlamp() {
    const g = this._g(20, 28);
    g.fillStyle(0x4a7ec7, 1);
    g.fillRect(2, 4, 16, 22);
    g.fillStyle(0x7aabee, 1);
    g.fillRect(4, 0, 12, 12);
    g.fillStyle(0xffffff, 1);
    g.fillRect(6, 3, 3, 3);
    g.fillRect(11, 3, 3, 3);
    g.fillStyle(0x1a1a2e, 1);
    g.fillRect(7, 4, 2, 2);
    g.fillRect(12, 4, 2, 2);
    g.fillStyle(0x2a4a8a, 1);
    g.fillRect(2, 24, 7, 4);
    g.fillRect(11, 24, 7, 4);
    // Headlamp on forehead
    g.fillStyle(0xffd700, 1);
    g.fillCircle(10, 1, 3);
    g.fillStyle(0xffffff, 0.8);
    g.fillCircle(10, 1, 1);
    g.generateTexture('player_headlamp', 20, 28);
    g.destroy();
  }

  _genNPCLucas() {
    const g = this._g(20, 28);
    // Body — warm orange
    g.fillStyle(0xd4820a, 1);
    g.fillRect(2, 6, 16, 20);
    // Head
    g.fillStyle(0xe8a050, 1);
    g.fillRect(4, 0, 12, 14);
    // Hair tuft
    g.fillStyle(0xd4820a, 1);
    g.fillRect(4, 0, 12, 4);
    // Eyes
    g.fillStyle(0xffffff, 1);
    g.fillRect(6, 4, 3, 3);
    g.fillRect(11, 4, 3, 3);
    g.fillStyle(0x3a2000, 1);
    g.fillRect(7, 5, 2, 2);
    g.fillRect(12, 5, 2, 2);
    // Smile
    g.fillStyle(0x3a2000, 1);
    g.fillRect(7, 10, 6, 1);
    g.fillRect(6, 9, 1, 2);
    g.fillRect(13, 9, 1, 2);
    g.generateTexture('npc_lucas', 20, 28);
    g.destroy();
  }

  _genGround() {
    const g = this._g(32, 32);
    g.fillStyle(0x5a3a1a, 1);
    g.fillRect(0, 0, 32, 32);
    // Grass top
    g.fillStyle(0x3a6a1a, 1);
    g.fillRect(0, 0, 32, 6);
    // Texture lines
    g.lineStyle(1, 0x4a2a0a, 0.4);
    g.lineBetween(0, 12, 32, 12);
    g.lineBetween(0, 22, 32, 22);
    g.generateTexture('ground', 32, 32);
    g.destroy();
  }

  _genGroundStone() {
    const g = this._g(32, 32);
    g.fillStyle(0x7a7060, 1);
    g.fillRect(0, 0, 32, 32);
    g.lineStyle(1, 0x5a5040, 0.5);
    g.lineBetween(0, 10, 32, 10);
    g.lineBetween(16, 10, 16, 0);
    g.lineBetween(0, 22, 32, 22);
    g.lineBetween(8, 22, 8, 10);
    g.lineBetween(24, 22, 24, 32);
    g.generateTexture('ground_stone', 32, 32);
    g.destroy();
  }

  _genTentOrange() {
    const g = this._g(60, 50);
    // Tent body triangle
    g.fillStyle(0xc04010, 1);
    g.fillTriangle(30, 2, 4, 46, 56, 46);
    // Door
    g.fillStyle(0x1a0a00, 1);
    g.fillRect(22, 28, 16, 18);
    // Highlight stripe
    g.lineStyle(2, 0xff7040, 0.5);
    g.lineBetween(30, 5, 14, 42);
    g.generateTexture('tent_orange', 60, 50);
    g.destroy();
  }

  _genTentBlue() {
    const g = this._g(60, 50);
    g.fillStyle(0x2060a0, 1);
    g.fillTriangle(30, 2, 4, 46, 56, 46);
    g.fillStyle(0x0a0a20, 1);
    g.fillRect(22, 28, 16, 18);
    g.lineStyle(2, 0x60a0e0, 0.5);
    g.lineBetween(30, 5, 14, 42);
    g.generateTexture('tent_blue', 60, 50);
    g.destroy();
  }

  _genCampfire() {
    const g = this._g(32, 32);
    // Logs
    g.fillStyle(0x5a3010, 1);
    g.fillRect(6, 22, 20, 6);
    g.fillStyle(0x4a2008, 1);
    g.fillRect(10, 20, 12, 4);
    // Flames — outer
    g.fillStyle(0xff5500, 1);
    g.fillTriangle(16, 4, 4, 22, 28, 22);
    // Flames — mid
    g.fillStyle(0xff9900, 1);
    g.fillTriangle(16, 8, 8, 22, 24, 22);
    // Flames — inner
    g.fillStyle(0xffdd00, 1);
    g.fillTriangle(16, 12, 11, 22, 21, 22);
    // Ember
    g.fillStyle(0xffffff, 0.8);
    g.fillRect(15, 16, 2, 2);
    g.generateTexture('campfire', 32, 32);
    g.destroy();
  }

  _genTree() {
    const g = this._g(36, 80);
    // Trunk
    g.fillStyle(0x3a2008, 1);
    g.fillRect(14, 50, 8, 30);
    // Crown — dark green layered triangles (larch shape)
    g.fillStyle(0x1a3a10, 1);
    g.fillTriangle(18, 0, 2, 36, 34, 36);
    g.fillStyle(0x244a18, 1);
    g.fillTriangle(18, 8, 4, 40, 32, 40);
    g.fillStyle(0x1a3a10, 1);
    g.fillTriangle(18, 20, 6, 52, 30, 52);
    g.generateTexture('tree_larch', 36, 80);
    g.destroy();
  }

  _genHeadlampItem() {
    const g = this._g(24, 24);
    // Beam triangle
    g.fillStyle(0xffdd44, 0.4);
    g.fillTriangle(12, 8, 4, 24, 20, 24);
    // Lamp body
    g.fillStyle(0xddaa00, 1);
    g.fillRoundedRect(6, 4, 12, 10, 3);
    // Lens
    g.fillStyle(0xffeedd, 1);
    g.fillCircle(12, 9, 4);
    g.fillStyle(0xffffff, 0.6);
    g.fillCircle(11, 8, 2);
    // Strap
    g.lineStyle(2, 0x886600, 1);
    g.strokeRect(4, 3, 16, 12);
    g.generateTexture('item_headlamp', 24, 24);
    g.destroy();
  }

  _genJournal() {
    const g = this._g(24, 28);
    g.fillStyle(0x5c3a10, 1);
    g.fillRect(0, 0, 24, 28);
    g.lineStyle(1, 0xc8a040, 1);
    g.strokeRect(1, 1, 22, 26);
    // Pages
    g.fillStyle(0xf0e8d0, 1);
    g.fillRect(4, 4, 16, 20);
    // Lines
    g.lineStyle(1, 0xc0b090, 0.7);
    for (let y = 8; y < 22; y += 4) {
      g.lineBetween(6, y, 18, y);
    }
    g.generateTexture('item_journal', 24, 28);
    g.destroy();
  }

  _genBackpack() {
    const g = this._g(28, 28);
    g.fillStyle(0x2a6040, 1);
    g.fillRoundedRect(4, 2, 20, 24, 4);
    // Straps
    g.lineStyle(2, 0x1a4030, 1);
    g.lineBetween(8, 2, 8, 26);
    g.lineBetween(20, 2, 20, 26);
    // Pocket
    g.fillStyle(0x1a5030, 1);
    g.fillRoundedRect(8, 14, 12, 10, 2);
    g.lineStyle(1, 0x40a060, 0.5);
    g.strokeRoundedRect(4, 2, 20, 24, 4);
    g.generateTexture('item_backpack', 28, 28);
    g.destroy();
  }

  _genHazard() {
    const g = this._g(60, 10);
    g.fillStyle(0x2a4a1a, 1);
    g.fillRect(0, 0, 60, 10);
    g.lineStyle(1, 0x4a8a2a, 0.6);
    g.lineBetween(0, 0, 60, 0);
    g.generateTexture('hazard_branch', 60, 10);
    g.destroy();
  }

  _genGate() {
    const g = this._g(20, 80);
    g.fillStyle(0x080812, 1);
    g.fillRect(0, 0, 20, 80);
    g.lineStyle(1, 0x3a0000, 1);
    g.strokeRect(0, 0, 20, 80);
    // Warning stripes
    g.lineStyle(2, 0x5a1a00, 0.5);
    for (let y = 0; y < 80; y += 12) {
      g.lineBetween(0, y, 20, y + 8);
    }
    g.generateTexture('gate_dark', 20, 80);
    g.destroy();
  }

  _genSign() {
    const g = this._g(48, 36);
    // Post
    g.fillStyle(0x8b6030, 1);
    g.fillRect(22, 20, 4, 16);
    // Board
    g.fillStyle(0xf0e8c0, 1);
    g.fillRect(2, 2, 44, 22);
    g.lineStyle(1, 0xaa8840, 1);
    g.strokeRect(2, 2, 44, 22);
    g.generateTexture('sign_post', 48, 36);
    g.destroy();
  }

  _genParticle() {
    const g = this._g(6, 6);
    g.fillStyle(0xffffff, 1);
    g.fillCircle(3, 3, 3);
    g.generateTexture('particle_white', 6, 6);
    g.fillStyle(0xff8800, 1);
    g.fillCircle(3, 3, 3);
    g.generateTexture('particle_fire', 6, 6);
    g.destroy();
  }
}
