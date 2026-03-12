document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // Final alignment tweak for Column 1
    const positions = [
        // Top Row: 1 (nudged right), 2, 3, 4
        { x: 37, y: 42 }, { x: 48, y: 42 }, { x: 61, y: 44 }, { x: 74, y: 42 },
        // Middle Row: 5 (nudged right), 6, 7, 8
        { x: 36, y: 53 }, { x: 49, y: 53 }, { x: 61, y: 53 }, { x: 75, y: 53 },
        // Bottom Row: 9 (nudged right), 10, 11, 12
        { x: 35, y: 65 }, { x: 49, y: 65 }, { x: 63, y: 65 }, { x: 77, y: 64 }
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
            // Once alignment is perfect, set to 'transparent'
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
