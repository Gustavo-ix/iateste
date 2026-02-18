import { Player } from './Player.js';
import { World } from './World.js';
import { Camera } from './Camera.js';
import { HealthSystem } from '../systems/HealthSystem.js';
import { InventorySystem } from '../systems/InventorySystem.js';
import { CraftingSystem } from '../systems/CraftingSystem.js';
import { ResourceSystem } from '../systems/ResourceSystem.js';
import { HUD } from '../ui/HUD.js';
import { InventoryUI } from '../ui/InventoryUI.js';

export class Game {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        // Configurações
        this.width = 1024;
        this.height = 768;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        
        // Estado do jogo
        this.isRunning = true;
        this.isPaused = false;
        this.lastTime = 0;
        this.gameTime = 0;
        
        // Inicializa sistemas
        this.world = new World(2000, 2000);
        this.player = new Player(1000, 1000);
        this.camera = new Camera(this.width, this.height);
        this.healthSystem = new HealthSystem(this);
        this.inventorySystem = new InventorySystem();
        this.craftingSystem = new CraftingSystem(this.inventorySystem);
        this.resourceSystem = new ResourceSystem(this.world);
        
        // Inicializa UI
        this.hud = new HUD(this);
        this.inventoryUI = new InventoryUI(this);
        
        // Configura controles
        this.setupControls();
        
        // Inicia o loop do jogo
        this.gameLoop();
    }
    
    setupControls() {
        // Teclado
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.togglePause();
            }
            if (e.key === 'i' || e.key === 'I') {
                this.inventoryUI.toggle();
            }
            if (e.key === 'c' || e.key === 'C') {
                this.toggleCraft();
            }
        });
        
        // Clique para atacar
        this.canvas.addEventListener('mousedown', (e) => {
            if (e.button !== 0) return; // Apenas clique esquerdo
            if (this.isPaused) return;
            
            const rect = this.canvas.getBoundingClientRect();
            const mouseX = e.clientX - rect.left;
            const mouseY = e.clientY - rect.top;
            
            // Converte coordenadas da tela para coordenadas do mundo
            const worldX = mouseX + this.camera.x;
            const worldY = mouseY + this.camera.y;
            
            this.player.attack(worldX, worldY, this.resourceSystem);
        });
    }
    
    togglePause() {
        this.isPaused = !this.isPaused;
        this.hud.updatePauseMenu();
    }
    
    toggleCraft() {
        document.getElementById('craft-panel').classList.toggle('hidden');
    }
    
    gameLoop(currentTime = 0) {
        if (!this.isRunning) return;
        
        const deltaTime = (currentTime - this.lastTime) / 1000; // segundos
        this.lastTime = currentTime;
        
        if (!this.isPaused) {
            this.gameTime += deltaTime;
            this.update(deltaTime);
        }
        
        this.render();
        
        requestAnimationFrame((time) => this.gameLoop(time));
    }
    
    update(deltaTime) {
        // Limita deltaTime para evitar problemas com tab inactive
        const safeDelta = Math.min(deltaTime, 0.1);
        
        // Atualiza sistemas
        this.player.update(safeDelta);
        this.camera.update(this.player);
        this.healthSystem.update(safeDelta);
        this.hud.updateTime(this.gameTime);
        
        // Verifica game over
        if (this.healthSystem.health <= 0) {
            this.gameOver();
        }
    }
    
    render() {
        // Limpa a tela COMPLETAMENTE
        this.ctx.clearRect(0, 0, this.width, this.height);
        
        // Desenha fundo preto primeiro (garantir que não fique sujeira)
        this.ctx.fillStyle = '#1a1a1a';
        this.ctx.fillRect(0, 0, this.width, this.height);
        
        // Renderiza mundo (apenas parte visível)
        this.world.render(this.ctx, this.camera);
        
        // Salva contexto
        this.ctx.save();
        
        // Aplica câmera
        this.ctx.translate(-this.camera.x, -this.camera.y);
        
        // Renderiza recursos (apenas visíveis)
        this.resourceSystem.render(this.ctx, this.camera);
        
        // Renderiza jogador
        this.player.render(this.ctx);
        
        // Restaura contexto
        this.ctx.restore();
        
        // Renderiza UI (não afetada pela câmera)
        this.hud.render(this.ctx);
    }
    
    gameOver() {
        this.isPaused = true;
        document.getElementById('game-over').classList.remove('hidden');
        
        // Reinicia ao clicar
        const gameOverScreen = document.getElementById('game-over');
        gameOverScreen.addEventListener('click', () => {
            location.reload();
        }, { once: true });
    }
}