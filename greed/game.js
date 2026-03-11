alert("JS is running!");

window.onload = function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    const positions = [
        { x: 17, y: 34 }, { x: 38, y: 34 }, { x: 60, y: 34 }, { x: 81, y: 34 },
        { x: 17, y: 54 }, { x: 38, y: 54 }, { x: 60, y: 54 }, { x: 81, y: 54 },
        { x: 17, y: 74 }, { x: 38, y: 74 }, { x: 60, y: 74 }, { x: 81, y: 74 }
    ];

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        // Style directly to ensure visibility during testing
        hitbox.style.position = 'absolute';
        hitbox.style.width = '12%'; 
        hitbox.style.height = '15%';
        hitbox.style.left = pos.x + '%';
        hitbox.style.top = pos.y + '%';
        hitbox.style.backgroundColor = 'rgba(255, 0, 0, 0.3)'; // Visible red for debugging
        hitbox.style.borderRadius = '50%';
        hitbox.style.cursor = 'pointer';
        
        hitbox.onclick = () => {
            status.innerText = "Biting donut #" + index + "...";
        };
        
        container.appendChild(hitbox);
    });
};
