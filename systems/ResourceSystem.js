export class ResourceSystem {
    constructor(world) {
        this.world = world;
        this.resources = [];
        this.resourceTypes = {
            arvore: {
                name: 'Árvore',
                color: '#2a5a2a',
                hits: 3,
                drops: { madeira: { min: 3, max: 5 } }
            },
            rocha: {
                name: 'Rocha',
                color: '#7a7a7a',
                hits: 4,
                drops: { pedra: { min: 2, max: 4 } }
            },
            arbustoVerde: {
                name: 'Arbusto',
                color: '#7a9a7a',
                hits: 1,
                drops: { fibra: { min: 1, max: 3 } }
            },
            arbustoVermelho: {
                name: 'Fruteira',
                color: '#ff6b6b',
                hits: 1,
                drops: { fruta: { min: 1, max: 2 } }
            }
        };
        
        this.generateResources();
    }
    
    generateResources() {
        // Gera MENOS recursos para melhor performance
        for (let i = 0; i < 50; i++) { // Reduzido de 100 para 50
            const x = Math.random() * 1900;
            const y = Math.random() * 1900;
            const biome = this.world.getBiomeAt(x, y);
            
            let type;
            if (biome) {
                if (biome.color === '#2a5a2a') { // Floresta
                    type = 'arvore';
                } else if (biome.color === '#5a5a5a') { // Montanha
                    type = 'rocha';
                } else { // Campo
                    type = Math.random() < 0.5 ? 'arbustoVerde' : 'arbustoVermelho';
                }
            } else {
                type = 'arbustoVerde';
            }
            
            this.resources.push({
                type,
                x, y,
                width: 32,
                height: 32,
                hitsRemaining: this.resourceTypes[type].hits
            });
        }
    }
    
    hitResource(worldX, worldY) {
        // Encontra recurso próximo ao clique
        for (const resource of this.resources) {
            if (worldX >= resource.x && worldX < resource.x + resource.width &&
                worldY >= resource.y && worldY < resource.y + resource.height) {
                
                resource.hitsRemaining--;
                
                if (resource.hitsRemaining <= 0) {
                    // Recurso destruído - drops
                    this.spawnDrops(resource);
                    
                    // Remove recurso
                    const index = this.resources.indexOf(resource);
                    this.resources.splice(index, 1);
                    
                    // Chance de spawnar novo recurso
                    if (Math.random() < 0.3) {
                        setTimeout(() => this.respawnResource(resource), 5000);
                    }
                }
                
                return resource;
            }
        }
        
        return null;
    }
    
    spawnDrops(resource) {
        const resourceDef = this.resourceTypes[resource.type];
        for (const [itemType, range] of Object.entries(resourceDef.drops)) {
            const quantity = Math.floor(Math.random() * (range.max - range.min + 1)) + range.min;
            
            // Encontra o sistema de inventário (via evento global)
            const event = new CustomEvent('resourceCollected', {
                detail: { type: itemType, quantity }
            });
            window.dispatchEvent(event);
        }
    }
    
    respawnResource(oldResource) {
        this.resources.push({
            ...oldResource,
            hitsRemaining: this.resourceTypes[oldResource.type].hits
        });
    }
    
    render(ctx, camera) {
        // Só renderiza recursos que estão na área visível da câmera
        const visibleResources = this.resources.filter(resource => {
            return resource.x + resource.width > camera.x &&
                   resource.x < camera.x + camera.width &&
                   resource.y + resource.height > camera.y &&
                   resource.y < camera.y + camera.height;
        });
        
        for (const resource of visibleResources) {
            const type = this.resourceTypes[resource.type];
            
            // Desenha recurso
            ctx.fillStyle = type.color;
            ctx.fillRect(resource.x, resource.y, resource.width, resource.height);
            
            // Desenha borda para destacar
            ctx.strokeStyle = '#000000';
            ctx.lineWidth = 1;
            ctx.strokeRect(resource.x, resource.y, resource.width, resource.height);
            
            // Desenha "vida" restante
            ctx.fillStyle = '#ffffff';
            ctx.font = '12px Arial';
            ctx.fillText('❤️'.repeat(resource.hitsRemaining), resource.x, resource.y - 5);
        }
    }
}