import { Game } from './game/Game.js';

// Inicializa o jogo quando a página carregar
window.addEventListener('load', () => {
    const canvas = document.getElementById('gameCanvas');
    const game = new Game(canvas);
    
    // Expõe o jogo globalmente para debug (opcional)
    window.game = game;
    
    console.log('Jogo inicializado! Use WASD para mover, clique para atacar');
});