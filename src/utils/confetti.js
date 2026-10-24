// confetti.js - Pure Canvas confetti celebration engine
export class CuteConfetti {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.particles = [];
    this.animationFrame = null;
    this.colors = [
      '#FF7675', '#74B9FF', '#A29BFE', '#55EFC4', 
      '#FFEAA7', '#FD79A8', '#FDCB6E', '#00CEC9',
      '#FAB1A0', '#E84393', '#6C5CE7', '#81ECEC'
    ];
  }

  ensureCanvas() {
    if (!this.canvas) {
      this.canvas = document.createElement('canvas');
      this.canvas.id = 'confetti-canvas';
      this.canvas.style.position = 'fixed';
      this.canvas.style.top = '0';
      this.canvas.style.left = '0';
      this.canvas.style.width = '100vw';
      this.canvas.style.height = '100vh';
      this.canvas.style.pointerEvents = 'none';
      this.canvas.style.zIndex = '9999';
      document.body.appendChild(this.canvas);
      this.ctx = this.canvas.getContext('2d');

      const resize = () => {
        if (this.canvas) {
          this.canvas.width = window.innerWidth * window.devicePixelRatio;
          this.canvas.height = window.innerHeight * window.devicePixelRatio;
        }
      };
      window.addEventListener('resize', resize);
      resize();
    }
  }

  burst(x = window.innerWidth / 2, y = window.innerHeight * 0.4, count = 100) {
    this.ensureCanvas();
    const dpr = window.devicePixelRatio || 1;
    const originX = x * dpr;
    const originY = y * dpr;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 12 + 4;
      const type = Math.random() > 0.4 ? 'star' : (Math.random() > 0.5 ? 'circle' : 'ribbon');

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed + (Math.random() - 0.5) * 3,
        vy: Math.sin(angle) * speed - Math.random() * 6 - 2,
        size: (Math.random() * 8 + 6) * dpr,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 12,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
        decay: Math.random() * 0.015 + 0.008,
        gravity: 0.28 * dpr,
        friction: 0.98,
        type: type
      });
    }

    if (!this.animationFrame) {
      this.animate();
    }
  }

  sparkle(x, y, count = 18) {
    this.ensureCanvas();
    const dpr = window.devicePixelRatio || 1;
    const originX = (x || window.innerWidth / 2) * dpr;
    const originY = (y || window.innerHeight / 2) * dpr;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 6 + 2;

      this.particles.push({
        x: originX,
        y: originY,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: (Math.random() * 5 + 4) * dpr,
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 15,
        color: this.colors[Math.floor(Math.random() * this.colors.length)],
        alpha: 1,
        decay: 0.035 + Math.random() * 0.02,
        gravity: 0.12 * dpr,
        friction: 0.96,
        type: 'star'
      });
    }

    if (!this.animationFrame) {
      this.animate();
    }
  }

  animate() {
    if (!this.ctx || this.particles.length === 0) {
      if (this.ctx && this.canvas) {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
      }
      this.animationFrame = null;
      return;
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];

      p.x += p.vx;
      p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= p.friction;
      p.vy *= p.friction;
      p.rotation += p.rotationSpeed;
      p.alpha -= p.decay;

      if (p.alpha <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = Math.max(0, p.alpha);
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.type === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else if (p.type === 'star') {
        const r = p.size;
        this.ctx.beginPath();
        for (let s = 0; s < 5; s++) {
          this.ctx.lineTo(Math.cos(((18 + s * 72) * Math.PI) / 180) * r, -Math.sin(((18 + s * 72) * Math.PI) / 180) * r);
          this.ctx.lineTo(Math.cos(((54 + s * 72) * Math.PI) / 180) * (r * 0.45), -Math.sin(((54 + s * 72) * Math.PI) / 180) * (r * 0.45));
        }
        this.ctx.closePath();
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
      }

      this.ctx.restore();
    }

    this.animationFrame = requestAnimationFrame(() => this.animate());
  }
}

export const cuteConfetti = new CuteConfetti();
