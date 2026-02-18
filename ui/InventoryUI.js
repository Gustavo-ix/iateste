export class InventoryUI {
    constructor(game) {
        this.game = game;
        this.inventory = game.inventorySystem;
        this.isVisible = false;
        
        this.setupUI();
        this.setupEventListeners();
    }
    
    setupUI() {
        const grid = document.getElementById('inventory-grid');
        
        // Cria slots
        for (let i = 0; i < 20; i++) {
            const slot = document.createElement('div');
            slot.className = 'inventory-slot';
            slot.dataset.index = i;
            
            // Adiciona hotkey hint
            if (i < 5) {
                const hotkey = document.createElement('small');
                hotkey.textContent = i + 1;
                hotkey.style.position = 'absolute';
                hotkey.style.top = '2px';
                hotkey.style.left = '2px';
                hotkey.style.color = '#888';
                slot.appendChild(hotkey);
            }
            
            slot.addEventListener('click', () => {
                this.inventory.selectSlot(parseInt(slot.dataset.index));
            });
            
            grid.appendChild(slot);
        }
        
        // Hotkeys 1-5
        for (let i = 0; i < 5; i++) {
            const key = (i + 1).toString();
            window.addEventListener('keydown', (e) => {
                if (e.key === key) {
                    this.inventory.selectSlot(i);
                    e.preventDefault();
                }
            });
        }
    }
    
    setupEventListeners() {
        window.addEventListener('inventoryUpdate', (e) => {
            this.updateInventoryDisplay(e.detail);
        });
        
        window.addEventListener('resourceCollected', (e) => {
            const { type, quantity } = e.detail;
            this.inventory.addItem(type, quantity);
            
            // Feedback visual
            this.showMessage(`+${quantity} ${type}`);
        });
    }
    
    updateInventoryDisplay(slots) {
        const grid = document.getElementById('inventory-grid');
        const slotElements = grid.children;
        
        for (let i = 0; i < slots.length; i++) {
            const slot = slotElements[i];
            const item = slots[i];
            
            // Limpa slot
            slot.innerHTML = '';
            
            // Adiciona hotkey hint novamente
            if (i < 5) {
                const hotkey = document.createElement('small');
                hotkey.textContent = i + 1;
                hotkey.style.position = 'absolute';
                hotkey.style.top = '2px';
                hotkey.style.left = '2px';
                hotkey.style.color = '#888';
                slot.appendChild(hotkey);
            }
            
            if (item) {
                const itemDef = this.inventory.itemTypes[item.type];
                
                // Ícone
                const icon = document.createElement('span');
                icon.className = 'item-icon';
                icon.textContent = itemDef.icon;
                slot.appendChild(icon);
                
                // Quantidade (se > 1)
                if (item.quantity > 1) {
                    const count = document.createElement('span');
                    count.className = 'item-count';
                    count.textContent = item.quantity;
                    slot.appendChild(count);
                }
                
                // Destaque para slot selecionado
                if (i === this.inventory.selectedSlot) {
                    slot.classList.add('selected');
                } else {
                    slot.classList.remove('selected');
                }
            }
        }
    }
    
    showMessage(text) {
        // Cria elemento de mensagem temporária
        const msg = document.createElement('div');
        msg.textContent = text;
        msg.style.position = 'absolute';
        msg.style.top = '50%';
        msg.style.left = '50%';
        msg.style.transform = 'translate(-50%, -50%)';
        msg.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
        msg.style.color = 'white';
        msg.style.padding = '10px 20px';
        msg.style.borderRadius = '5px';
        msg.style.zIndex = '1000';
        msg.style.pointerEvents = 'none';
        
        document.body.appendChild(msg);
        
        setTimeout(() => {
            document.body.removeChild(msg);
        }, 1500);
    }
    
    toggle() {
        this.isVisible = !this.isVisible;
        const panel = document.getElementById('inventory-panel');
        if (this.isVisible) {
            panel.classList.remove('hidden');
        } else {
            panel.classList.add('hidden');
        }
    }
}