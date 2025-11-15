// Altar boy items in correct order for mass
const massItems = [
    { id: 1, name: 'Cruz Procesional', icon: '✝️', order: 1 },
    { id: 2, name: 'Velas', icon: '🕯️', order: 2 },
    { id: 3, name: 'Incensario', icon: '🔥', order: 3 },
    { id: 4, name: 'Misal', icon: '📖', order: 4 },
    { id: 5, name: 'Vinajeras', icon: '⚱️', order: 5 },
    { id: 6, name: 'Campanilla', icon: '🔔', order: 6 },
    { id: 7, name: 'Patena', icon: '⭕', order: 7 },
    { id: 8, name: 'Cáliz', icon: '🏆', order: 8 }
];

let score = 0;
let draggedCard = null;
let eventListenersInitialized = false;

// Initialize game
function initGame() {
    score = 0;
    updateScore();
    clearMessage();
    renderAvailableCards();
    renderDropZones();
    
    if (!eventListenersInitialized) {
        setupEventListeners();
        eventListenersInitialized = true;
    }
}

// Fisher-Yates shuffle algorithm for proper randomization
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

// Render available cards (shuffled)
function renderAvailableCards() {
    const container = document.getElementById('available-cards');
    container.innerHTML = '';
    
    // Shuffle cards using Fisher-Yates algorithm
    const shuffledItems = shuffleArray(massItems);
    
    shuffledItems.forEach(item => {
        const card = createCard(item);
        container.appendChild(card);
    });
}

// Create a card element
function createCard(item) {
    const card = document.createElement('div');
    card.className = 'card';
    card.draggable = true;
    card.dataset.itemId = item.id;
    card.dataset.order = item.order;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', `${item.name} - Arrastra para ordenar`);
    card.setAttribute('tabindex', '0');
    
    card.innerHTML = `
        <div class="icon" aria-hidden="true">${item.icon}</div>
        <div class="name">${item.name}</div>
    `;
    
    // Add drag event listeners
    card.addEventListener('dragstart', handleDragStart);
    card.addEventListener('dragend', handleDragEnd);
    
    return card;
}

// Render drop zones
function renderDropZones() {
    const container = document.getElementById('drop-zones');
    container.innerHTML = '';
    
    massItems.forEach((_, index) => {
        const dropZone = createDropZone(index + 1);
        container.appendChild(dropZone);
    });
}

// Create a drop zone element
function createDropZone(position) {
    const zone = document.createElement('div');
    zone.className = 'drop-zone';
    zone.dataset.position = `${position}º`;
    zone.dataset.expectedOrder = position;
    zone.setAttribute('role', 'button');
    zone.setAttribute('aria-label', `Zona de colocación ${position}`);
    zone.setAttribute('aria-dropeffect', 'move');
    
    // Add drop event listeners
    zone.addEventListener('dragover', handleDragOver);
    zone.addEventListener('drop', handleDrop);
    zone.addEventListener('dragleave', handleDragLeave);
    
    return zone;
}

// Drag and Drop Event Handlers
function handleDragStart(e) {
    draggedCard = e.target;
    e.target.classList.add('dragging');
    e.dataTransfer.effectAllowed = 'move';
}

function handleDragEnd(e) {
    e.target.classList.remove('dragging');
}

function handleDragOver(e) {
    if (e.preventDefault) {
        e.preventDefault();
    }
    e.dataTransfer.dropEffect = 'move';
    
    const dropZone = e.currentTarget;
    if (!dropZone.querySelector('.card')) {
        dropZone.classList.add('drag-over');
    }
    
    return false;
}

function handleDragLeave(e) {
    e.currentTarget.classList.remove('drag-over');
}

function handleDrop(e) {
    if (e.stopPropagation) {
        e.stopPropagation();
    }
    
    const dropZone = e.currentTarget;
    dropZone.classList.remove('drag-over');
    
    // Only allow one card per drop zone
    if (!dropZone.querySelector('.card') && draggedCard) {
        dropZone.appendChild(draggedCard);
        clearValidation();
    }
    
    return false;
}

// Setup event listeners for buttons
function setupEventListeners() {
    document.getElementById('check-btn').addEventListener('click', checkOrder);
    document.getElementById('reset-btn').addEventListener('click', initGame);
}

// Check if the order is correct
function checkOrder() {
    const dropZones = document.querySelectorAll('.drop-zone');
    let correct = 0;
    let total = 0;
    let allPlaced = true;
    
    dropZones.forEach(zone => {
        const card = zone.querySelector('.card');
        const expectedOrder = parseInt(zone.dataset.expectedOrder);
        
        if (card) {
            total++;
            const cardOrder = parseInt(card.dataset.order);
            
            if (cardOrder === expectedOrder) {
                zone.classList.add('correct');
                zone.classList.remove('incorrect');
                correct++;
            } else {
                zone.classList.add('incorrect');
                zone.classList.remove('correct');
            }
        } else {
            allPlaced = false;
        }
    });
    
    // Update score and message
    if (!allPlaced) {
        showMessage('¡Coloca todas las cartas antes de verificar!', 'info');
    } else if (correct === massItems.length) {
        score += 100;
        updateScore();
        showMessage('¡Perfecto! ¡Has ordenado correctamente todos los artículos! 🎉', 'success');
    } else {
        const percentage = Math.round((correct / massItems.length) * 100);
        score += correct * 10;
        updateScore();
        showMessage(`${correct} de ${massItems.length} correctos (${percentage}%). ¡Intenta de nuevo!`, 'error');
    }
}

// Clear validation styles
function clearValidation() {
    const dropZones = document.querySelectorAll('.drop-zone');
    dropZones.forEach(zone => {
        zone.classList.remove('correct', 'incorrect');
    });
}

// Update score display
function updateScore() {
    document.getElementById('score').textContent = score;
}

// Show message
function showMessage(text, type) {
    const messageEl = document.getElementById('message');
    messageEl.textContent = text;
    messageEl.className = `message ${type}`;
}

// Clear message
function clearMessage() {
    const messageEl = document.getElementById('message');
    messageEl.textContent = '';
    messageEl.className = 'message';
}

// Initialize game when page loads
document.addEventListener('DOMContentLoaded', initGame);
