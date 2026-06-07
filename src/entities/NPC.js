export class NPC {
  constructor(scene, data) {
    this.scene = scene;
    this.id = data.id;
    this.dialogueFirst = data.dialogueFirst;
    this.dialogueRepeat = data.dialogueRepeat;
    this._talked = false;

    this.sprite = scene.physics.add.staticSprite(data.x, data.y, data.type || 'npc_lucas');
    this.sprite.setDepth(9);
    this.sprite.refreshBody();

    // Indicator "!" bubble above NPC
    this.bubble = scene.add.text(data.x, data.y - 22, '!', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#ffdd44',
      resolution: 2,
    }).setOrigin(0.5).setDepth(12).setVisible(false);

    // Gentle bob tween
    scene.tweens.add({
      targets: this.sprite,
      y: data.y - 3,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    scene.tweens.add({
      targets: this.bubble,
      y: (data.y - 22) - 3,
      duration: 900,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  update(playerX, playerY) {
    const dist = Phaser.Math.Distance.Between(playerX, playerY, this.sprite.x, this.sprite.y);
    this.bubble.setVisible(dist < 65);
  }

  get x() { return this.sprite.x; }
  get y() { return this.sprite.y; }

  getDialogue() {
    const key = this._talked ? this.dialogueRepeat : this.dialogueFirst;
    this._talked = true;
    return key;
  }
}
