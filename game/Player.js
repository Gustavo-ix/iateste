export class Player {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 32;
        this.height = 32;
        this.speed = 200; // pixels por segundo
        
        // Ataque
        this.attackCooldown = 0;
        this.attackRate = 0.4; // segundos
        this.attackRange = 50;
        
        // Controles
        this.keys = {
            w: false,
            a: false,
            s: false,
            d: false
        };
        
        this.setupControls();
    }
    
    setupControls() {
        window.addEventListener('keydown', (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) {
                this.keys[key] = true;
                e.preventDefault();
            }
        });
        
        window.addEventListener('keyup', (e) => {
            const key = e.key.toLowerCase();
            if (key in this.keys) {
                this.keys[key] = false;
                e.preventDefault();
            }
        });
    }
    
    update(deltaTime) {
        // Movimento
        let dx = 0;
        let dy = 0;
        
        if (this.keys.w) dy -= 1;
        if (this.keys.s) dy += 1;
        if (this.keys.a) dx -= 1;
        if (this.keys.d) dx += 1;
        
        if (dx !== 0 || dy !== 0) {
            const length = Math.sqrt(dx * dx + dy * dy);
            dx = dx / length * this.speed * deltaTime;
            dy = dy / length * this.speed * deltaTime;
            
            this.x += dx;
            this.y += dy;
            
            // Mantém dentro do mundo
            this.x = Math.max(0, Math.min(2000 - this.width, this.x));
            this.y = Math.max(0, Math.min(2000 - this.height, this.y));
        }
        
        // Cooldown do ataque
        if (this.attackCooldown > 0) {
            this.attackCooldown -= deltaTime;
        }
    }
    
    attack(targetX, targetY, resourceSystem) {
        if (this.attackCooldown > 0) return false;
        
        // Verifica distância
        const dx = targetX - (this.x + this.width/2);
        const dy = targetY - (this.y + this.height/2);
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance <= this.attackRange) {
            // Tenta coletar recurso
            const resource = resourceSystem.hitResource(targetX, targetY);
            if (resource) {
                this.attackCooldown = this.attackRate;
                return true;
            }
        }
        
        return false;
    }
    
    render(ctx) {
        // Jogador (quadrado azul)
        ctx.fillStyle = '#4287f5';
        ctx.fillRect(this.x, this.y, this.width, this.height);
        
        // Olhos (para dar direção)
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(this.x + 8, this.y + 8, 6, 6);
        ctx.fillRect(this.x + 18, this.y + 8, 6, 6);
        
        // Área de ataque (debug)
        if (this.attackCooldown > 0) {
            ctx.strokeStyle = '#ff0000';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(this.x + this.width/2, this.y + this.height/2, this.attackRange, 0, Math.PI * 2);
            ctx.stroke();
        }
    }
}