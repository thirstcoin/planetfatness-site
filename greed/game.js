document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // Coordinates (Same as before)
 const positions = [
    // Top Row: Nudged 3rd and 4th columns left
    { x: 18, y: 28 }, { x: 38, y: 28 }, { x: 57, y: 28 }, { x: 76, y: 28 },
    // Middle Row: Nudged 3rd and 4th columns left
    { x: 17, y: 40 }, { x: 37, y: 40 }, { x: 57, y: 40 }, { x: 76, y: 40 },
    // Bottom Row: Nudged 3rd and 4th columns left
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
