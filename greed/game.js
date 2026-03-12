document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');
    
    // --- GAME STATE ---
    let multiplier = 1.0;
    let poisonIndices = [];
    
    // Randomly assign 2 poison indices
    while (poisonIndices.length < 2) {
        let rand = Math.floor(Math.random() * 12);
        if (!poisonIndices.includes(rand)) poisonIndices.push(rand);
    }

    const positions = [
        { x: 37, y: 42 }, { x: 48, y: 42 }, { x: 61, y: 44 }, { x: 74, y: 42 },
        { x: 36, y: 53 }, { x: 49, y: 53 }, { x: 61, y: 53 }, { x: 75, y: 53 },
        { x: 35, y: 65 }, { x: 49, y: 65 }, { x: 63, y: 65 }, { x: 77, y: 64 }
    ];

    container.innerHTML = '';

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        // Applying your exact styles
        Object.assign(hitbox.style, {
            position: 'absolute',
            left: pos.x + '%',
            top: pos.y + '%',
            transform: 'translate(-50%, -50%)', 
            width: '7%', 
            height: '7%',
            cursor: 'pointer',
            zIndex: '100',
            backgroundColor: 'rgba(255, 0, 0, 0.4)', 
            border: '1px solid white',
            borderRadius: '50%'
        });

        // --- NEW LOGIC LAYER ---
        hitbox.onclick = () => {
            // Prevent double-clicking
            if (hitbox.dataset.clicked === "true") return;
            hitbox.dataset.clicked = "true";

            if (poisonIndices.includes(index)) {
                // POISON HIT
                status.innerText = "POISON! Multiplier reset.";
                multiplier = 1.0;
                // Add code here to trigger your green screen overlay
            } else {
                // GOLD HIT
                multiplier += 0.5;
                status.innerText = `Gold Found! Multiplier: x${multiplier.toFixed(1)}`;
                // Add code here to trigger your golden overlay asset
            }
        };

        container.appendChild(hitbox);
    });
});
