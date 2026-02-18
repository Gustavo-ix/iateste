export class HealthSystem {
    constructor(game) {
        this.game = game;
        this.maxHealth = 100;
        this.health = 100;
        this.visibleTimer = 0;
        this.visibleDuration = 3; // segundos
        
        // Perda de vida automática
        this.damageTimer = 0;
        this.damageInterval = 30; // segundos
    }
    
    update(deltaTime) {
        // Atualiza timer de visibilidade
        if (this.visibleTimer > 0) {
            this.visibleTimer -= deltaTime;
            if (this.visibleTimer <= 0) {
                this.hideBar();
            }
        }
        
        // Perda automática de vida
        this.damageTimer += deltaTime;
        while (this.damageTimer >= this.damageInterval) {
            this.damageTimer -= this.damageInterval;
            this.takeDamage(1);
        }
    }
    
    takeDamage(amount) {
        this.health = Math.max(0, this.health - amount);
        this.showBar();
        
        // Atualiza UI
        this.updateBar();
        
        console.log(`Vida: ${this.health}/${this.maxHealth}`);
    }
    
    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.showBar();
        this.updateBar();
    }
    
    showBar() {
        this.visibleTimer = this.visibleDuration;
        const barContainer = document.getElementById('health-bar-container');
        if (barContainer) {
            barContainer.classList.remove('hidden');
        }
    }
    
    hideBar() {
        const barContainer = document.getElementById('health-bar-container');
        if (barContainer) {
            barContainer.classList.add('hidden');
        }
    }
    
    updateBar() {
        const percent = (this.health / this.maxHealth) * 100;
        const bar = document.getElementById('health-bar');
        const text = document.getElementById('health-text');
        
        if (bar) {
            bar.style.width = `${percent}%`;
        }
        if (text) {
            text.textContent = `${this.health}/${this.maxHealth}`;
        }
    }
}