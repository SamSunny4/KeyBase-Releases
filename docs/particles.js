// Beautiful Particle Flow Animation
class ParticleFlow {
  constructor() {
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'particle-canvas';
    this.ctx = this.canvas.getContext('2d');
    this.particles = [];
    this.mouseX = 0;
    this.mouseY = 0;
    
    this.init();
  }
  
  init() {
    // Insert canvas at the beginning of body
    document.body.insertBefore(this.canvas, document.body.firstChild);
    
    // Set canvas size
    this.resize();
    window.addEventListener('resize', () => this.resize());
    
    // Track mouse movement
    document.addEventListener('mousemove', (e) => {
      this.mouseX = e.clientX;
      this.mouseY = e.clientY;
    });
    
    // Create particles
    this.createParticles();
    
    // Start animation
    this.animate();
  }
  
  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = document.documentElement.scrollHeight;
  }
  
  createParticles() {
    const particleCount = Math.min(80, Math.floor((window.innerWidth * window.innerHeight) / 15000));
    
    for (let i = 0; i < particleCount; i++) {
      this.particles.push({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        radius: Math.random() * 2 + 1,
        opacity: Math.random() * 0.5 + 0.2,
        hue: Math.random() * 60 + 170 // Cyan/Blue range
      });
    }
  }
  
  animate() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Update and draw particles
    this.particles.forEach((particle, i) => {
      // Update position
      particle.x += particle.vx;
      particle.y += particle.vy;
      
      // Mouse interaction - subtle attraction
      const dx = this.mouseX - particle.x;
      const dy = this.mouseY - particle.y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      
      if (dist < 150) {
        const force = (150 - dist) / 150 * 0.02;
        particle.vx += dx / dist * force;
        particle.vy += dy / dist * force;
      }
      
      // Velocity damping
      particle.vx *= 0.99;
      particle.vy *= 0.99;
      
      // Add subtle random movement
      particle.vx += (Math.random() - 0.5) * 0.05;
      particle.vy += (Math.random() - 0.5) * 0.05;
      
      // Limit velocity
      const speed = Math.sqrt(particle.vx ** 2 + particle.vy ** 2);
      if (speed > 2) {
        particle.vx = (particle.vx / speed) * 2;
        particle.vy = (particle.vy / speed) * 2;
      }
      
      // Wrap around edges
      if (particle.x < 0) particle.x = this.canvas.width;
      if (particle.x > this.canvas.width) particle.x = 0;
      if (particle.y < 0) particle.y = this.canvas.height;
      if (particle.y > this.canvas.height) particle.y = 0;
      
      // Draw particle
      this.ctx.beginPath();
      this.ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
      this.ctx.fillStyle = `hsla(${particle.hue}, 70%, 60%, ${particle.opacity})`;
      this.ctx.fill();
      
      // Draw connections
      for (let j = i + 1; j < this.particles.length; j++) {
        const other = this.particles[j];
        const dx = particle.x - other.x;
        const dy = particle.y - other.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < 120) {
          this.ctx.beginPath();
          this.ctx.moveTo(particle.x, particle.y);
          this.ctx.lineTo(other.x, other.y);
          const opacity = (1 - distance / 120) * 0.15;
          this.ctx.strokeStyle = `hsla(${particle.hue}, 70%, 60%, ${opacity})`;
          this.ctx.lineWidth = 0.5;
          this.ctx.stroke();
        }
      }
    });
    
    requestAnimationFrame(() => this.animate());
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => new ParticleFlow());
} else {
  new ParticleFlow();
}
