document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    
    // Safety check
    if (!container) {
        console.error("game-container not found in HTML!");
        return;
    }

    const positions = [
        { x: 17, y: 34 }, { x: 38, y: 34 }, { x: 60, y: 34 }, { x: 81, y: 34 },
        { x: 17, y: 54 }, { x: 38, y: 54 }, { x: 60, y: 54 }, { x: 81, y: 54 },
        { x: 17, y: 74 }, { x: 38, y: 74 }, { x: 60, y: 74 }, { x: 81, y: 74 }
    ];

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        // Applying styles directly to ensure visibility
        hitbox.style.position = 'absolute';
        hitbox.style.width = '12%';
        hitbox.style.height = '15%';
        hitbox.style.left = pos.x + '%';
        hitbox.style.top = pos.y + '%';
        hitbox.style.backgroundColor = 'rgba(255, 0, 0, 0.4)'; // Red overlay for testing
        hitbox.style.zIndex = '999';
        hitbox.style.cursor = 'pointer';
        
        hitbox.onclick = function() {
            console.log("Donut clicked:", index);
            alert("Clicked: " + index);
        };
        
        container.appendChild(hitbox);
    });
    console.log("Hitboxes generated!");
});
