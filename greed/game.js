document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // Coordinates (Same as before)
    const positions = [
        { x: 13, y: 14 }, { x: 33, y: 14 }, { x: 53, y: 14 }, { x: 74, y: 14 },
        { x: 11, y: 37 }, { x: 32, y: 37 }, { x: 53, y: 37 }, { x: 76, y: 37 },
        { x: 10, y: 59 }, { x: 32, y: 59 }, { x: 55, y: 59 }, { x: 78, y: 59 }
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
