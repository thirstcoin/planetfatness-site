document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    // These coordinates are locked in based on our previous calibration
    const positions = [
        { x: 37, y: 42 }, { x: 48, y: 42 }, { x: 61, y: 44 }, { x: 74, y: 42 },
        { x: 36, y: 53 }, { x: 49, y: 53 }, { x: 61, y: 53 }, { x: 75, y: 53 },
        { x: 35, y: 65 }, { x: 49, y: 65 }, { x: 63, y: 65 }, { x: 77, y: 64 }
    ];

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        Object.assign(hitbox.style, {
            left: pos.x + '%',
            top: pos.y + '%'
        });

        hitbox.onclick = () => {
            // Prevent re-clicking an already bitten donut
            if (hitbox.querySelector('.golden-donut, .poison-donut')) return;

            // Randomize outcome: 70% Gold, 30% Poison
            const isPoison = Math.random() < 0.3;
            const effectClass = isPoison ? 'poison-donut' : 'golden-donut';
            
            const resultLayer = document.createElement('div');
            resultLayer.className = effectClass;
            hitbox.appendChild(resultLayer);

            // Hide the red debug hitbox overlay after click
            hitbox.style.background = 'transparent';
            hitbox.style.border = 'none';

            status.innerText = isPoison ? "Oh no! Poison!" : "You found gold!";
        };

        container.appendChild(hitbox);
    });
});
