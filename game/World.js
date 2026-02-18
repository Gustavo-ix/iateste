export class World {
    constructor(width, height) {
        this.width = width;
        this.height = height;
        
        // Gera biomas (simplificado - apenas cores diferentes)
        this.biomes = [];
        this.generateBiomes();
    }
    
    generateBiomes() {
        // Gera biomas em grid de 100x100
        for (let y = 0; y < this.height; y += 100) {
            for (let x = 0; x < this.width; x += 100) {
                // Simula biomas diferentes
                const biomeType = Math.random();
                let color;
                
                if (biomeType < 0.5) {
                    color = '#2a5a2a'; // Floresta (verde escuro)
                } else if (biomeType < 0.8) {
                    color = '#5a5a5a'; // Montanha (cinza)
                } else {
                    color = '#7a9a7a'; // Campo (verde claro)
                }
                
                this.biomes.push({
                    x, y,
                    width: 100,
                    height: 100,
                    color
                });
            }
        }
    }
    
    render(ctx, camera) {
        // Calcula quais biomas estão visíveis
        const startX = Math.max(0, Math.floor(camera.x / 100) * 100);
        const startY = Math.max(0, Math.floor(camera.y / 100) * 100);
        const endX = Math.min(this.width, startX + camera.width + 200);
        const endY = Math.min(this.height, startY + camera.height + 200);
        
        // Desenha um fundo uniforme primeiro
        ctx.fillStyle = '#2a5a2a';
        ctx.fillRect(startX, startY, endX - startX, endY - startY);
        
        // Desenha biomas visíveis
        for (const biome of this.biomes) {
            if (biome.x + biome.width > startX && biome.x < endX &&
                biome.y + biome.height > startY && biome.y < endY) {
                ctx.fillStyle = biome.color;
                ctx.fillRect(biome.x, biome.y, biome.width, biome.height);
                
                // Desenha grade (opcional - comentar se quiser mais performance)
                // ctx.strokeStyle = '#00000020';
                // ctx.lineWidth = 1;
                // ctx.strokeRect(biome.x, biome.y, biome.width, biome.height);
            }
        }
        
        // Desenha bordas do mundo
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 4;
        ctx.strokeRect(0, 0, this.width, this.height);
    }
    
    getBiomeAt(x, y) {
        // Otimizado: encontra o bioma baseado na posição do grid
        const gridX = Math.floor(x / 100) * 100;
        const gridY = Math.floor(y / 100) * 100;
        
        for (const biome of this.biomes) {
            if (biome.x === gridX && biome.y === gridY) {
                return biome;
            }
        }
        return null;
    }
}