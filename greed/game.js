document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // These coordinates are mapped to the perspective of the donut box.
    // X and Y are percentages relative to the #game-container.
    const positions = [
        // Top Row: Nudged to center based on your last feedback
        { x: 30, y: 38 }, { x: 44, y: 38 }, { x: 59, y: 38 }, { x: 74, y: 38 },
        // Middle Row
        { x: 29, y: 53 }, { x: 43, y: 53 }, { x: 58, y: 53 }, { x: 75, y: 53 },
        // Bottom Row
        { x: 27, y: 70 }, { x: 43, y: 70 }, { x: 59, y: 70 }, { x: 77, y: 70 }
    ];

    container.innerHTML = '';

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        // This keeps the hitbox pinned to the center of the coordinate
        Object.assign(hitbox.style, {
            position: 'absolute',
            left: pos.x + '%',
            top: pos.y + '%',
            transform: 'translate(-50%, -50%)', 
            width: '7%', 
            height: '7%',
            cursor: 'pointer',
            zIndex: '100',
            // Keep this visible until you confirm alignment, then change to 'transparent'
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
