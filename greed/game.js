// Remove any previous window.onload or alert calls
document.addEventListener("DOMContentLoaded", function() {
    const container = document.getElementById('game-container');
    const status = document.getElementById('status');

    if (!container) {
        alert("Wait! I can't find #game-container in your HTML.");
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
        
        // Use percentages so it scales with the image
        hitbox.style.left = pos.x + '%';
        hitbox.style.top = pos.y + '%';
        hitbox.style.width = '12%';
        hitbox.style.height = '15%';
        
        hitbox.onclick = function() {
            status.innerText = "You bit donut #" + (index + 1);
        };
        
        container.appendChild(hitbox);
    });
});
