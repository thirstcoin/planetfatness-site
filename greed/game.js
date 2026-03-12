document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    const positions = [
        { x: 18, y: 28 }, { x: 38, y: 28 }, { x: 54, y: 28 }, { x: 73, y: 28 },
        { x: 17, y: 42 }, { x: 37, y: 42 }, { x: 55, y: 42 }, { x: 74, y: 42 },
        { x: 16, y: 64 }, { x: 37, y: 64 }, { x: 57, y: 64 }, { x: 76, y: 64 }
    ];

    container.innerHTML = '';

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        Object.assign(hitbox.style, {
            position: 'absolute',
            left: pos.x + '%',
            top: pos.y + '%',
            // ADD THIS: This centers the red circle on the coordinate
            transform: 'translate(-50%, -50%)', 
            width: '8%', 
            height: '10%',
            cursor: 'pointer',
            zIndex: '100',
            backgroundColor: 'rgba(255, 0, 0, 0.5)',
            borderRadius: '50%'
        });

        hitbox.onclick = () => {
            status.innerText = "You bit donut " + (index + 1);
        };

        container.appendChild(hitbox);
    });
});
