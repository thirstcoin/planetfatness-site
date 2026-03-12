document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');
    const multiplierDisplay = document.getElementById('multiplier-display');
    const poisonOverlay = document.getElementById('poison-overlay');
    
    // --- GAME STATE ---
    let multiplier = 1.0;
    const multipliers = [1.1, 1.3, 1.5, 1.7, 1.9, 2.1, 2.3, 2.5, 2.7, 3.0];
    let goldFoundCount = 0;
    let poisonIndices = [];
    let isGameOver = false;

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
        
        Object.assign(hitbox.style, {
            position: 'absolute',
            left: pos.x + '%',
            top: pos.y + '%',
            transform: 'translate(-50%, -50%)', 
            width: '7%', 
            height: '7%',
            cursor: 'pointer',
            zIndex: '100',
            backgroundColor: 'rgba(255, 255, 255, 0.2)', // Set to faint white initially
            border: '1px solid white',
            borderRadius: '50%'
        });

               hitbox.onclick = () => {
            // Prevent interaction if game over or already clicked
            if (isGameOver || hitbox.dataset.clicked === "true") return;
            
            // Mark as clicked
            hitbox.dataset.clicked = "true";
            // Add the new class for visual feedback (defined in CSS)
            hitbox.classList.add('chosen');

            if (poisonIndices.includes(index)) {
                // POISON HIT
                isGameOver = true;
                // Force red color for the poison donut
                hitbox.style.backgroundColor = 'rgba(255, 0, 0, 0.8)';
                status.innerText = "POISON! Game Over.";
                poisonOverlay.style.display = 'flex'; 
            } else {
                // GOLD HIT
                multiplier = multipliers[goldFoundCount] || 3.0;
                goldFoundCount++;
                multiplierDisplay.innerText = `x${multiplier.toFixed(1)}`;
                status.innerText = `Gold Found!`;
            }
        };
        
        container.appendChild(hitbox);
    });
});
