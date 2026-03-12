document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // Manually tuned for perspective and your request
    const positions = [
        // Top Row: 1, 2 moved right. 3, 4 kept original.
        { x: 29, y: 35 }, { x: 44, y: 35 }, { x: 58, y: 35 }, { x: 74, y: 35 },
        // Middle Row: 5, 6 moved right. 7, 8 kept original.
        { x: 28, y: 52 }, { x: 43, y: 52 }, { x: 59, y: 52 }, { x: 75, y: 52 },
        // Bottom Row: 9, 10 moved right. 11, 12 moved up (y: 69).
        { x: 26, y: 72 }, { x: 43, y: 72 }, { x: 60, y: 69 }, { x: 77, y: 69 }
    ];

    container.innerHTML = '';

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        Object.assign(hitbox.style, {
            position: 'absolute',
            left: pos.x + '%',
            top: pos.y + '%',
            transform: 'translate(-50%, -50%)', 
            width: '10%',
            aspectRatio: '1/1',
            cursor: 'pointer',
            zIndex: '100',
            backgroundColor: 'rgba(255, 0, 0, 0.4)', 
            border: '1px solid white',
            borderRadius: '50%'
        });

        hitbox.onclick = () => {
            status.innerText = "You bit donut " + (index + 1);
        };

        container.appendChild(hitbox);
    });
});
