export class CraftingSystem {
    constructor(inventorySystem) {
        this.inventory = inventorySystem;
        this.recipes = {
            lenhador: {
                name: 'Lenhador',
                ingredients: { madeira: 3, fibra: 2 },
                result: 'lenhador'
            },
            mineiro: {
                name: 'Mineiro',
                ingredients: { madeira: 2, pedra: 3 },
                result: 'mineiro'
            },
            pocao: {
                name: 'Poção',
                ingredients: { fruta: 3 },
                result: 'pocao'
            }
        };
        
        this.setupUI();
    }
    
    setupUI() {
        document.querySelectorAll('.craft-recipe').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const recipe = e.currentTarget.dataset.recipe;
                this.craft(recipe);
            });
        });
    }
    
    craft(recipeId) {
        const recipe = this.recipes[recipeId];
        if (!recipe) return false;
        
        // Verifica ingredientes
        for (const [item, amount] of Object.entries(recipe.ingredients)) {
            if (!this.inventory.hasItem(item, amount)) {
                alert(`Falta ${item}!`);
                return false;
            }
        }
        
        // Consome ingredientes
        for (const [item, amount] of Object.entries(recipe.ingredients)) {
            this.inventory.removeItem(item, amount);
        }
        
        // Adiciona resultado
        this.inventory.addItem(recipe.result, 1);
        alert(`${recipe.name} craftado com sucesso!`);
        
        return true;
    }
}