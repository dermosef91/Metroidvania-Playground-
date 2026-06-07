// Darkness system using RenderTexture + erase composite
// Registers light sources; redraws each frame

export class DarknessOverlay {
  constructor(scene) {
    this.scene = scene;
    this.lights = [];
    this.enabled = false;
    this.alpha = 0;

    const W = scene.scale.width;
    const H = scene.scale.height;

    // RenderTexture covering the viewport
    this.rt = scene.add.renderTexture(0, 0, W, H);
    this.rt.setScrollFactor(0);
    this.rt.setDepth(150);
    this.rt.setAlpha(0);

    // Graphics brush for erasing (drawing light circles)
    this.brush = scene.make.graphics({ x: 0, y: 0, add: false });
  }

  // Add a light source; returns an object you can mutate (.x, .y, .radius)
  addLight(x, y, radius, pulse = false) {
    const light = { x, y, radius, pulse, _baseRadius: radius, _time: Math.random() * Math.PI * 2 };
    this.lights.push(light);
    return light;
  }

  enable(duration = 1200) {
    this.enabled = true;
    this.scene.tweens.add({
      targets: this.rt,
      alpha: 0.97,
      duration,
      ease: 'Sine.easeIn',
    });
  }

  disable(duration = 800) {
    this.scene.tweens.add({
      targets: this.rt,
      alpha: 0,
      duration,
      ease: 'Sine.easeOut',
      onComplete: () => { this.enabled = false; },
    });
  }

  setLightRadius(light, radius, duration = 800) {
    this.scene.tweens.add({
      targets: light,
      radius,
      duration,
      ease: 'Sine.easeOut',
    });
  }

  update(cameraX, cameraY, delta) {
    if (!this.enabled && this.rt.alpha < 0.01) return;

    // Tick pulse timers
    for (const l of this.lights) {
      if (l.pulse) {
        l._time += delta * 0.002;
        l.radius = l._baseRadius + Math.sin(l._time) * (l._baseRadius * 0.1);
      }
    }

    const W = this.scene.scale.width;
    const H = this.scene.scale.height;

    // Fill with solid black
    this.rt.clear();
    this.rt.fill(0x000000, 1, 0, 0, W, H);

    // Erase circles for each light (convert world → screen)
    for (const l of this.lights) {
      const sx = l.x - cameraX;
      const sy = l.y - cameraY;

      // Gradient-ish: draw multiple concentric circles with decreasing opacity erasure
      // We use erase() which draws transparently into the RT
      const steps = 5;
      for (let i = steps; i >= 1; i--) {
        const r = l.radius * (i / steps);
        const a = 1 - (i / steps) * 0.7; // inner = more opaque erase
        this.brush.clear();
        this.brush.fillStyle(0xffffff, 1);
        this.brush.fillCircle(0, 0, r);
        this.rt.erase(this.brush, sx, sy);
      }

      // Solid center erase
      this.brush.clear();
      this.brush.fillStyle(0xffffff, 1);
      this.brush.fillCircle(0, 0, l.radius * 0.4);
      this.rt.erase(this.brush, sx, sy);
    }
  }

  destroy() {
    this.brush.destroy();
    this.rt.destroy();
  }
}
