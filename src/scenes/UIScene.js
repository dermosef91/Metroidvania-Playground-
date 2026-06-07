import Phaser from 'phaser';

export class UIScene extends Phaser.Scene {
  constructor() {
    super({ key: 'UIScene', active: false });
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Support simultaneous touches (move + jump at the same time)
    this.input.addPointer(3);

    this._dialogueOpen = false;
    this._abilities = new Set();

    // Listen for game events
    const ge = this.game.events;
    this._geHandlers = [];
    const on = (evt, fn) => { ge.on(evt, fn); this._geHandlers.push([evt, fn]); };

    on('dialogue-open', () => { this._dialogueOpen = true; });
    on('dialogue-close', () => { this._dialogueOpen = false; });
    on('ability-gained', (key) => {
      this._abilities.add(key);
      this._updateAbilityBar();
    });
    on('show-interact-hint', (show) => {
      this.interactHint.setVisible(show);
    });
    on('ui-area-label', (text) => { this.setAreaLabel(text); });

    this.events.once('shutdown', () => {
      for (const [evt, fn] of this._geHandlers) ge.off(evt, fn);
    });

    // Touch control zones
    this._buildTouchControls(W, H);
    this._buildHUD(W, H);

    // Keyboard shortcuts shown as tiny labels
    this._isMobile = this.sys.game.device.input.touch;
  }

  _buildTouchControls(W, H) {
    // Left movement zone (left 45%)
    const zoneW = W * 0.45;
    const zoneH = H * 0.55;
    const zoneY = H - zoneH;

    // Left zone visual
    this._leftZoneBg = this.add.graphics();
    this._leftZoneBg.fillStyle(0xffffff, 0.04);
    this._leftZoneBg.fillRoundedRect(4, zoneY + 4, zoneW - 8, zoneH - 8, 6);
    this._leftZoneBg.setDepth(190);

    // D-pad arrows
    this._arrowLeft = this._makeButton(28, H - 28, '◀', 14);
    this._arrowRight = this._makeButton(70, H - 28, '▶', 14);

    // Right control cluster
    const RX = W - 28;
    const RY = H - 28;

    // Jump button
    this._jumpBtn = this._makeCircleButton(RX, RY, 'JUMP', 0x2255aa);
    // Interact button
    this._interactBtn = this._makeCircleButton(RX - 40, RY - 12, 'E', 0x226622);
    // Headlamp button (hidden until ability gained)
    this._lampBtn = this._makeCircleButton(RX - 22, RY - 44, '☀', 0x886600);
    this._lampBtn.container.setVisible(false);
    this._lampBtn.container.setDepth(195);

    // Interact hint (!) near interact button
    this.interactHint = this.add.text(RX - 40, RY - 30, '!', {
      fontFamily: 'monospace',
      fontSize: '12px',
      color: '#ffdd44',
      resolution: 2,
    }).setOrigin(0.5).setDepth(196).setVisible(false);

    this.tweens.add({
      targets: this.interactHint,
      y: RY - 35,
      duration: 400,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Ability bar
    this._abilityIcons = [];
    this._abilityBar = this.add.container(8, 8).setDepth(195);

    // Touch handlers
    this._setupTouchInput(W, H, zoneW, zoneH, zoneY, RX, RY);
  }

  _makeButton(x, y, label, size) {
    const txt = this.add.text(x, y, label, {
      fontFamily: 'monospace',
      fontSize: `${size}px`,
      color: '#ffffff',
      resolution: 2,
    }).setOrigin(0.5).setDepth(193).setAlpha(0.35);
    return txt;
  }

  _makeCircleButton(x, y, label, color) {
    const r = label === 'JUMP' ? 18 : 14;
    const bg = this.add.graphics();
    bg.fillStyle(color, 0.45);
    bg.fillCircle(0, 0, r);
    bg.lineStyle(1, 0xffffff, 0.2);
    bg.strokeCircle(0, 0, r);

    const txt = this.add.text(0, 0, label, {
      fontFamily: 'monospace',
      fontSize: label === 'JUMP' ? '7px' : '9px',
      color: '#ffffff',
      resolution: 2,
    }).setOrigin(0.5);

    const container = this.add.container(x, y, [bg, txt]).setDepth(193);
    return { container, bg, txt };
  }

  _setupTouchInput(W, H, zoneW, zoneH, zoneY, RX, RY) {
    // Remember geometry for per-frame polling
    this._zoneW = zoneW;
    this._zoneY = zoneY;
    this._RX = RX;
    this._RY = RY;

    // Discrete buttons — pointerdown fires once per pointer, so this is
    // multitouch-safe (jump while moving, etc.)
    this.input.on('pointerdown', (ptr) => {
      if (this._dialogueOpen) {
        this.game.events.emit('dialogue-advance');
        return;
      }
      this._handleButtonTap(ptr.x, ptr.y);
    });
  }

  _handleButtonTap(x, y) {
    const RX = this._RX;
    const RY = this._RY;

    // Jump button
    if (Phaser.Math.Distance.Between(x, y, RX, RY) < 28) {
      this.game.events.emit('touch-jump');
      this._flashJump();
      return;
    }

    // Interact button
    if (Phaser.Math.Distance.Between(x, y, RX - 40, RY - 12) < 24) {
      this.game.events.emit('touch-interact');
      return;
    }

    // Lamp button
    if (this._lampBtn.container.visible &&
        Phaser.Math.Distance.Between(x, y, RX - 22, RY - 44) < 24) {
      this.game.events.emit('touch-lamp');
      return;
    }
  }

  _flashJump() {
    this._jumpBtn.bg.clear();
    this._jumpBtn.bg.fillStyle(0x4488ff, 0.7);
    this._jumpBtn.bg.fillCircle(0, 0, 18);
    this.time.delayedCall(150, () => {
      this._jumpBtn.bg.clear();
      this._jumpBtn.bg.fillStyle(0x2255aa, 0.45);
      this._jumpBtn.bg.fillCircle(0, 0, 18);
      this._jumpBtn.bg.lineStyle(1, 0xffffff, 0.2);
      this._jumpBtn.bg.strokeCircle(0, 0, 18);
    });
  }

  // Poll all active pointers each frame so the movement zone is reliable
  // and works alongside simultaneous button presses.
  update() {
    if (this._dialogueOpen) {
      this.game.events.emit('touch-left', false);
      this.game.events.emit('touch-right', false);
      if (this._arrowLeft) this._arrowLeft.setAlpha(0.35);
      if (this._arrowRight) this._arrowRight.setAlpha(0.35);
      return;
    }

    const pts = this.input.manager.pointers.slice();
    if (this.input.mousePointer) pts.push(this.input.mousePointer);

    let moveDir = 0; // -1 = left, 1 = right
    for (const p of pts) {
      if (!p || !p.isDown) continue;
      if (p.x < this._zoneW && p.y > this._zoneY) {
        moveDir = p.x < this._zoneW * 0.5 ? -1 : 1;
        break;
      }
    }

    this.game.events.emit('touch-left', moveDir === -1);
    this.game.events.emit('touch-right', moveDir === 1);
    if (this._arrowLeft) this._arrowLeft.setAlpha(moveDir === -1 ? 0.9 : 0.35);
    if (this._arrowRight) this._arrowRight.setAlpha(moveDir === 1 ? 0.9 : 0.35);
  }

  _buildHUD(W, H) {
    // Top-left: area label
    this.areaLabel = this.add.text(8, 8, '', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#7a9ab0',
      resolution: 2,
    }).setDepth(195);

    // Keyboard hint (small, bottom-left when no touch)
    this.keyHint = this.add.text(4, H - 14, '[WASD/←→] Move  [Space] Jump  [E] Interact  [F] Lamp', {
      fontFamily: 'monospace',
      fontSize: '5px',
      color: '#444455',
      resolution: 2,
    }).setDepth(195);
  }

  _updateAbilityBar() {
    // Clear existing icons
    this._abilityBar.removeAll(true);
    let ix = 0;
    for (const ab of this._abilities) {
      const icon = this.make.text({
        x: ix * 22,
        y: 0,
        text: ab === 'has_headlamp' ? '☀' : '?',
        style: { fontFamily: 'monospace', fontSize: '11px', color: '#ffd700', resolution: 2 },
        add: false,
      });
      this._abilityBar.add(icon);
      ix++;

      if (ab === 'has_headlamp') {
        this._lampBtn.container.setVisible(true);
      }
    }
    this._abilityBar.setY(22);
  }

  setAreaLabel(text) {
    this.areaLabel.setText(text);
  }
}
