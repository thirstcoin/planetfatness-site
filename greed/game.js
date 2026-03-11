// Keep the alert to confirm the file loaded
alert("JS is running!");

function setupGame() {
    let container = document.getElementById('game-container');
    
    // If the HTML div is missing for some reason, this creates it
    if (!container) {
        container = document.createElement('div');
        container.id = 'game-container';
        document.body.prepend(container);
    }

    // FORCE CSS via JS
    container.style.position = 'relative';
    container.style.width = '100vw';
    container.style.height = '66.6vw'; // Maintains the 1536/1024 ratio
    container.style.backgroundImage = "url('../assets/greed/board.png')";
    container.style.backgroundSize = 'contain';
    container.style.backgroundRepeat = 'no-repeat';
    container.style.border = '5px solid yellow'; 
    container.style.margin = "0 auto";

    // UPDATED COORDINATES: Adjusted for the perspective of the box
    const positions = [
        { x: 13, y: 14 }, { x: 33, y: 14 }, { x: 53, y: 14 }, { x: 74, y: 14 }, // Top Row
        { x: 11, y: 37 }, { x: 32, y: 37 }, { x: 53, y: 37 }, { x: 76, y: 37 }, // Middle Row
        { x: 10, y: 59 }, { x: 32, y: 59 }, { x: 55, y: 59 }, { x: 78, y: 59 }  // Bottom Row
    ];

    // Clear container to avoid double-rendering on refresh
    container.innerHTML = '';

    positions.forEach((pos, index) => {
        const hitbox = document.createElement('div');
        hitbox.className = 'donut-hitbox';
        
        // Force styles with red visibility for testing
        Object.assign(hitbox.style, {
            position: 'absolute',
            left: pos.x + '%',
            top: pos.y + '%',
            width: '13%', // Slightly wider to cover the donuts better
            height: '18%', // Slightly taller for perspective
            backgroundColor: 'rgba(255, 0, 0, 0.7)',
            border: '2px solid white',
            borderRadius: '50%',
            zIndex: '9999',
            display: 'block',
            cursor: 'pointer'
        });

        hitbox.onclick = () => {
            // Update the status text if it exists
            const status = document.getElementById('status');
            if(status) status.innerText = "You bit donut " + (index + 1);
            alert("You bit donut " + (index + 1));
        };

        container.appendChild(hitbox);
    });
}

// Ensure the script waits for the body to be available
const checkExist = setInterval(function() {
   if (document.body) {
      setupGame();
      clearInterval(checkExist);
   }
}, 500);
