export class Item {
  constructor(scene, data) {
    this.scene = scene;
    this.id = data.id;
    this.ability = data.ability;
    this.dialogue = data.dialogue;
    this.collected = false;

    this.sprite = scene.physics.add.staticSprite(data.x, data.y, data.type || 'item_headlamp');
    this.sprite.setDepth(9);
    this.sprite.refreshBody();

    // Glow pulse tween
    scene.tweens.add({
      targets: this.sprite,
      y: data.y - 6,
      duration: 800,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
    scene.tweens.add({
      targets: this.sprite,
      alpha: 0.6,
      duration: 600,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Interact radius indicator (subtle ring)
    this.ring = scene.add.graphics();
    this.ring.lineStyle(1, 0xffdd44, 0.25);
    this.ring.strokeCircle(data.x, data.y, 18);
    this.ring.setDepth(8);
  }

  update(playerX, playerY) {
    if (this.collected) return;
    return Phaser.Math.Distance.Between(playerX, playerY, this.sprite.x, this.sprite.y) < 65;
  }

  collect() {
    if (this.collected) return;
    this.collected = true;

    this.scene.tweens.add({
      targets: this.sprite,
      y: this.sprite.y - 20,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 400,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.sprite.destroy();
        this.ring.destroy();
      },
    });
  }
}
