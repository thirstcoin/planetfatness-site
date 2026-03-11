document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // Coordinates (Same as before)
const positions = [
    // Top Row: Donut 3 (index 2) and Donut 4 (index 3) nudged left
    { x: 18, y: 28 }, { x: 38, y: 28 }, { x: 54, y: 28 }, { x: 73, y: 28 },
    // Middle Row
    { x: 17, y: 42 }, { x: 37, y: 42 }, { x: 55, y: 42 }, { x: 74, y: 42 },
    // Bottom Row
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
