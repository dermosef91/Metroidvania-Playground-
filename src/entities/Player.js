export class Player {
  constructor(scene, x, y) {
    this.scene = scene;
    this.abilities = new Set();

    // Physics sprite from generated texture
    this.sprite = scene.physics.add.sprite(x, y, 'player');
    this.sprite.setCollideWorldBounds(false);
    this.sprite.body.setSize(18, 26);
    this.sprite.body.setOffset(1, 1);
    this.sprite.setDepth(10);

    // Coyote time
    this._coyoteTime = 0;
    this._coyoteGrace = 100;
    this._wasOnGround = false;

    // Jump buffer
    this._jumpBuffer = 0;
    this._jumpBufferGrace = 120;

    // Headlamp light ref (set by WorldScene)
    this.playerLight = null;
    this._headlampOn = false;
    this._headlampBaseRadius = 60;
    this._headlampOnRadius = 200;

    // Facing
    this._facingRight = true;

    // State
    this.interactionRadius = 65;
    this.dead = false;
  }

  giveAbility(key) {
    if (this.abilities.has(key)) return false;
    this.abilities.add(key);
    this.scene.game.events.emit('ability-gained', key);
    return true;
  }

  hasAbility(key) {
    return this.abilities.has(key);
  }

  toggleHeadlamp() {
    if (!this.abilities.has('has_headlamp')) return;
    this._headlampOn = !this._headlampOn;
    if (this.playerLight) {
      const target = this._headlampOn ? this._headlampOnRadius : this._headlampBaseRadius;
      this.scene.game.events.emit('set-player-light-radius', target);
    }
    // Swap texture
    this.sprite.setTexture(this._headlampOn ? 'player_headlamp' : 'player');
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }
  get body() { return this.sprite.body; }

  update(cursors, delta) {
    if (this.dead) return;

    const body = this.sprite.body;
    const onGround = body.blocked.down;

    // Coyote time tracking
    if (onGround) {
      this._coyoteTime = this._coyoteGrace;
      this._wasOnGround = true;
    } else {
      this._coyoteTime = Math.max(0, this._coyoteTime - delta);
    }

    // Horizontal movement
    const speed = 200;
    if (cursors.left.isDown) {
      body.setVelocityX(-speed);
      this._facingRight = false;
      this.sprite.setFlipX(true);
    } else if (cursors.right.isDown) {
      body.setVelocityX(speed);
      this._facingRight = true;
      this.sprite.setFlipX(false);
    } else {
      body.setVelocityX(0);
    }

    // Jump — detect rising edge on any of the raw Phaser Keys
    const k = cursors._keys;
    if (k && (Phaser.Input.Keyboard.JustDown(k.up) ||
              Phaser.Input.Keyboard.JustDown(k.w) ||
              Phaser.Input.Keyboard.JustDown(k.space))) {
      this._jumpBuffer = this._jumpBufferGrace;
    }
    this._jumpBuffer = Math.max(0, this._jumpBuffer - delta);

    if (this._jumpBuffer > 0 && this._coyoteTime > 0) {
      body.setVelocityY(-420);
      this._coyoteTime = 0;
      this._jumpBuffer = 0;
    }

    // Small idle bob when grounded
    if (onGround && body.velocity.x === 0) {
      this.sprite.setScale(1, 1);
    }

    // Update player light position
    if (this.playerLight) {
      this.playerLight.x = this.sprite.x;
      this.playerLight.y = this.sprite.y - 5;
    }
  }

  // Called from UIScene / touch controls
  setMoveLeft(active) {
    this._touchLeft = active;
  }
  setMoveRight(active) {
    this._touchRight = active;
  }
  doJump() {
    this._jumpBuffer = this._jumpBufferGrace;
  }
}
