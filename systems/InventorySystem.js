export class InventorySystem {
    constructor() {
        this.slots = new Array(20).fill(null);
        this.selectedSlot = 0;
        this.itemTypes = {
            madeira: { name: 'Madeira', icon: '🌲', stackable: true },
            pedra: { name: 'Pedra', icon: '🪨', stackable: true },
            fibra: { name: 'Fibra', icon: '🌿', stackable: true },
            fruta: { name: 'Fruta', icon: '🍎', stackable: true, healAmount: 10 },
            lenhador: { name: 'Lenhador', icon: '🪓', stackable: false },
            mineiro: { name: 'Mineiro', icon: '⛏️', stackable: false },
            pocao: { name: 'Poção', icon: '🧪', stackable: true, healAmount: 20 }
        };
    }
    
    addItem(itemType, quantity = 1) {
        const itemDef = this.itemTypes[itemType];
        if (!itemDef) return false;
        
        // Se é stackable, tenta empilhar primeiro
        if (itemDef.stackable) {
            for (let i = 0; i < this.slots.length; i++) {
                const slot = this.slots[i];
                if (slot && slot.type === itemType) {
                    slot.quantity += quantity;
                    this.updateUI();
                    return true;
                }
            }
        }
        
        // Procura slot vazio
        for (let i = 0; i < this.slots.length; i++) {
            if (!this.slots[i]) {
                this.slots[i] = {
                    type: itemType,
                    quantity: quantity
                };
                this.updateUI();
                return true;
            }
        }
        
        return false; // Inventário cheio
    }
    
    removeItem(itemType, quantity = 1) {
        for (let i = 0; i < this.slots.length; i++) {
            const slot = this.slots[i];
            if (slot && slot.type === itemType) {
                if (slot.quantity > quantity) {
                    slot.quantity -= quantity;
                } else {
                    this.slots[i] = null;
                }
                this.updateUI();
                return true;
            }
        }
        return false;
    }
    
    hasItem(itemType, quantity = 1) {
        let total = 0;
        for (const slot of this.slots) {
            if (slot && slot.type === itemType) {
                total += slot.quantity;
                if (total >= quantity) return true;
            }
        }
        return false;
    }
    
    getSelectedItem() {
        return this.slots[this.selectedSlot];
    }
    
    useSelectedItem(game) {
        const item = this.getSelectedItem();
        if (!item) return false;
        
        const itemDef = this.itemTypes[item.type];
        
        if (item.type === 'fruta' || item.type === 'pocao') {
            // Cura o jogador
            game.healthSystem.heal(itemDef.healAmount);
            this.removeItem(item.type, 1);
            return true;
        }
        
        return false;
    }
    
    selectSlot(index) {
        if (index >= 0 && index < this.slots.length) {
            this.selectedSlot = index;
            this.updateUI();
        }
    }
    
    updateUI() {
        const event = new CustomEvent('inventoryUpdate', { detail: this.slots });
        window.dispatchEvent(event);
    }
}