// Dialogue box system — renders over game, drives typewriter effect

export class Dialogue {
  constructor(scene) {
    this.scene = scene;
    this.active = false;
    this.queue = [];
    this.currentIndex = 0;
    this.typeTimer = null;
    this.charIndex = 0;
    this.fullText = '';
    this.done = false;
    this.onComplete = null;

    this._buildUI();
    this._hide();
  }

  _buildUI() {
    const W = this.scene.scale.width;
    const H = this.scene.scale.height;
    const BOX_H = 72;
    const Y = H - BOX_H - 4;
    const PAD = 10;

    // Background panel
    this.bg = this.scene.add.graphics();
    this.bg.fillStyle(0x0a0a14, 0.92);
    this.bg.fillRoundedRect(4, Y, W - 8, BOX_H, 4);
    this.bg.lineStyle(1, 0x3a3a5c, 1);
    this.bg.strokeRoundedRect(4, Y, W - 8, BOX_H, 4);
    this.bg.setScrollFactor(0).setDepth(200);

    // Speaker label
    this.speakerLabel = this.scene.add.text(PAD + 4, Y + 6, '', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#aad4ff',
      resolution: 2,
    });
    this.speakerLabel.setScrollFactor(0).setDepth(201);

    // Main text
    this.textObj = this.scene.add.text(PAD + 4, Y + 18, '', {
      fontFamily: 'monospace',
      fontSize: '9px',
      color: '#e8e8d8',
      wordWrap: { width: W - PAD * 2 - 8 },
      lineSpacing: 3,
      resolution: 2,
    });
    this.textObj.setScrollFactor(0).setDepth(201);

    // Advance indicator
    this.indicator = this.scene.add.text(W - 16, Y + BOX_H - 14, '▶', {
      fontFamily: 'monospace',
      fontSize: '8px',
      color: '#aad4ff',
      resolution: 2,
    });
    this.indicator.setScrollFactor(0).setDepth(201);
    this.scene.tweens.add({
      targets: this.indicator,
      alpha: 0.2,
      duration: 500,
      yoyo: true,
      repeat: -1,
    });
  }

  _hide() {
    this.bg.setVisible(false);
    this.speakerLabel.setVisible(false);
    this.textObj.setVisible(false);
    this.indicator.setVisible(false);
  }

  _show() {
    this.bg.setVisible(true);
    this.speakerLabel.setVisible(true);
    this.textObj.setVisible(true);
    this.indicator.setVisible(false);
  }

  // pages: array of { text, speaker? } from dialogueData
  show(pages, onComplete) {
    if (this.active) return;
    this.active = true;
    this.queue = pages;
    this.currentIndex = 0;
    this.onComplete = onComplete || null;
    this._show();
    this._showPage(0);
    this.scene.game.events.emit('dialogue-open');
  }

  _showPage(idx) {
    if (idx >= this.queue.length) {
      this._finish();
      return;
    }
    const page = this.queue[idx];
    this.speakerLabel.setText(page.speaker ? page.speaker + ':' : '');
    this.fullText = page.text;
    this.charIndex = 0;
    this.done = false;
    this.textObj.setText('');
    this.indicator.setVisible(false);

    this.typeTimer = this.scene.time.addEvent({
      delay: 30,
      repeat: this.fullText.length - 1,
      callback: () => {
        this.charIndex++;
        this.textObj.setText(this.fullText.substring(0, this.charIndex));
        if (this.charIndex >= this.fullText.length) {
          this.done = true;
          this.indicator.setVisible(true);
        }
      },
    });
  }

  advance() {
    if (!this.active) return;
    if (!this.done) {
      // Skip to end of current page
      if (this.typeTimer) this.typeTimer.remove();
      this.charIndex = this.fullText.length;
      this.textObj.setText(this.fullText);
      this.done = true;
      this.indicator.setVisible(true);
      return;
    }
    this.currentIndex++;
    this._showPage(this.currentIndex);
  }

  _finish() {
    this.active = false;
    this._hide();
    this.scene.game.events.emit('dialogue-close');
    if (this.onComplete) this.onComplete();
  }

  isActive() {
    return this.active;
  }
}
