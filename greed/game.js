document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    const positions = [
        // Top Row: 1, 2 down/right; 3, 4 down
        { x: 31, y: 40 }, { x: 45, y: 40 }, { x: 59, y: 40 }, { x: 74, y: 40 },
        // Middle Row: 5 right; 6 right; 7 slightly right; 8 locked
        { x: 31, y: 53 }, { x: 46, y: 53 }, { x: 59, y: 53 }, { x: 75, y: 53 },
        // Bottom Row: 9, 10, 11 up/right; 12 up
        { x: 30, y: 68 }, { x: 46, y: 68 }, { x: 62, y: 68 }, { x: 77, y: 66 }
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
            width: '7%', 
            height: '7%',
            cursor: 'pointer',
            zIndex: '100',
            // Once alignment is confirmed, change this to 'transparent'
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
