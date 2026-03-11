const positions = [
    // Row 1
    { x: 17, y: 34 }, { x: 38, y: 34 }, { x: 60, y: 34 }, { x: 81, y: 34 },
    // Row 2
    { x: 17, y: 54 }, { x: 38, y: 54 }, { x: 60, y: 54 }, { x: 81, y: 54 },
    // Row 3
    { x: 17, y: 74 }, { x: 38, y: 74 }, { x: 60, y: 74 }, { x: 81, y: 74 }
];

const container = document.getElementById('game-container');

function initGame() {
    // Clear existing children to prevent duplicates on refresh
    container.innerHTML = ''; 

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        // Use styles directly to ensure they aren't overridden by external CSS
        hitbox.style.position = 'absolute';
        hitbox.style.width = '12%'; 
        hitbox.style.height = '15%';
        hitbox.style.left = pos.x + '%';
        hitbox.style.top = pos.y + '%';
        hitbox.style.cursor = 'pointer';
        hitbox.style.zIndex = '100';
        
        hitbox.onclick = () => bite(index);
        container.appendChild(hitbox);
    });
}

function bite(id) {
    console.log("Biting donut:", id);
    const status = document.getElementById('status');
    if (status) {
        status.innerText = "Biting donut #" + id + "...";
    }
}

// Initialize the grid on load
initGame();

