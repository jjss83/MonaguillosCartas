// Lista de artífices (elementos litúrgicos) en el orden correcto según la Misa
const artifices = [
    { id: 1, name: 'Cruz procesional', icon: '✝️', order: 1 },
    { id: 2, name: 'Velas o ciriales', icon: '🕯️', order: 2 },
    { id: 3, name: 'Vinajeras', icon: '🍶', order: 3 },
    { id: 4, name: 'Lavabo (agua y toalla)', icon: '💧', order: 4 },
    { id: 5, name: 'Campana', icon: '🔔', order: 5 },
    { id: 6, name: 'Incensario', icon: '🔥', order: 6 },
    { id: 7, name: 'Misal', icon: '📖', order: 7 },
    { id: 8, name: 'Patena y Cáliz', icon: '🍷', order: 8 }
];

let score = 0;
let draggedElement = null;

// Inicializar el juego
function initGame() {
    score = 0;
    updateScore();
    renderCards();
    clearMessage();
}

// Barajar el array de cartas
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Renderizar las cartas
function renderCards() {
    const availableCardsArea = document.getElementById('available-cards');
    const orderArea = document.getElementById('order-area');
    
    availableCardsArea.innerHTML = '';
    orderArea.innerHTML = '';
    
    // Barajar las cartas
    const shuffledCards = shuffleArray(artifices);
    
    // Crear cartas barajadas
    shuffledCards.forEach(artifice => {
        const card = createCard(artifice);
        availableCardsArea.appendChild(card);
    });
}

// Crear una carta
function createCard(artifice) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.id = artifice.id;
    card.dataset.order = artifice.order;
    
    card.innerHTML = `
        <div class="card-icon">${artifice.icon}</div>
        <div class="card-name">${artifice.name}</div>
    `;
    
    // Eventos de arrastre
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    return card;
}

// Manejar inicio de arrastre
function handleDragStart(e) {
    draggedElement = this;
    this.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/html', this.innerHTML);
}

// Manejar fin de arrastre
function handleDragEnd(e) {
    this.classList.remove('dragging');
}

// Configurar zonas de soltar
function setupDropZones() {
    const availableCardsArea = document.getElementById('available-cards');
    const orderArea = document.getElementById('order-area');
    
    [availableCardsArea, orderArea].forEach(zone => {
        zone.addEventListener('dragover', handleDragOver);
        zone.addEventListener('drop', handleDrop);
        zone.addEventListener('dragleave', handleDragLeave);
    });
}

// Manejar arrastre sobre zona
function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    return false;
}

// Manejar salida de zona
function handleDragLeave(e) {
    // Código para manejar cuando sale de la zona
}

// Manejar soltar
function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    if (draggedElement) {
        // Si se suelta en un área diferente de donde está
        if (this !== draggedElement.parentNode) {
            this.appendChild(draggedElement);
        }
    }
    
    return false;
}

// Actualizar puntuación
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Verificar el orden
function checkOrder() {
    const orderArea = document.getElementById('order-area');
    const cards = orderArea.querySelectorAll('.card');
    
    if (cards.length === 0) {
        showMessage('¡Coloca al menos una carta en el área de orden!', 'error');
        return;
    }
    
    let isCorrect = true;
    let correctCount = 0;
    
    // Verificar si todas las cartas están en el área de orden
    if (cards.length !== artifices.length) {
        showMessage(`Coloca todas las ${artifices.length} cartas en el área de orden`, 'error');
        return;
    }
    
    // Verificar el orden
    cards.forEach((card, index) => {
        const expectedOrder = index + 1;
        const actualOrder = parseInt(card.dataset.order);
        
        if (expectedOrder === actualOrder) {
            correctCount++;
        } else {
            isCorrect = false;
        }
    });
    
    if (isCorrect) {
        score += 100;
        updateScore();
        showMessage('¡Excelente! ¡Orden correcto! +100 puntos', 'success');
    } else {
        showMessage(`Casi... ${correctCount} de ${artifices.length} están en el lugar correcto. ¡Inténtalo de nuevo!`, 'error');
    }
}

// Mostrar mensaje
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

// Limpiar mensaje
function clearMessage() {
    const messageEl = document.getElementById('message');
    messageEl.textContent = '';
    messageEl.className = 'message';
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    initGame();
    setupDropZones();
    
    document.getElementById('reset-btn').addEventListener('click', initGame);
    document.getElementById('check-btn').addEventListener('click', checkOrder);
});
