// Interactive Fluid Simulation with Gradient Colors (Fixed for Touch Scrolling)
class FluidSimulation {
    constructor(container) {
        this.container = container;
        this.blobs = [];
        this.pointer = { x: 0, y: 0, active: false };
        this.colorPalette = [
            ['#FF9AA2', '#FFB7B2'], // Pink
            ['#FFDAC1', '#E2F0CB'], // Peach/Light Green
            ['#B5EAD7', '#C7CEEA'], // Mint/Lavender
            ['#F8B195', '#F67280'], // Coral
            ['#6C5B7B', '#C06C84'], // Purple
            ['#355C7D', '#6C5B7B']  // Blue/Purple
        ];
        this.isScrolling = false;
        this.touchStartY = 0.5;
        this.resizeObserver = new ResizeObserver(() => this.handleResize());
        this.init();
    }
    
    init() {
        this.createCanvas();
        this.setupEvents();
        this.resizeObserver.observe(this.container);
        this.animate();
    }
    
    createCanvas() {
        this.canvas = document.createElement('canvas');
        this.canvas.style.position = 'absolute';
        this.canvas.style.top = '0';
        this.canvas.style.left = '0';
        this.canvas.style.width = '100%';
        this.canvas.style.height = '100%';
        this.canvas.style.zIndex = '3';
        this.canvas.style.mixBlendMode = 'multiply';
        this.container.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.handleResize();
    }
    
    handleResize() {
        const rect = this.container.getBoundingClientRect();
        this.width = this.canvas.width = rect.width;
        this.height = this.canvas.height = rect.height;
    }
    
    setupEvents() {
        // Mouse events
        this.container.addEventListener('mousemove', (e) => {
            const rect = this.container.getBoundingClientRect();
            this.pointer.x = e.clientX - rect.left;
            this.pointer.y = e.clientY - rect.top;
            this.pointer.active = true;
            this.createBlob(this.pointer.x, this.pointer.y);
        });
        
        this.container.addEventListener('mouseleave', () => {
            this.pointer.active = false;
        });
        
        // Touch events with scroll detection
        this.container.addEventListener('touchstart', (e) => {
            this.isScrolling = false;
            this.touchStartY = e.touches[0].clientY;
        }, { passive: true });
        
        this.container.addEventListener('touchmove', (e) => {
            // Check if this is primarily vertical movement (scrolling)
            const y = e.touches[0].clientY;
            if (Math.abs(y - this.touchStartY) > 5) {
                this.isScrolling = true;
                return;
            }
            
            if (!this.isScrolling) {
                e.preventDefault();
                const rect = this.container.getBoundingClientRect();
                this.pointer.x = e.touches[0].clientX - rect.left;
                this.pointer.y = e.touches[0].clientY - rect.top;
                this.pointer.active = true;
                this.createBlob(this.pointer.x, this.pointer.y);
            }
        }, { passive: false });
        
        this.container.addEventListener('touchend', () => {
            this.pointer.active = false;
            this.isScrolling = false;
        });
    }
    
    createBlob(x, y) {
        // Limit number of blobs
        if (this.blobs.length > 12) {
            this.blobs.shift();
        }
        
        const size = 50 + Math.random() * 300;
        const colors = this.colorPalette[Math.floor(Math.random() * this.colorPalette.length)];
        
        const blob = {
            x,
            y,
            size,
            life: 100,
            speedX: (Math.random() - 0.5) * 32,
            speedY: (Math.random() - 0.5) * 32,
            angle: Math.random() * Math.PI * 2,
            rotationSpeed: (Math.random() - 0.5) * 0.02,
            colors
        };
        
        this.blobs.push(blob);
        return blob;
    }
    
    updateBlobs() {
        for (let i = this.blobs.length - 1; i >= 0; i--) {
            const blob = this.blobs[i];
            
            // Update position
            blob.x += blob.speedX;
            blob.y += blob.speedY;
            
            // Apply boundary
            if (blob.x < 0 || blob.x > this.width || 
                blob.y < 0 || blob.y > this.height) {
                blob.life -= 2;
            }
            
            // Update rotation
            blob.angle += blob.rotationSpeed;
            
            // Decay
            blob.life -= 0.5;
            blob.size *= 0.995;
            
            // Remove dead blobs
            if (blob.life <= 0 || blob.size < 5) {
                this.blobs.splice(i, 1);
            }
        }
        
        // Add random blobs occasionally
        if (Math.random() < 0.03 && this.blobs.length < 8) {
            this.createBlob(
                Math.random() * this.width,
                Math.random() * this.height
            );
        }
    }
    
    drawBlobs() {
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        for (const blob of this.blobs) {
            const lifeRatio = blob.life / 100;
            
            this.ctx.save();
            this.ctx.translate(blob.x, blob.y);
            this.ctx.rotate(blob.angle);
            
            // Create organic shape
            this.ctx.beginPath();
            this.ctx.moveTo(0, -blob.size * 0.6);
            
            // Bezier curves for organic shape
            this.ctx.bezierCurveTo(
                blob.size * 0.5, -blob.size * 0.8,
                blob.size * 0.8, 0,
                blob.size * 0.3, blob.size * 0.6
            );
            this.ctx.bezierCurveTo(
                0, blob.size * 0.9,
                -blob.size * 0.3, blob.size * 0.6,
                -blob.size * 0.8, 0
            );
            this.ctx.bezierCurveTo(
                -blob.size * 0.5, -blob.size * 0.8,
                0, -blob.size * 0.6,
                0, -blob.size * 0.6
            );
            
            this.ctx.closePath();
            
            // Gradient fill
            const gradient = this.ctx.createRadialGradient(
                0, 0, blob.size * 0.3,
                0, 0, blob.size
            );
            gradient.addColorStop(0, `${blob.colors[0]}${Math.round(0.7 * lifeRatio * 255).toString(16).padStart(2, '0')}`);
            gradient.addColorStop(1, `${blob.colors[1]}${Math.round(0.3 * lifeRatio * 255).toString(16).padStart(2, '0')}`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.filter = `blur(${blob.size * 0.2}px)`;
            this.ctx.fill();
            
            this.ctx.restore();
        }
    }
    
    animate() {
        this.updateBlobs();
        this.drawBlobs();
        requestAnimationFrame(() => this.animate());
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new FluidSimulation(document.getElementById('fluid-header'));
});