document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // These coordinates are manually tuned for perspective
    const positions = [
        // Row 1 (Back/Top)
        { x: 26, y: 35 }, { x: 41, y: 35 }, { x: 58, y: 35 }, { x: 74, y: 35 },
        // Row 2 (Middle)
        { x: 25, y: 52 }, { x: 40, y: 52 }, { x: 59, y: 52 }, { x: 75, y: 52 },
        // Row 3 (Front/Bottom)
        { x: 23, y: 72 }, { x: 40, y: 72 }, { x: 60, y: 72 }, { x: 77, y: 72 }
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
            width: '10%', // Increased slightly for better touch target
            aspectRatio: '1/1',
            cursor: 'pointer',
            zIndex: '100',
            backgroundColor: 'rgba(255, 0, 0, 0.4)', // Toggle to 'transparent' when ready
            border: '1px solid white',
            borderRadius: '50%'
        });

        hitbox.onclick = () => {
            status.innerText = "You bit donut " + (index + 1);
        };

        container.appendChild(hitbox);
    });
});
