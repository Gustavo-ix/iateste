export class Camera {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        this.x = 0;
        this.y = 0;
    }
    
    update(player) {
        // Centraliza câmera no jogador
        this.x = player.x + player.width/2 - this.width/2;
        this.y = player.y + player.height/2 - this.height/2;
        
        // Limita ao mundo
        this.x = Math.max(0, Math.min(2000 - this.width, this.x));
        this.y = Math.max(0, Math.min(2000 - this.height, this.y));
    }
}