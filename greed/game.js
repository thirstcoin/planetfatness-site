document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

  const positions = [
    // Top Row: Nudged X values slightly right (added +4 to each)
    { x: 22, y: 28 }, { x: 42, y: 28 }, { x: 58, y: 28 }, { x: 77, y: 28 },
    // Middle Row: Nudged X values slightly right
    { x: 21, y: 42 }, { x: 41, y: 42 }, { x: 59, y: 42 }, { x: 78, y: 42 },
    // Bottom Row: Nudged X values slightly right
    { x: 20, y: 64 }, { x: 41, y: 64 }, { x: 61, y: 64 }, { x: 80, y: 64 }
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
