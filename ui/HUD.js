export class HUD {
    constructor(game) {
        this.game = game;
        this.timeElement = document.getElementById('game-time');
    }
    
    updateTime(gameTime) {
        const minutes = Math.floor(gameTime / 60);
        const seconds = Math.floor(gameTime % 60);
        this.timeElement.textContent = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }
    
    updatePauseMenu() {
        const pauseMenu = document.getElementById('pause-menu');
        if (this.game.isPaused) {
            pauseMenu.classList.remove('hidden');
        } else {
            pauseMenu.classList.add('hidden');
        }
    }
    
    render(ctx) {
        // Hotkeys hint
        ctx.fillStyle = '#ffffff';
        ctx.font = '14px Arial';
        ctx.fillText('I: Inventário | C: Craft | ESC: Pausa', 10, 50);
        ctx.fillText('1-5: Atalhos rápidos', 10, 70);
    }
}