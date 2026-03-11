const positions = [
    { x: 17, y: 34 }, { x: 38, y: 34 }, { x: 60, y: 34 }, { x: 81, y: 34 },
    { x: 17, y: 54 }, { x: 38, y: 54 }, { x: 60, y: 54 }, { x: 81, y: 54 },
    { x: 17, y: 74 }, { x: 38, y: 74 }, { x: 60, y: 74 }, { x: 81, y: 74 }
];

function initGame() {
    const container = document.getElementById('game-container');
    if (!container) {
        console.error("Container not found!");
        return;
    }

    container.innerHTML = ''; 

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        // Explicitly setting dimensions and position
        Object.assign(hitbox.style, {
            position: 'absolute',
            width: '10%',
            height: '10%',
            left: pos.x + '%',
            top: pos.y + '%',
            zIndex: '100',
            cursor: 'pointer',
            // Temporarily use a color to confirm they are drawing
            backgroundColor: 'rgba(255, 0, 0, 0.3)' 
        });
        
        hitbox.onclick = () => bite(index);
        container.appendChild(hitbox);
    });
}

function bite(id) {
    document.getElementById('status').innerText = "Biting donut #" + id;
}

// Run after page load
window.onload = initGame;
