document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // Coordinates (Same as before)
   const positions = [
    // Top Row (needs to be moved down)
    { x: 18, y: 18 }, { x: 38, y: 18 }, { x: 59, y: 18 }, { x: 79, y: 18 },
    // Middle Row (needs to be moved down)
    { x: 17, y: 40 }, { x: 37, y: 40 }, { x: 59, y: 40 }, { x: 79, y: 40 },
    // Bottom Row (needs to be moved down)
    { x: 16, y: 64 }, { x: 37, y: 64 }, { x: 59, y: 64 }, { x: 79, y: 64 }
];


    container.innerHTML = '';

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        Object.assign(hitbox.style, {
            position: 'absolute',
            left: pos.x + '%',
            top: pos.y + '%',
            // SHRUNK HITBOXES: Reduced from 13%/18% to 8%/10%
            width: '8%', 
            height: '10%',
            cursor: 'pointer',
            zIndex: '100',
            // Keep these visible for one last test
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderRadius: '50%'
        });

        hitbox.onclick = () => {
            status.innerText = "You bit donut " + (index + 1);
        };

        container.appendChild(hitbox);
    });
});
