import Phaser from 'phaser';
import { DIALOGUE } from '../data/dialogueData.js';

export class TitleScene extends Phaser.Scene {
  constructor() {
    super('TitleScene');
  }

  create() {
    const W = this.scale.width;
    const H = this.scale.height;

    // Night sky background
    const sky = this.add.graphics();
    sky.fillGradientStyle(0x040408, 0x040408, 0x0a0a1e, 0x0a0a1e, 1);
    sky.fillRect(0, 0, W, H);

    // Stars
    for (let i = 0; i < 80; i++) {
      const sx = Phaser.Math.Between(0, W);
      const sy = Phaser.Math.Between(0, H * 0.7);
      const sz = Math.random() * 1.5 + 0.5;
      const star = this.add.graphics();
      star.fillStyle(0xffffff, Math.random() * 0.6 + 0.3);
      star.fillCircle(sx, sy, sz);
      // Twinkle
      this.tweens.add({
        targets: star,
        alpha: Math.random() * 0.3 + 0.1,
        duration: Phaser.Math.Between(800, 2500),
        yoyo: true,
        repeat: -1,
        delay: Phaser.Math.Between(0, 1500),
      });
    }

    // Mountain silhouettes
    const mtn = this.add.graphics();
    mtn.fillStyle(0x0d0d1a, 1);
    // Far mountain
    mtn.fillTriangle(0, H, W * 0.35, H * 0.25, W * 0.7, H);
    mtn.fillTriangle(W * 0.4, H, W * 0.75, H * 0.2, W + 20, H);
    // Near mountain / treeline
    mtn.fillStyle(0x080f06, 1);
    mtn.fillRect(0, H * 0.72, W, H * 0.28);
    // Silhouette tree row
    mtn.fillStyle(0x06110a, 1);
    for (let tx = 0; tx < W + 20; tx += 18) {
      const th = Phaser.Math.Between(20, 40);
      mtn.fillTriangle(tx, H * 0.72, tx + 9, H * 0.72 - th, tx + 18, H * 0.72);
    }

    // Campfire glow
    const glow = this.add.graphics();
    glow.fillStyle(0xff6600, 0.08);
    glow.fillCircle(W * 0.5, H * 0.78, 60);

    // Logo / Title
    const titleSub = this.add.text(W / 2, H * 0.32, 'VERLORENE NACHT', {
      fontFamily: 'monospace',
      fontSize: '22px',
      color: '#e8e0c0',
      letterSpacing: 4,
      resolution: 2,
    }).setOrigin(0.5).setAlpha(0);

    const titleEn = this.add.text(W / 2, H * 0.45, '/ LOST NIGHT', {
      fontFamily: 'monospace',
      fontSize: '10px',
      color: '#8080a0',
      letterSpacing: 3,
      resolution: 2,
    }).setOrigin(0.5).setAlpha(0);

    const tagline = this.add.text(W / 2, H * 0.58, 'A camping weekend in Südtirol.\nSomething is wrong in the Lärchwald.', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#606080',
      align: 'center',
      lineSpacing: 5,
      resolution: 2,
    }).setOrigin(0.5).setAlpha(0);

    const startPrompt = this.add.text(W / 2, H * 0.82, '[ tap / press any key to begin ]', {
      fontFamily: 'monospace',
      fontSize: '7px',
      color: '#505060',
      resolution: 2,
    }).setOrigin(0.5).setAlpha(0);

    // Animate in
    this.tweens.add({
      targets: titleSub,
      alpha: 1,
      duration: 1200,
      delay: 400,
      ease: 'Sine.easeOut',
    });
    this.tweens.add({
      targets: titleEn,
      alpha: 0.8,
      duration: 1000,
      delay: 900,
      ease: 'Sine.easeOut',
    });
    this.tweens.add({
      targets: tagline,
      alpha: 1,
      duration: 1000,
      delay: 1500,
      ease: 'Sine.easeOut',
    });
    this.tweens.add({
      targets: startPrompt,
      alpha: 1,
      duration: 800,
      delay: 2200,
      ease: 'Sine.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: startPrompt,
          alpha: 0.3,
          duration: 900,
          yoyo: true,
          repeat: -1,
        });
      },
    });

    // Tiny version/credit
    this.add.text(W - 4, H - 6, 'DEMO v0.1', {
      fontFamily: 'monospace',
      fontSize: '5px',
      color: '#222233',
      resolution: 2,
    }).setOrigin(1, 1);

    // Input to start
    this._ready = false;
    this.time.delayedCall(2400, () => { this._ready = true; });

    this.input.once('pointerdown', () => this._startGame());
    this.input.keyboard.once('keydown', () => this._startGame());
  }

  _startGame() {
    if (!this._ready) return;
    this._showIntroCards();
  }

  _showIntroCards() {
    const W = this.scale.width;
    const H = this.scale.height;
    const cards = DIALOGUE.INTRO_CARDS;

    if (this._introStarted) return;
    this._introStarted = true;

    // Black overlay we fully control — avoids fragile camera fade/flash state
    const overlay = this.add.rectangle(0, 0, W, H, 0x030308)
      .setOrigin(0, 0)
      .setDepth(500)
      .setAlpha(0);

    const cardText = this.add.text(W / 2, H / 2, '', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#c8c8b0',
      align: 'center',
      wordWrap: { width: W - 60 },
      lineSpacing: 6,
      resolution: 2,
    }).setOrigin(0.5).setDepth(501).setAlpha(0);

    const showCard = (i) => {
      if (i >= cards.length) {
        this.tweens.add({
          targets: cardText,
          alpha: 0,
          duration: 400,
          onComplete: () => this._launchGame(),
        });
        return;
      }
      const card = cards[i];
      cardText.setAlpha(0).setText(card.text);
      this.tweens.add({
        targets: cardText,
        alpha: 1,
        duration: 600,
        ease: 'Sine.easeOut',
        onComplete: () => {
          this.time.delayedCall(card.pause || 2000, () => {
            this.tweens.add({
              targets: cardText,
              alpha: 0,
              duration: 500,
              onComplete: () => showCard(i + 1),
            });
          });
        },
      });
    };

    // Fade the black overlay in over the title, then play the cards
    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 500,
      ease: 'Sine.easeIn',
      onComplete: () => showCard(0),
    });
  }

  _launchGame() {
    this.scene.start('WorldScene');
    this.scene.start('UIScene');
    this.scene.stop('TitleScene');
  }
}
