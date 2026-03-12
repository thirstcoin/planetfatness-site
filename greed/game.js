document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // Final surgical adjustments applied
    const positions = [
        // Top Row: 1, 2 (down/right); 3 (down); 4 (keep)
        { x: 33, y: 42 }, { x: 47, y: 42 }, { x: 59, y: 43 }, { x: 74, y: 40 },
        // Middle Row: 5 (right); 6 (right); 7 (slight right); 8 (locked)
        { x: 34, y: 53 }, { x: 49, y: 53 }, { x: 60, y: 53 }, { x: 75, y: 53 },
        // Bottom Row: 9 (up/right); 10 (up/right); 11 (up/right); 12 (up)
        { x: 33, y: 66 }, { x: 49, y: 66 }, { x: 65, y: 65 }, { x: 77, y: 64 }
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
            // Once you are happy with these, change to 'transparent'
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
