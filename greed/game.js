document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // These are the "Locked" coordinates from your final successful testing
    const positions = [
        { x: 37, y: 42 }, { x: 48, y: 42 }, { x: 61, y: 44 }, { x: 74, y: 42 },
        { x: 36, y: 53 }, { x: 49, y: 53 }, { x: 61, y: 53 }, { x: 75, y: 53 },
        { x: 35, y: 65 }, { x: 49, y: 65 }, { x: 63, y: 65 }, { x: 77, y: 64 }
    ];

    container.innerHTML = '';

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        // Pin to the percentage
        hitbox.style.left = pos.x + '%';
        hitbox.style.top = pos.y + '%';

        hitbox.onclick = () => {
            if (hitbox.querySelector('.golden-donut, .poison-donut')) return;

            const isPoison = Math.random() < 0.3;
            const effect = document.createElement('div');
            effect.className = isPoison ? 'poison-donut' : 'golden-donut';
            
            hitbox.appendChild(effect);
            
            // Remove debug styles on interaction
            hitbox.style.background = 'transparent';
            hitbox.style.border = 'none';

            status.innerText = isPoison ? "Oh no! Poison!" : "You found gold!";
        };

        container.appendChild(hitbox);
    });
});
